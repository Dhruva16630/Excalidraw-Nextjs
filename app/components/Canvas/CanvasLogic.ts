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
        const rectangle = this.roughCanvas.rectangle(200, 200, 200, 200, {stroke: "white", strokeWidth: 1,roughness: 1.3});
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.roughCanvas.draw(rectangle);
    }
}

export {CanvasLogic};