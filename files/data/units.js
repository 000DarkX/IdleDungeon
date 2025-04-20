
class BasicEnemyUnit extends Unit 
{
    constructor(obj) {
        super();
        Object.assign(this, obj);
        this.fix();
        this.team = "enemy";
    }

    defeat(target) {
        let items = [];
        for (const obj of this.drop) {
            if (Chance.chance(obj.chance)) {
                items.push({itemId: obj.itemId, amount: obj.amount||1});
            }
        }
        target.give(items, undefined);
        super.defeat(target);
    }

    setup() {
        this.equipItems();
    }

    equipItems() {
        let id = 0;
        for (const item of this.equipsOffense) {
            this.give(item, 1);
            this.equip(item, id);
            ++id;
        }

        id = 0;
        for (const item of this.equipsDefense) {
            this.give(item, 1);
            this.equip(item, id);
            ++id;
        }

        id = 0;
        for (const item of this.equipsAccessory) {
            this.give(item, 1);
            this.equip(item, id);
            ++id;
        }
    }
}

// 4108
$units = {
    rat: new BasicEnemyUnit({
        name: "Brown Rat",
        graphicId: 4115,
        life: [15, 15],
        equipsOffense: ["rock"],
        equipsDefense: [],
        equipsAccessory: [],
        drop: [
            {itemId: "rock", chance: 20, amount: 1},
            {itemId: "stone", chance: 5, amount: 1},
            {itemId: "cloth", chance: 1, amount: 1},
            {itemId: "gold", chance: 100, amount: 1},
        ]
    }),
    ratII: new BasicEnemyUnit({
        name: "Brown Rat II",
        graphicId: 4115,
        life: [18, 18],
        graphicLayers: [
            3737
        ],
        equipsOffense: ["stone", "rock"],
        equipsDefense: ["cloth"],
        equipsAccessory: [],
        drop: [
            {itemId: "rock", chance: 20, amount: 1},
            {itemId: "stone", chance: 5, amount: 1},
            {itemId: "cloth", chance: 1, amount: 1},
            {itemId: "gold", chance: 100, amount: 2},
        ]
    }),
    grat: new BasicEnemyUnit({
        name: "Gray Rat",
        graphicId: 4089,
        life: [28, 28],
        graphicLayers: [],
        equipsOffense: ["gratClaw", "sbow", "stone", "stone"],
        equipsDefense: ["leather", "cloth", "snakeScale", "leather"],
        equipsAccessory: ["lantern"],
        drop: [
            {itemId: "sbow", chance: 10, amount: 1},
            {itemId: "latern", chance: 10, amount: 1},
            {itemId: "gold", chance: 100, amount: 5},
            {itemId: "gold", chance: 1, amount: 5},
        ]
    }),
    stealthWorm: new BasicEnemyUnit({
        name: "Stealth Worm",
        graphicId: 4108,
        life: [20, 20],
        equipsOffense: ["wormBiteII"],
        equipsDefense: ["silk", "cloth"],
        equipsAccessory: [],
        feats: {
            stealth: 1,
        },
        drop: [
            {itemId: "rock", chance: 20, amount: 1},
            {itemId: "stone", chance: 5, amount: 1},
            {itemId: "silk", chance: 1, amount: 1},
            {itemId: "latern", chance: 1, amount: 1},
            {itemId: "gold", chance: 100, amount: 1},
        ]
    }),
    worm: new BasicEnemyUnit({
        name: "Worm",
        graphicId: 4108,
        life: [10, 10],
        equipsOffense: ["wormBite"],
        equipsDefense: ["silk", "cloth"],
        equipsAccessory: [],
        drop: [
            {itemId: "rock", chance: 20, amount: 1},
            {itemId: "stone", chance: 5, amount: 1},
            {itemId: "silk", chance: 1, amount: 1},
            {itemId: "gold", chance: 100, amount: 1},
        ]
    }),
    blueSlime: new BasicEnemyUnit({
        name: "Blue Slime",
        graphicId: 3999,
        life: [45, 45],
        equipsOffense: ["icicleKnife", "icicleKnife"],
        equipsDefense: ["icedJelly", "icedJelly", "leather", "leather"],
        equipsAccessory: [],
        drop: [
            {itemId: "rock", chance: 20, amount: 1},
            {itemId: "stone", chance: 5, amount: 1},
            {itemId: "icicleKnife", chance: 5, amount: 1},
            {itemId: "icedJelly", chance: 5, amount: 1},
            {itemId: "gold", chance: 100, amount: 7},
        ]
    }),
    blueSlimeII: new BasicEnemyUnit({
        name: "Blue Slime",
        graphicId: 3999,
        rarity: 90,
        graphicLayers: [
            3737
        ],
        life: [55, 55],
        equipsOffense: ["icicleKnifeII", "icicleKnife"],
        equipsDefense: ["icedJelly", "icedJelly", "leather", "leather"],
        equipsAccessory: [],
        drop: [
            {itemId: "rock", chance: 20, amount: 1},
            {itemId: "stone", chance: 5, amount: 1},
            {itemId: "permLife", chance: 5, amount: 1},
            {itemId: "permLifeII", chance: 5, amount: 1},
            {itemId: "icicleKnife", chance: 8, amount: 1},
            {itemId: "icedJelly", chance: 8, amount: 1},
            {itemId: "gold", chance: 100, amount: 1},
        ]
    }),
    combatDummy: new BasicEnemyUnit({
        name: "Combat Dummy",
        graphicId: 4430,
        types: ["doll"],
        alert: `A combat dummy has entered! This will be a long fight!`,
        life: [100, 100],
        equipsOffense: ["vhvstone", "hvstone", "hvstone", "hvstone"],
        equipsDefense: ["dummyArmor", "dummyArmor", "dummyArmor", "dummyArmor"],
        equipsAccessory: [],
        drop: [
            {itemId: "rock", chance: 20, amount: 1},
            {itemId: "stone", chance: 20, amount: 1},
            {itemId: "vhvstone", chance: 5, amount: 1},
            {itemId: "dummyArmor", chance: 5, amount: 1},
            {itemId: "gold", chance: 100, amount: 15},
        ]
    }),
    ant: new BasicEnemyUnit({
        name: "Ant",
        graphicId: 4064,
        life: [30, 30],
        equipsOffense: ["gratClaw", "gratClaw", "gratClaw", "lbow"],
        equipsDefense: ["antArmor", "antArmor", "antArmor", "antArmor"],
        equipsAccessory: [],
        drop: [
            {itemId: "rock", chance: 20, amount: 1},
            {itemId: "stone", chance: 20, amount: 1},
            {itemId: "lbow", chance: 1, amount: 1},
            {itemId: "gold", chance: 100, amount: 10},
        ]
    }),
    wasp: new BasicEnemyUnit({
        name: "Wasp",
        graphicId: 4107,
        life: [10, 10],
        equipsOffense: ["knife"],
        equipsDefense: ["silk"],
        equipsAccessory: [],
        drop: [
            {itemId: "rock", chance: 20, amount: 1},
            {itemId: "stone", chance: 5, amount: 1},
            {itemId: "knife", chance: 5, amount: 1},
            {itemId: "silk", chance: 3, amount: 1},
            {itemId: "gold", chance: 100, amount: 2},
        ]
    }),
    sheep: new BasicEnemyUnit({
        name: "Sheep",
        graphicId: 4163,
        life: [40, 40],
        equipsOffense: ["stone", "rock"],
        equipsDefense: ["silk"],
        equipsAccessory: [],
        drop: [
            {itemId: "rock", chance: 20, amount: 1},
            {itemId: "stone", chance: 5, amount: 1},
            {itemId: "wool", chance: 5, amount: 1},
            {itemId: "silk", chance: 5, amount: 1},
            {itemId: "gold", chance: 100, amount: 2},
        ]
    }),
    snake: new BasicEnemyUnit({
        name: "Green Snake",
        graphicId: 4137,
        life: [25, 25],
        equipsOffense: ["snakeBite", "stone"],
        equipsDefense: ["snakeScale", "silk"],
        equipsAccessory: [],
        drop: [
            {itemId: "stone", chance: 5, amount: 1},
            {itemId: "snakeScale", chance: 5, amount: 1},
            {itemId: "silk", chance: 5, amount: 1},
            {itemId: "gold", chance: 100, amount: 3},
        ]
    }),
    rare1: new BasicEnemyUnit({
        name: "Rare 1",
        graphicId: 2619,
        life: [35, 35],
        runChance: 10,
        equipsOffense: [],
        equipsDefense: [],
        equipsAccessory: [],
        drop: [
            {itemId: "ratStaff", chance: 5, amount: 1},
            {itemId: "ratStaff2", chance: 5, amount: 1},
        ]
    }),
    frog: new BasicEnemyUnit({
        name: "Green Frog",
        graphicId: 4072,
        types: ["nature", "poisonous"],
        life: [35, 35],
        equipsOffense: ["hstone", "hstone", "hstone"],
        equipsDefense: ["snakeScale", "silk"],
        equipsAccessory: [],
        drop: [
            {itemId: "hstone", chance: 5, amount: 1},
            {itemId: "gold", chance: 100, amount: 5},
        ]
    }),
    pig: new BasicEnemyUnit({
        name: "Pig",
        graphicId: 4097,
        types: [],
        life: [55, 55],
        equipsOffense: ["hstone", "hstone", "hstone"],
        equipsDefense: ["leather", "leather", "leather", "silk"],
        equipsAccessory: [],
        drop: [
            {itemId: "hstone", chance: 5, amount: 1},
            {itemId: "leather", chance: 5, amount: 1},
            {itemId: "gold", chance: 100, amount: 5},
        ]
    }),
};