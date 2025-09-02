import rough from "roughjs";
import { RoughCanvas } from "roughjs/bin/canvas";

class CanvasLogic {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D
    private roughCanvas: RoughCanvas

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.roughCanvas = rough.canvas(canvas);

       // this.initEventListeners();
    }
    
    drawRectangle( x:number, y:number, width:number, height:number) {
        const rectangle = this.roughCanvas.rectangle(x, y, width, height, {stroke: "white", strokeWidth: 1,roughness: 1.3});
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.roughCanvas.draw(rectangle);
    }

    drawCircle(x:number, y:number, radius:number) {
        const circle = this.roughCanvas.circle(x, y, radius, {stroke: "white", strokeWidth: 1,roughness: 1.3});
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.roughCanvas.draw(circle);
    }

    drawDiamond(x:number, y:number, width:number, height:number) {
        const diamond = this.roughCanvas.polygon([[x, y - height / 2], [x + width / 2, y], [x, y + height / 2], [x - width / 2, y]], {stroke: "white", strokeWidth: 1,roughness: 1.3});
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.roughCanvas.draw(diamond);
    }
}

export {CanvasLogic};