


export default class Pool {
    constructor() {
        this.name = "poolId";
        this.pool = [];
        this.objs = [];
    }

    add(obj) {
        const id = this.pool.length ? this.pool.pop() : this.objs.length;
        obj[this.name] = id;
        this.objs[id] = obj;
    }

    remove(obj) {
        const id = obj[this.name];
        delete obj[this.name];
        this.pool.push(id);
    }
}