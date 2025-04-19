
class BasicAttack extends Offense {
    constructor(obj) {
        super();
        Object.assign(this, obj);
    }

    calcDmg() 
    {
        let dmg = 0;
        for (const atk of this.attacks) {
            dmg += atk.damage;
        }
        return dmg;
    }

    attackTarget(attacker, defender, defenseRoll) {
        const dmg = defenseRoll ? defenseRoll.defend(this.attacks, defender, attacker) : this.calcDmg();

        if (dmg > 0) {
            defender.wasHit = true;
            if (attacker == hero) {
                const audio = new Audio(`files/assets/${this.hitSound || "combat-hit-melee.mp3"}`);
                audio.play();
            }
        }

        defender.life[0] -= dmg;
        if (defender.life[0] <= 0) {
            defender.defeat(attacker);
        }
        defender.update();
    }
}

class BasicDefense extends Defense {
    constructor(obj) {
        super();
        Object.assign(this, obj);
    }

    defend(attacks, defender, attacker) {
        const block = Chance.chance(this.ac);
        if (block && defender == hero) {
            const audio = new Audio(`files/assets/${this.defendSound || "armor-block.mp3"}`);
            audio.play();
        }
        let ratio    = block ? 0.5 : 1;
        let dmg = 0;
        const defenseTypes = ["blunt", "slash", "thrust"];
        const magicTypes   = ["magic", "arcane", "chaos"];
        for (const atk of attacks) {
            if (defenseTypes.indexOf(atk.damageType) != -1) {
                const d = atk.damage - (this.defense||0);
                if (d > 0)
                    dmg += d;
            } else if (magicTypes.indexOf(atk.damageType) != -1) {
                const d = atk.damage - (this.mdefense||0);
                if (d > 0)
                    dmg += d;
            } else if (atk.damageType in this.protections) {
                const d = atk.damage - (this.protections[atk.damageType]||0);
                if (d > 0)
                    dmg += d;
            }
        }
        return dmg * ratio;
    }
}

class BasicSummon extends Accessory {
    constructor(obj) {
        super();
        Object.assign(this, obj);
    }

    unequip(from, map, id) 
    {
        if (map == $maps.dungeon) {
            return alert("You cannot unequip during battle!");
        }
        $summons[this.summonId] = undefined;
        super.equip(from, map, id);
    }

    equip(from, map, id) {
        const unit = $units[this.summon].clone();
        unit.type  = "summon";
        unit.team  = "good";
        unit.troopLoc = this.summonId;
        $summons[this.summonId] = unit;
        super.equip(from, map, id);
    }
}

$items = {
    potions: new Item({
        graphicId: 2713,
        cost: 50,
        name: "Small Life Potion",
        desc: "A life potion. heals by 25%"
    }),
    stuffedAnimal: new Item({
        graphicId: 2622,
        cost: 50,
        name: "Stuffed Animal",
        desc: "A stuffed animal! only for looks!"
    }),   
    ratStaff: new BasicSummon({
        name: "Rat Staff",
        desc: `Summons a Rat! For 1st slot!`,
        cost: 100,
        shop: true,
        summon: "rat",
        summonId: 0,
        graphicId: 2828
    }),
    ratStaff2: new BasicSummon({
        name: "Rat Staff",
        desc: `Summons a Rat! For 2nd slot!`,
        cost: 150,
        shop: true,
        summon: "rat",
        summonId: 1,
        graphicId: 2828
    }),
}

$weapons = {
    rock: new BasicAttack({
        name:"Rock",
        desc: `A rock. Deals 1 blunt damage`,
        cost: 5,
        hit: "combat-hit-melee.mp3",
        attacks: [{ damage: 1,
        damageType: "blunt" }]
    }),
    stone: new BasicAttack({
        name: "Stone",
        desc: `A stone. Deals 2 blunt damage`,
        cost: 10,
        attacks: [{
            damage: 2,
            damageType: "blunt",
        }],
        graphicId: 3187
    }),
    wormBite: new BasicAttack({
        name: "Worm Staff",
        desc: `Deals 1 Magic Damage`,
        cost: 2828,
        shop: false,
        attacks: [{ damage: 1,
        damageType: "magic" }],
        graphicId: 2828
    }),
    knife: new BasicAttack({
        name: "Knife",
        desc: `A small knife. Deals 3 slash damage`,
        cost: 25,
        attacks: [{
            damage: 3,
            damageType: "slash",
        }],
        graphicId: 2971
    }),
}

$armors = {
    cloth:
    new BasicDefense({
        name: "Cloth",
        desc: `Cloth Armor. 1% Chance to block for 1/2 damage and prevents 1 physical damage`,
        cost: 15,
        defense: 1,
        ac: 1,
        defenseType: "armor",
        graphicId: 2403
    }),
    silk:
    new BasicDefense({
        name: "Silk Robe",
        desc: `Silk Robe. 1% Chance to block for 1/2 damage and prevents 1 magical damage`,
        cost: 18,
        mdefense: 1,
        defense: 0,
        ac: 1,
        defenseType: "robe",
        graphicId: 2309
    }),
    wool:
    new BasicDefense({
        name: "Wool Armor",
        desc: `Wool Armor. 0% Chance to block for 1/2 damage and prevents 1 physical damage, 1 magic damage`,
        cost: 25,
        defense: 1,
        mdefense: 1,
        ac: 0,
        defenseType: "armor",
        graphicId: 2403
    }),
    snakeScale:
    new BasicDefense({
        name: "Snake Scales",
        desc: `Snake Scales. 2% Chance to block for 1/2 damage and prevents 1 physical damage, 1 piercing damage`,
        cost: 55,
        defense: 1,
        protections: {
            piercing: 1
        },
        ac: 2,
        defenseType: "armor",
        graphicId: 2403
    }),
}

Object.assign($items, $weapons);
Object.assign($items, $armors);