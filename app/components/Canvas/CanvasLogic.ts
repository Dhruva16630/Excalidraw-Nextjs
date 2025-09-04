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

    drawRectangle(x: number, y: number, width: number, height: number) {
        const rectangle = this.roughCanvas.rectangle(x, y, width, height, { stroke: "white", strokeWidth: 1, roughness: 1.3 });
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.roughCanvas.draw(rectangle);
    }

    drawCircle(x: number, y: number, radius: number) {
        const circle = this.roughCanvas.circle(x, y, radius, { stroke: "white", strokeWidth: 1, roughness: 1.3 });
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.roughCanvas.draw(circle);
    }

    drawDiamond(x: number, y: number, width: number, height: number) {
        const diamond = this.roughCanvas.polygon([[x, y - height / 2], [x + width / 2, y], [x, y + height / 2], [x - width / 2, y]], { stroke: "white", strokeWidth: 1, roughness: 1.3 });
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.roughCanvas.draw(diamond);
    }

    drawLine(x1: number, y1: number, x2: number, y2: number) {
        const line = this.roughCanvas.line(x1, y1, x2, y2, { stroke: "white", strokeWidth: 1, roughness: 1.3 });
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.roughCanvas.draw(line)
    }

    // drawArrow( x1: number, y1: number, x2: number, y2: number) {
    //     this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    //     this.ctx.beginPath();
    //     let headlen = 10;
    //     let dx = x2 - x1;
    //     let dy = y2 - y1;
    //     let angle = Math.atan2(dy, dx);
    //     this.ctx.moveTo(x1, y1);
    //     this.ctx.lineTo(x2, y2);
    //     this.ctx.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 6), y1 - headlen * Math.sin(angle - Math.PI / 6));
    //     this.ctx.moveTo(x2, y2);
    //     this.ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 6), y2 - headlen * Math.sin(angle + Math.PI / 6));
    //     this.ctx.strokeStyle = "white";
    //     this.ctx.lineWidth = 1;
    //     this.ctx.stroke();

    // }


    drawArrow(x1: number, y1: number, x2: number, y2: number) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const headlen = 10; // size of arrow head
        const dx = x2 - x1;
        const dy = y2 - y1;
        const angle = Math.atan2(dy, dx);

        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);          // start of line
        this.ctx.lineTo(x2, y2);          // end of line

        // arrow head (at end point)
        this.ctx.lineTo(
            x2 - headlen * Math.cos(angle - Math.PI / 6),
            y2 - headlen * Math.sin(angle - Math.PI / 6)
        );
        this.ctx.moveTo(x2, y2);
        this.ctx.lineTo(
            x2 - headlen * Math.cos(angle + Math.PI / 6),
            y2 - headlen * Math.sin(angle + Math.PI / 6)
        );

        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }

}

export { CanvasLogic };