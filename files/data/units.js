
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
        equipsOffense: ["rock", "rock"],
        equipsDefense: ["cloth"],
        equipsAccessory: [],
        drop: [
            {itemId: "rock", chance: 20, amount: 1},
            {itemId: "stone", chance: 5, amount: 1},
            {itemId: "cloth", chance: 1, amount: 1},
            {itemId: "gold", chance: 100, amount: 2},
        ]
    }),
    worm: new BasicEnemyUnit({
        name: "Worm",
        graphicId: 4108,
        life: [10, 10],
        equipsOffense: ["rock"],
        equipsDefense: ["silk", "cloth"],
        equipsAccessory: [],
        drop: [
            {itemId: "rock", chance: 20, amount: 1},
            {itemId: "stone", chance: 5, amount: 1},
            {itemId: "silk", chance: 1, amount: 1},
            {itemId: "gold", chance: 100, amount: 1},
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
        equipsOffense: ["rock", "rock"],
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
    })
};