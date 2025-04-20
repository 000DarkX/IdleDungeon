
class Unit {

    constructor() {
        this.name = "Hero";
        this.graphicId   = 5063;
        this._life        = [20, 20, 0];
        //this.offenses    = new Array(4);
        //this.defenses    = new Array(4);
        //this.accesorries = new Array(4);
        this.offense = new Array(4);
        this.defense = new Array(4);
        this.accessory = new Array(4);
        this.gold        = 0;
        this.potions     = 0;
        this.items       = {};
        this.buffs       = [];
        this.feats       = {}; // basic things
        this.x           = 0;
        this.y           = 0;
        this.stealthy     = undefined;
        this.graphicState = false;
        this.updateEquipped= false;
        this.updatedItems  = false;
        // add sight as buff
        this.alive = true;
    }

    improveFeat(name, value)
    {
        if (!(name in this.feats)) {
            this.feats[name] = 0;
        }

        this.feats[name] += value;
    }

    getFeat(name)
    {
        return this.feats[name];
    }

    hasFeat(name, higher=1)
    {
        const f = this.feats[name];
        return f && f >= higher;
    }

    addBuf(buf) {
        this.buffs.push(buf);
    }

    remBuf(buf) {
        this.buffs.splice(this.buffs.indexOf(buf), 1);
    }

    sell(itemId)
    {
        const item = $items[itemId];
        if (item == undefined) return;
        const sellFor = item.cost * .1;
        this.give(itemId, -1);
        this.give("gold", sellFor);
    }

    update() {
    }

    updateStat(type, ...args)
    {
        for (let i = args.length; i < this[type].length; ++i)
        {
            args.push(this[type][i]);
        }
        this[type] = args;
        return this[type];
    }

    set life(value) {
        this._life = value;
        this.update("life");
    }

    get life() {
        return this._life;
    }

    fix() {
        if (this.life == undefined) {
            throw new Error("life is undefined");
        }
        if (!Array.isArray(this.life)) {
            this.life = [this.life, this.life, 0];
        }
        else if (this.life.length != 3) {
            while (this.life.length < 3) {
                this._life.push(0);
            }
        }
    }

    recoverPerc(stat, value)
    {
        const v = (this[stat][1] + (this[stat][2]||0)) * (value / 100);
        this.recover(stat, v);
    }

    recover(stat, value) {
        const v = this[stat][0] + value;
        if (v > this[stat][1] + (this[stat][2]||0)) {
            this[stat][0] = this[stat][1] + (this[stat][2]||0);
        } else {
            this[stat][0] = v;
        }
        if (this[stat][0] > 0) {
            this.alive = true;
        }

        this.update("life");
    }

    clone() {
        const data = structuredClone(this);
        const prototype = Object.getPrototypeOf(this);
        const newObj = Object.create(prototype);

        Object.assign(newObj, data);
        return newObj;
    }

    defeat() {
        this.alive = false;
        const ev = new CustomEvent("Idle.defeat", {detail: {target: this}});
        dispatchEvent(ev);
        if (this.team == "enemy") {
            map.defeat(this);
            //const audio = new Audio(`files/assets/combat-kill.mp3`);
            //audio.play();
        }
        else if (this == hero) map.load("guildHall");
    }

    attack(targets)
    {
        if (this.alive == false) return;
        if (this.isKnockedDown == true) {
            this.isKnockedDown = false;
            return;
        }
        if (this.delay > 0) {
            --this.delay;
            return;
        }
        if (!Array.isArray(targets)) targets = [targets];
        if (targets.length == 0) {
            console.info("no targets");
            return;
        }

        for (let i =0 ; i < targets.length; ++i) {
            const tar = targets[i];
            if (tar == undefined || tar.alive == false) {
                targets.splice(i, 1);
                --i;
            }
        }

        const target = Chance.pick(targets);
        target.active = false;
        const p = this._life[0] / (this._life[1]+(this._life[2]||0)) * 100;

        if (p <= 50 && this.potions > 0) {
            this.give("potions", -1);
            this.recoverPerc("life", 25);
            return;
        }

        const stealth = target.getFeat("stealth") || 0;
        
        if (stealth > 0 && target.stealthy != false) {
            const sight   = this.getFeat("sight") || 0;
            const c       = sight / stealth * 50;
            const cr      = !Chance.chance(c);

            if (target.stealthy == undefined) target.stealthy = cr;

            target.stealthy &&= cr;

            if (cr)
                return;
        }
        
        const atkRoll = Chance.pick(this.offense);
        const defRoll = Chance.pick(target.defense);

        if (atkRoll) {
            const ev = new CustomEvent("Idle.attacked", {detail: {targets, atkRoll, defRoll}});
            dispatchEvent(ev);
            $items[atkRoll].attackTarget(this, target, $items[defRoll]);
        }
        else if (this == hero) {
            //const audio = new Audio(`files/assets/combat-miss.mp3`);
            //audio.play();
        }
    }

    filterItemByType(type)
    {
        return Object.keys(this.items).filter(id => $items[id].type == type && this.items[id].amount > 0);
    }

    show(type, id, e)
    {
        if (e)
            e.stopPropagation();
        if (this.alive == false) return;
        const container = document.getElementById(`${type}${id}`);
        const itemz     = Object.keys(this.items).filter(id => $items[id].type == type && this.hasItem(id, 1));
        return createImageDropdown(document.body || container.parentElement, itemz, sprites, this, type, id);
    }

    unequip(type, id) {
        let itemId = undefined;

        itemId = this[type][id];
        this[type][id] = undefined;

        if (itemId == undefined) return;

        $items[itemId].unequip(this, map, id);
        this.give(itemId, 1);
    }

    equip(itemId, id) {
        const item = $items[itemId];
        const type = item.type;

        if (!this.hasItem(itemId)) {
            console.log("dont have item");
            return false;
        }

        if (this.isEquipped(itemId) && item.stackable == false) {
            alert(`Only one ${item.name} can be equipped`);
            return false;
        }

        this.unequip(type, id);
        this.give(itemId, -1);

        this[type][id] = itemId;
        $items[itemId].equip(this, map, id);

        this.updateEquipped = true;
        const ev = new CustomEvent("Idle.equip", {detail: {target: this, itemId, slot: id}});
        dispatchEvent(ev);
    }

    isEquipped(itemId) {
        const item = $items[itemId];
        const type = item.type;
        const list = this[type].filter(id => itemId == id);
        return list.length > 0;
    }

    hasItem(itemId, amount=1)
    {
        if (!(itemId in this.items)) {
            return false;
        }

        return this.items[itemId].amount >= amount;
    }

    _callEventGive(target, itemId, amount, bulk=false) {
        this.updatedItems = true;
        const ev = new CustomEvent("Idle.give", {detail: {target, itemId, amount, bulk}});
        dispatchEvent(ev);
    }

    give(itemId, amount=1, bulk=false) {
        if (Array.isArray(itemId)) {
            let idx = 0;
            for (const item of itemId) {
                this.give(item.itemId, item.amount, idx < itemId.length);
                ++idx;
            }
            return;
        }

        if (itemId == "potions" || itemId == "potion") {
            this.potions += amount;
            if (this.potions < 0) this.potions = 0;
            this._callEventGive(this, itemId, amount, bulk);
            return true;
        }

        if (itemId == "gold") {
            this.gold += amount;
            if (this.gold < 0) this.gold = 0;
            this._callEventGive(this, itemId, amount, bulk);
            return true;
        }

        if (!(itemId in this.items)) {
            this.items[itemId] = {
                amount: 0
            }
        }

        const item = this.items[itemId];
        const prevAmount = item.amount;

        this.items[itemId].amount += amount;
        if (item.amount < 0) {
            this.items[itemId].amount = prevAmount;
            return false;
        }

        this._callEventGive(this, itemId, amount, bulk);

        return true;
    }

    giveAndEquip(itemId, amount, id)
    {
        this.give(itemId, amount);
        this.equip(itemId, id);
    }

    newUnit() {
        this.giveAndEquip("rock", 1, 0);
        this.give("stone", 1, true);
        this.give("cloth", 1, false);
    }

    tick(t) {
        if (this.graphicState) {
            this.x += 1;
        } else {
            this.x -= 1;
        } 

        if (this.x >= 8) {
            this.graphicState = false;
        } else if (this.x <= -8) {
            this.graphicState = true;
        }
        this.wasHit = false;
        this.updateEquipped = false;
        this.updatedItems   = false;
        //this.stealthy       = undefined;
    }

    item(name) {
        if (typeof $items != "undefined")
            return $items[name];
    }

    itemCount() {
        let amt = 0;
        for (const name in this.items) {
            amt += this.items[name].amount;
        }
        return amt;
    }

    filterEquipByID(itemId, type) {
        if (this[type] && Array.isArray(this[type]))
            return this[type].filter(id => itemId == id);
        return [];
    }

    equipCoundByID(itemId, type) {
        if (this[type] && Array.isArray(this[type]))
            return this.filterEquipByID(itemId, type).length;
        return this[itemId] || 0;
    }

    drawLocation() {
        const row = 6 - (this.troopLoc == undefined ? 0 : this.troopLoc % 2 == 0 ? this.troopLoc + 1 : -((this.troopLoc + 1)/2));
        const col = this.team == "enemy" ? 7 :  1;
        return {row, col};
    }

    draw(ctx, sprites) {
        if (sprites.image == undefined) return;
        if (this.alive == false) {
            const {row, col} = this.drawLocation();

            sprites.drawByID(ctx, 3278, col * 32, row * 32, 32, 32);
            return;
        }

        if (this.updateEquipped && this == hero) {
            for (let i =0; i < this.offense.length; ++i) {
                const canvas = document.getElementById(`offense${i}`);
                const item   = this.item(this.offense[i]);
                if (item && canvas) {
                    item.draw(canvas.getContext("2d"), sprites);
                }
            }

            for (let i =0; i < this.offense.length; ++i) {
                const canvas = document.getElementById(`defense${i}`);
                const item   = this.item(this.defense[i]);
                if (item && canvas) {
                    item.draw(canvas.getContext("2d"), sprites);
                }
            }

            for (let i =0; i < this.accessory.length; ++i) {
                const canvas = document.getElementById(`accessory${i}`);
                const item   = this.item(this.accessory[i]);
                if (item && canvas) {
                    item.draw(canvas.getContext("2d"), sprites);
                }
            }
        }

        const {row, col} = this.drawLocation();

        if (this.active) 
        {
            //ctx.strokeRect(this.x + col * 32, this.y + row * 32, 32, 32);
        }

        if (this.hasFeat("stealth", 1) && this.stealthy != false) {
            // 1516
            const {row, col} = this.drawLocation();

            sprites.drawByID(ctx, 1516, this.x + col * 32, this.y + row * 32, 32, 32);
            return;
        }

        if (this.wasHit) {
            sprites.drawByID(ctx, 3193, this.x + col * 32, this.y + row * 32, 32, 32);
        }
        
        if (this.graphicLayers) {
            for (const layer of this.graphicLayers) {
                sprites.drawByID(ctx, layer, this.x + col * 32, this.y + row * 32, 32, 32)
            }
        }
        

        if (this.hasFeat("sight")) {
            // Create a radial gradient for the light effect
            // const gradient = ctx.createRadialGradient(150, 100, 0, 150, 100, 100);
            const gradient = ctx.createRadialGradient(this.x + col * 32 + 16, this.y + row * 32 + 16, 0,
                                                      this.x + col * 32 + 16, this.y + row * 32 + 16, 64);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');  // Bright white at the center
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)'); // Transparent at the edge

             ctx.save();
            // Set globalCompositeOperation to "lighter"
            ctx.globalCompositeOperation = 'lighter';

            // Draw the gradient as a circle
            ctx.beginPath();
            ctx.fillStyle = gradient;
            ctx.arc(this.x + col * 32, this.y + row * 32, 64, 0, Math.PI * 2);
            ctx.fill();
             ctx.restore();
        }
    
        ctx.fillStyle = "black";
        ctx.fillRect(this.x + col * 32, this.y + row * 32 - 4, 25, 3);
        ctx.fillStyle = "red";
        ctx.fillRect(this.x + col * 32 + 1, this.y + row * 32 - 3, this.life[0] / (this.life[1]+(this.life[2]||0)) * 25, 1);
        sprites.drawByID(ctx, this.graphicId, this.x + col * 32, this.y + row * 32, 32, 32);
    }
}

class Hero extends Unit {
    constructor() {
        super();
        this.team = "good";
        this.summons = [];
        
        addEventListener("Idle.give", e => {
            const detail = e.detail;
            if (detail.bulk == false)
                this.update("items");
        });
        addEventListener("Idle.unlock", e => {
            this.update("map");
        });
        addEventListener("Idle.mapLevelChanged", e => {
            this.update("map");
        });
        addEventListener("Idle.mapload", e => {
            this.update("map");
        });
        addEventListener("Idle.attacked", e => {
            this.update("life");
        });
        /*addEventListener("Idle.defeat", e => {
            if (e.target == hero)
                this.update("");
        });*/
    }
    
    save() {
        const data = {};
        const keys = ["team", "_life", "offense", "defense", "accessory", "items", "gold", "potions", "summons", "feats"];
        for (const key of keys) {
            data[key] = this[key];
        }
        localStorage.setItem("Idle.Hero", JSON.stringify(data));
    }

    load() {
        const data = JSON.parse(localStorage.getItem("Idle.Hero"));
        for (const name in data) {
            this[name] = data[name];
        }
        
        this.reequip("offense");
        this.reequip("defense");
        this.reequip("accessory");

        this.update("all");
    }

    reequip(type) {
        const arr  = this[type];
        if (Array.isArray(arr)) {
            for (let i = 0; i < arr.length; ++i) {
                const itemId = arr[i];
                const item = $items[itemId];
                this.unequip(type, i);
                this.equip(itemId, i);
            }
        }
        this.redraw_equip(type);
    }

    redraw_equip(type) {
        for (let i = 0; i < this[type].length; ++i) {
            const itemId = this[type][i];
            if (itemId == undefined) continue;
            const canvas = document.getElementById(`${type}${i}`);
            const ctx = canvas.getContext("2d");
            const item = $items[itemId];
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.title = item.desc;
            sprites.drawByID(ctx, item.graphicId, 0, 0, canvas.width, canvas.height);
        }
    }

    update(type) {
        if (this == hero) {
            if (type == "life" || type == "all")
                document.getElementById("life").textContent = `Life ${this.life[0]}/${this.life[1]+(this.life[2]||0)}`;
            
            if (map.upatedLoad || type == "map" || type == "all")
                document.getElementById("location").textContent = `Location: ${map.name}`;
            
            document.getElementById("dungeonBtn").textContent = `Dungeon (${typeof $maps != "undefined" ? $maps.dungeon.unlocked : 0})`;
            
            if (this.updateEquipped || this.updatedItems || type == "items" || type == "all") {
                document.getElementById("potions").textContent = `Potions ${this.potions}`;
                document.getElementById("gold").textContent = `Gold ${this.gold}`;
                document.getElementById("inventory").textContent = `Inventory (${this.itemCount()})`;
                document.getElementById("offenses").textContent = `Offenses (${this.filterItemByType("offense").length})`;
                document.getElementById("defenses").textContent = `Defenses (${this.filterItemByType("defense").length})`;
                document.getElementById("accessorries").textContent = `Accessories (${this.filterItemByType("accessory").length})`;
            }
        }
    }
}