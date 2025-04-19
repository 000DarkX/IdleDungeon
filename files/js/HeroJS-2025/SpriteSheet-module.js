

export default class SpriteSheet {
    constructor(cellWidth=32,cellHeight=32) {
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
    }

    async load(src) {
        console.log(src);
        if (src instanceof Image) {
            this.image = src;
            return;
        }
        const img = new Image();
        await new Promise((t, f) => {
            img.onload = t;
            img.onerror = f;
            img.src = src;
        });
        this.image = img;
        return img;
    }


    get height() {
        return this.image.height;
    }

    get width() {
        return this.image.width;
    }

    IDFromXY(x, y) {
        return Math.trunc(x / this.cellWidth) + Math.trunc(y / this.cellWidth) * this.cols;
    }


    get cols() {
        return Math.trunc(this.image.width / this.cellWidth);
    }

    get rows() {
        return Math.trunc(this.image.height / this.cellHeight);
    }

    draw(ctx, x=0, y=0, w, h) {
        if (w == undefined) w = this.image.width;
        if (h == undefined) h = this.image.height;

        ctx.drawImage(this.image,
            0, 0, this.image.width, this.image.height, x, y, w, h);
    }

    toBitmap() {
        const canvas = new OffscreenCanvas(this.image.width, this.image.height);
        canvas.getContext("2d").drawImage(this.image, 0, 0);
        return canvas.transferToImageBitmap();
    }

    drawByXY(ctx, sx, sy, x, y, w, h) {
        ctx.drawImage(this.image, 
            sx * this.cellWidth, sy * this.cellHeight, 
            this.cellWidth, this.cellHeight, 
            x, y, w == undefined ? this.cellWidth : w, h == undefined ? this.cellHeight : h);
    }

    drawByID(ctx, id, x, y, w, h) {
        this.drawByXY(ctx, id % this.cols, Math.trunc(id / this.cols), x, y, w, h);
    }

    drawByIDInPlace(ctx, id) {
        const x = id % this.cols * this.cellWidth;
        const y = Math.trunc(id / this.cols) * this.cellHeight;
        const w = this.cellWidth;
        const h = this.cellHeight;
        this.drawByXY(ctx, id % this.cols, Math.trunc(id / this.cols), x, y, w, h);
    }
}