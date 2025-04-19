
class GuildHall extends GameMap {
    #level 

    constructor() {
        super();
        this.tileId = 487;
        this.#level = 1;
        this.name   = `Guild Hall (${this.#level})`;
    }

    set level(value) {
        this.#level = value;
        this.name   = `Guild Hall (${this.#level})`;
    }

    tick(t) {
        if (this._ticks % 200 == 0)
        {
            hero.recoverPerc("life", 25);
        }
        if (Chance.int(1, 1000) == 1) {
            hero.give("potion", 1);
        }
        ++this._ticks;
    }
}

class Dungeon extends GameMap {
    #level

    constructor() {
        super();
        this.tileId = 587;
        this.#level = 0;
        this.name   = `Dungeon (${this.#level})`;
        this.spawns = {};

        this.spawns[1] = [ "rat", "worm" ];
        this.spawns[2] = [ "rat", "worm", "wasp"];
        this.spawns[3] = ["sheep", "wasp"];
        this.spawns[4] = ["ratII", "snake", "wasp", "rare1"];

        this.levelDetail = {};

        this.turn      = 1;
        this.unlocked  = 1;
        this.target    = undefined;
        this.advanceLevel();
    }

    postLoad(name, level) {
        if (level == undefined) level = parseInt(prompt("Choose a level", this.level));
        if (level <= this.unlocked && level > 0) this.level = level;
        else map.load("guildHall");
    }

    load(name)
    {
        super.load(name);
        this.target = undefined;
    }

    get level() {
        return this.#level;
    }

    defeat(target) {
        super.defeat(target);
        if (target != hero)
            ++this.levelDetail[this.#level].kills;
        else
            --this.levelDetail[this.#level].defeats;

        this.leave(target);

        if (this.levelDetail[this.#level].kills >= 5 && this.unlocked <= $settings.maxDungeonLevel) {
            if (this.unlocked <= this.#level) {
                this.unlocked = this.#level + 1;
                this.createLevel(this.unlocked);
                const ev = new CustomEvent("Idle.unlock", {detail: {target, unlocked: this.unlocked, map: this}});
                dispatchEvent(ev);
            }
        }
    }

    leave(targets) {
        if (!Array.isArray(targets)) targets = [targets];
        
        for (const target of targets) {
            const idx = this.target.indexOf(target);
            if (idx != -1) {
                this.target.splice(idx, 1);
            }
    
            if (this.target.length == 0) {
                this.target = undefined;
            }
        }
    }

    createLevel(level) {
        this.levelDetail[level] = {
            kills: 0,
            defeats: 0
        }
    }

    advanceLevel() {
        if (this.level + 1 >= $settings.maxDungeonLevel) {
            return;
        }
        this.level = this.#level + 1;
        this.createLevel(this.level);
    }

    set level(value) {
        this.#level = value;
        this.name   = `Dungeon (${this.#level})`;
        if (this.levelDetail[this.level] == undefined) {
            this.createLevel(this.level);
        }
    }

    spawnRandom()
    {
        const spawner = Chance.pick(this.spawns[this.#level]);
        const target  = $units[spawner].clone();
        target.troopLoc = this.target.length - 1;
        target.equipItems();
        this.target.push(target);
        return target;
    }

    spawn()
    {
        if (this.target == undefined) this.target = [];
        const detail  = this.levelDetail[this.level];
        const diff   = detail.kills - detail.defeats;
        if (diff >= $settings.spawnDiff) {
            const c = (diff - ($settings.spawnDiff-1)) / $settings.spawnRatio;
            if (Chance.chance(c)) {
                this.spawnRandom();
            }
            this.spawnRandom();
        } else {
            this.spawnRandom();
        }
    }

    tick(t) {
        if (this.target == undefined) {
            if (this._ticks % $settings.spawnTick == 0)
                this.spawn();
        } else {
            for (const target of this.target) {
                target.tick(t);
            }

            if (this._ticks % $settings.attackTick == 0) {
                if (this.turn == 0) {
                    hero.active = true;
                    hero.attack(this.target);
                    for (const summon of $summons) {
                        if (summon && this.target) summon.attack(this.target);
                    }
                    this.turn = (this.turn + 1) % 2;
                } else {
                    hero.active = false;
                    const list  = [hero];
                    for (const summon of $summons) {
                        if (summon) list.push(summon);
                    }
                    let left = [];
                    for (const target of this.target) {
                        if (target.runChance && Chance.chance(target.runChance)) {
                            left.push(target);
                            continue;
                        }
                        target.active = true;
                        target.attack(list);
                    }
                    this.leave(left);
                    this.turn = (this.turn + 1) % 2;
                }
            }
        }
        super.tick(t);
    }

    draw(ctx, sprites)
    {
        super.draw(ctx, sprites);
        if (this.target)
            for (const target of this.target)
                target.draw(ctx, sprites);
    }
}

$maps = {
    guildHall: new GuildHall(),
    dungeon: new Dungeon()
};