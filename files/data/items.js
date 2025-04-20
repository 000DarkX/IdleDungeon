
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
        
        if (this.delay) {
            attacker.delay = this.delay;   
        }

        const dmg = defenseRoll ? defenseRoll.defend(this.attacks, defender, attacker) : this.calcDmg();

        if (dmg > 0) {
            defender.wasHit = true;
            if (attacker == hero) {
                //const audio = new Audio(`files/assets/${this.hitSound || "combat-hit-melee.mp3"}`);
                //audio.play();
            }
        }

        defender.updateStat("life", defender.life[0] - dmg);
        if (defender.life[0] <= 0) {
            defender.defeat(attacker);
        }
    }
}

class BasicDefense extends Defense {
    constructor(obj) {
        super();
        this.protections = {};
        Object.assign(this, obj);
    }

    getBonus(type) {

        let result = 0;

        if (this.types) {
            for (const type  of this.types) {
                const bonus = this.bonus[type];
                if (bonus) {
                    const v = bonus[type];
                    if (v)
                        result += v;
                }
            }
        }
        
        return result;
    }

    defend(attacks, defender, attacker) {
        const block = Chance.chance(this.ac + this.getBonus("ac") + defender.getStat("ac"));
        if (block && defender == hero) {
            //const audio = new Audio(`files/assets/${this.defendSound || "armor-block.mp3"}`);
            //audio.play();
        }
        const kd     = Chance.chance(this.knockdown + this.getBonus("knockdown"));
        if (kd) {
            defender.isKnockedDown = true;
        } else {
            defender.isKnockedDown = false;
        }
        let ratio    = block ? 0.5 : 1;
        if (attacker.flying && !this.ranged) {
            ratio *= 0.75;
        }
        // chance to flat out dodge (max chance 15%)
        const agiRatio = 
        Math.min(15, defender.getStat("agi") - attacker.getStat("agi"));
    
        if (Chance.chance(agiRatio)) {
            return 0;
        }

        let dmg = 0;
        const defenseTypes = ["blunt", "slash", "thrust"];
        const magicTypes   = ["magic", "arcane", "chaos"];
        for (const atk of attacks) {
            var found = false;
            if (defenseTypes.indexOf(atk.damageType) != -1) {
                const d = atk.damage - (this.defense||0);
                if (d > 0) {
                    dmg += d;
                    found = true;
                }
            } 
            if (magicTypes.indexOf(atk.damageType) != -1) {
                const d = atk.damage - (this.mdefense||0);
                if (d > 0) {
                    dmg += d;
                    found = true;
                }
            } 
            if (atk.damageType in this.protections) {
                const d = atk.damage - (this.protections[atk.damageType]||0);
                if (d > 0)
                    dmg += d;
            } else if (!found) {
                dmg += atk.damage;
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
        super.unequip(from, map, id);
    }

    equip(from, map, id) {
        const unit = $units[this.summon].clone();
        unit.type  = "summon";
        unit.team  = "good";
        unit.troopLoc = this.summonId;
        from.summons[this.summonId] = this.summon;
        $summons[this.summonId] = unit;
        super.equip(from, map, id);
    }
}

class BasicPotion extends Item {
    use(from, map) {
        from.give(this.itemId, -1);
        if (this.life != undefined && from.life[1] < this.lifeLimit) {
            from.updateStat("life", from.life[0] + 1, from.life[1] + 1);
            hero.update("items");
        } 
        
        if (this.agi != undefined && !from.hasStat("agi", this.agiLimit)) {
            from.permStat("agi", this.agi)
        }
    }
}

class BasicFeat extends Item {
    use(from, map) {
        from.addFeat(this.feat, this.featLevel);
        from.give(this.itemId, -1);
    }
}

$items = {
    viewer: new BasicFeat({
        graphicId: 1928,
        cost: 50,
        feat: "view-stats",
        featLevel: 1,
        sellable: false,
        name: "Viewer",
        desc: "Ability to see stats of your enemies"
    }),
    potions: new Item({
        graphicId: 2713,
        cost: 25,
        sellable: false,
        name: "Small Life Potion",
        desc: "A life potion. heals by 25%"
    }),
    permAgi: new BasicPotion({
        graphicId: 2702,
        itemId: "permAgi",
        sellable: false,
        cost: 25,
        agi: 1,
        agiLimit: 15,
        name: "Small Perm Agility Potion",
        desc: "+1 perm agi up to 15"
    }),
    permLife: new BasicPotion({
        graphicId: 2713,
        itemId: "permLife",
        sellable: false,
        cost: 25,
        life: 1,
        lifeLimit: 25,
        name: "Small Perm Life Potion",
        desc: "+1 perm life up to 25"
    }),
    permLifeII: new BasicPotion({
        graphicId: 2713,
        itemId: "permLifeII",
        sellable: false,
        cost: 50,
        life: 1,
        lifeLimit: 30,
        name: "Small Perm Life Potion II",
        desc: "+1 perm life up to 30"
    }),
    amuletOfLife: new Accessory({
        graphicId: 2259,
        cost: 50,
        name: "Amulet of Life",
        life: 5,
        desc: "Red amulet. Gives you 5 life."
    }),   
    lantern: new Accessory({
        graphicId: 2635,
        cost: 500,
        sellable: false,
        stackable: false,
        name: "Lantern",
        feats: {
            sight: 1,
        },
        desc: "Lantern allows you to see stealh enemies. Sight +1"
    }),     
    amuletOfLifeII: new Accessory({
        graphicId: 2259,
        cost: 150,
        name: "Amulet of Life II",
        life: 10,
        desc: "Red amulet. Gives you 10 life."
    }),   
    amuletOfLifeIII: new Accessory({
        graphicId: 2259,
        cost: 750,
        name: "Amulet of Life III",
        life: 15,
        desc: "Red amulet. Gives you 15 life."
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
    sheep: new BasicSummon({
        name: "Sheep Staff",
        desc: `Summons a sheep! For 1st slot!`,
        cost: 500,
        shop: true,
        summon: "sheep",
        summonId: 0,
        graphicId: 2828
    }),
    wshield:
    new Accessory({
        name: "Wooden Shield",
        desc: `Wooden Shield. Improves block chance by 1%`,
        cost: 50,
        statBoost: {
            ac: 1
        },
        defenseType: "armor",
        graphicId: 2373
    }),
}

$weapons = {
    sbow: new BasicAttack({
        name:"Short Bow",
        desc: `A Short Bow. Deals 3 piercing damage`,
        cost: 50,
        ranged: true,
        attacks: [{ damage: 3,
        damageType: "pierce" }],
        graphicId: 3166
    }),
    magicStaff: new BasicAttack({
        name:"Magic Staff",
        desc: `Magic Staff. Deals 8 magic damage`,
        cost: 1000,
        ranged: true,
        attacks: [{ damage: 8,
        damageType: "magic" }],
        graphicId: 2822
    }),
    lbow: new BasicAttack({
        name:"Long Bow",
        desc: `A Long Bow. Deals 5 piercing damage`,
        cost: 500,
        ranged: true,
        attacks: [{ damage: 5,
        damageType: "pierce" }],
        graphicId: 3166
    }),
    gratClaw: new BasicAttack({
        name:"Gray Rat Claw",
        desc: `Deals 5 slash`,
        cost: 500,
        shop: false,
        attacks: [{ damage: 5,
        damageType: "slash" }],
        graphicId: 3166
    }),
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
    hvstone: new BasicAttack({
        name: "Heavy Stone",
        desc: `A heavy stone. Deals 5 blunt damage. Delay 1`,
        cost: 75,
        attacks: [{
            damage: 5,
            damageType: "blunt",
        }],
        delay: 1,
        graphicId: 3172
    }),
    vhvstone: new BasicAttack({
        name: "Very Heavy Stone",
        desc: `A very heavy stone. Deals 15 blunt damage. Delay 5. knockdown 2%`,
        cost: 750,
        shop: false,
        knockdown: 2,
        bonus: {
            nature: {
                knockdown: 14
            },
            doll: {
                knockdown: 14
            }
        },
        attacks: [{
            damage: 15,
            damageType: "blunt",
        }],
        delay: 5,
        graphicId: 2647
    }),
    hstone: new BasicAttack({
        name: "Headache Stone",
        desc: `A heacache stone. Deals 3 blunt damage. knockdown 1%.`,
        cost: 35,
        knockdown: 1,
        bonus: {
            nature: {
                knockdown: 14
            }
        },
        attacks: [{
            damage: 3,
            damageType: "blunt",
        }],
        graphicId: 3184
    }),
    wormBite: new BasicAttack({
        name: "Worm Staff",
        desc: `Deals 1 Magic Damage`,
        cost: 35,
        shop: false,
        attacks: [{ damage: 1,
        damageType: "magic" }],
        graphicId: 2828
    }),
    wormBiteII: new BasicAttack({
        name: "Worm Staff",
        desc: `Deals 3 Magic Damage`,
        cost: 350,
        shop: false,
        attacks: [{ damage: 3,
        damageType: "magic" }],
        graphicId: 2828
    }),
    icicleKnife: new BasicAttack({
        name: "Icicle",
        desc: `A small Icicle knife. Deals 2 slash damage, 3 ice damage`,
        cost: 500,
        attacks: [
            {
                damage: 2,
                damageType: "slash",
            },
            {
                damage: 3,
                damageType: "ice"
            }
        ],
        graphicId: 2971
    }),
    icicleKnifeII: new BasicAttack({
        name: "Icicle",
        desc: `A small Icicle knife. Deals 3 slash damage, 5 ice damage`,
        cost: 500,
        attacks: [
            {
                damage: 3,
                damageType: "slash",
            },
            {
                damage: 5,
                damageType: "ice"
            }
        ],
        graphicId: 2971
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
    snakeBite: new BasicAttack({
        name: "Snake Bite",
        desc: `Deals 3 pierce damage`,
        cost: 35,
        shop: false,
        attacks: [{
            damage: 3,
            damageType: "pierce",
        }],
        graphicId: 2971
    }),
}

$armors = {
    icedJelly:
    new BasicDefense({
        name: "Iced Jelly Armor",
        desc: `Armor that icy and jelly like. 
               0% Chance to block for 1/2 damage and prevents 5 blunt damage, 3 ice damage.
               Weak to Fire -1`,
        cost: 500,
        defense: 0,
        protections: {
            fire: -1,
            ice: 3,
            blunt: 5
        },
        ac: 0,
        defenseType: "armor",
        graphicId: 2464
    }),
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
    batRobe:
    new BasicDefense({
        name: "Bat Robe",
        desc: `Bat Robe. 1% Chance to block for 1/2 damage and prevents 3 magical damage`,
        cost: 200,
        mdefense: 3,
        defense: 0,
        ac: 1,
        defenseType: "robe",
        graphicId: 2309
    }),
    batRobeII:
    new BasicDefense({
        name: "Bat Robe",
        desc: `Bat Robe. 2% Chance to block for 1/2 damage and prevents 5 magical damage`,
        cost: 1000,
        mdefense: 5,
        defense: 0,
        ac: 2,
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
    leather:
    new BasicDefense({
        name: "Leather Armor",
        desc: `Leather Armor. 3% Chance to block for 1/2 damage and prevents 3 physical damage`,
        cost: 250,
        defense: 3,
        protections: {
        },
        ac: 3,
        defenseType: "armor",
        graphicId: 2404
    }),
    dummyArmor:
    new BasicDefense({
        name: "Dummy Armor",
        desc: `Dummy Armor. 4% Chance to block for 1/2 damage and prevents 5 blunt damage, 1 magic damage.
                Weak to slash -5`,
        cost: 250,
        shop: false,
        defense: 0,
        mdefense: 1,
        protections: {
            slash: -5,
            blunt: 5
        },
        ac: 4,
        defenseType: "armor",
        graphicId: 2404
    }),
    antArmor:
    new BasicDefense({
        name: "Ant Armor",
        desc: `Ant Armor. 8% Chance to block for 1/2 damage and prevents 1 physical damage, 1 magic damage.`,
        cost: 2500,
        shop: false,
        defense: 1,
        mdefense: 1,
        protections: {
            
        },
        ac: 8,
        defenseType: "armor",
        graphicId: 2404
    }),
}

$specialItems = {
    stuffedAnimal: new Item({
        graphicId: 6039,
        cost: 50,
        name: "Stuffed Animal",
        desc: "A stuffed animal! only for looks!"
    }), 
};

Object.assign($items, $weapons);
Object.assign($items, $armors);
Object.assign($items, $specialItems);