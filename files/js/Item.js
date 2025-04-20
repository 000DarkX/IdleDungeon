

class Item {
    constructor(obj) {
        this.graphicId = 3186;
        Object.assign(this, obj);
        this.type = "item";
    }

    unequip(hero, map, id) 
    {
        const ele = document.getElementById(`${this.type}${id}`);
        if (ele && ele.tagName == "CANVAS")
        {
            ele.getContext("2d").clearRect(0, 0, ele.clientWidth, ele.clientHeight);
        }

        if (this.life != undefined) {
            from.life[2] -= this.life;
        }
    }

    equip(from, map, id) {
        const ele = document.getElementById(`${this.type}${id}`);
        if (ele && from.team == "good")
            ele.title = this.desc;

        if (this.life != undefined) {
            from.life[2] += this.life;
        }
    }

    use(hero, map) {

    }

    draw(ctx, sprites) {
        if (sprites.image == undefined) return;
        sprites.drawByID(ctx, this.graphicId, 0, 0, 32, 32);
    }
}

class Offense extends Item {
    constructor(obj) {
        super();
        Object.assign(this, obj);
        this.type = "offense";
    }
    attackTarget(a,b,c) {

    }
}


class Defense extends Item {
    constructor(obj) {
        super();
        Object.assign(this, obj);
        this.type = "defense";
    }

    defend(a,b,c) {

    }
}


class Accessory extends Item {
    constructor(obj) {
        super();
        Object.assign(this, obj);
        this.type = "accessory";
    }
}