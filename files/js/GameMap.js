

class GameMap {

    constructor() {
        this.tileId = 0;
        this._ticks = 0;
    }

    clone() {
        return structuredClone(this);
    }

    postLoad(name, args)
    {

    }

    load(name, ...args) {
        const cmap = $maps[name];
        cmap._ticks = 1;
        map = cmap;

        const ev = new CustomEvent("Idle.mapload", {detail: name});
        dispatchEvent(ev);

        map.postLoad(name, ...args);
        
        return cmap;
    }

    defeat(unit) {
        this._ticks = 1;
    }

    draw(ctx, spites)
    {
        if (spites.image == undefined) return;

        for (let j = 0; j < ctx.canvas.height; ++j) {
            for (let i = 0; i < ctx.canvas.width; ++i) {
                sprites.drawByID(ctx, this.tileId, i * 32, j * 32, 32, 32);
            }
        }
    }

    tick(t) {
        ++this._ticks;
    }
}