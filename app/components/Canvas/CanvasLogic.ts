import rough from "roughjs";
import { RoughCanvas } from "roughjs/bin/canvas";
import { Tool } from "./types";

class CanvasLogic {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D
    private roughCanvas: RoughCanvas;
    private startX: number = 0;
    private startY: number = 0;
    private isDrawing: boolean = false;
    private hasMoved: boolean = false;
    private tool: Tool = null;
    


    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.roughCanvas = rough.canvas(canvas);


    }
    setTool(tool: Tool) {
        this.tool = tool;
        this.initEventListeners();

    }
    initEventListeners() {
        this.canvas.addEventListener("mousedown", this.handleMouseDown);
        this.canvas.addEventListener("mousemove", this.handleMouseMove);
        this.canvas.addEventListener("mouseup", this.handleMouseUp);
    }

    handleMouseDown = (e: MouseEvent) => {
        this.isDrawing = true;
        this.hasMoved = false;
        if (!this.tool) return;
        const rect = this.canvas.getBoundingClientRect();
        this.startX = e.clientX - rect.left;
        this.startY = e.clientY - rect.top;

    }

    handleMouseMove = (e: MouseEvent) => {
        if (!this.tool || !this.isDrawing) return;
        this.hasMoved = true;
        const rect = this.canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        switch (this.tool) {
            case "rectangle":
                const rectangle = this.roughCanvas.rectangle(this.startX, this.startY, currentX - this.startX, currentY - this.startY, { stroke: "white", strokeWidth: 0.8, roughness: 0.6 });
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.roughCanvas.draw(rectangle);
                break;
            case "circle":
                const radius = Math.sqrt(
                    Math.pow(currentX - this.startX, 2) + Math.pow(currentY - this.startY, 2)
                );
                const circle = this.roughCanvas.circle(this.startX, this.startY, radius, { stroke: "white", strokeWidth: 0.8, roughness: 0.6});
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.roughCanvas.draw(circle);
                break;
            case "diamond":
                const diamond = this.roughCanvas.polygon([[this.startX, this.startY - (currentY - this.startY) / 2], [this.startX + (currentX - this.startX) / 2, this.startY], [this.startX, this.startY + (currentY - this.startY) / 2], [this.startX - (currentX - this.startX) / 2, this.startY]], { stroke: "white", strokeWidth: 0.8, roughness: 0.6 });
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.roughCanvas.draw(diamond);
                break;
            case "line":
                const line = this.roughCanvas.line(this.startX, this.startY, currentX, currentY, { stroke: "white", strokeWidth: 0.8, roughness: 0.6 });
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.roughCanvas.draw(line)
                break;
            case "arrow":
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                const x1 = this.startX;
                const y1 = this.startY;
                const x2 = currentX;
                const y2 = currentY;
                const headlen = 10;
                const dx = x2 - x1;
                const dy = y2 - y1;
                const angle = Math.atan2(dy, dx);
                this.ctx.beginPath();
                this.ctx.moveTo(x1, y1);
                this.ctx.lineTo(x2, y2);
                this.ctx.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 6), y2 - headlen * Math.sin(angle - Math.PI / 6));
                this.ctx.moveTo(x2, y2);
                this.ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 6), y2 - headlen * Math.sin(angle + Math.PI / 6));
                this.ctx.strokeStyle = "white";
                this.ctx.lineWidth = 1;
                this.ctx.stroke();



        }




    }

    handleMouseUp = (e: MouseEvent) => {
        if (!this.tool || !this.isDrawing) return;
        this.isDrawing = false;
        if (!this.hasMoved) return;
        const rect = this.canvas.getBoundingClientRect();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        switch (this.tool) {
            case "rectangle":
                this.roughCanvas.rectangle(this.startX, this.startY, endX - this.startX, endY - this.startY, { stroke: "white", strokeWidth: 0.8, roughness: 0.6 });
                console.log("rectangle drawn");
                break;
            case "circle":
                const radius = Math.sqrt(
                    Math.pow(endX - this.startX, 2) + Math.pow(endY - this.startY, 2)
                );
                this.roughCanvas.circle(this.startX, this.startY, radius,{ stroke: "white", strokeWidth: 0.8, roughness: 0.6 });
                break;
            case "diamond":
                this.roughCanvas.polygon([[this.startX, this.startY - (endY - this.startY) / 2], [this.startX + (endX - this.startX) / 2, this.startY], [this.startX, this.startY + (endY - this.startY) / 2], [this.startX - (endX - this.startX) / 2, this.startY]], { stroke: "white", strokeWidth: 0.8, roughness: 0.6 });
                break;
            case "line":
                this.roughCanvas.line(this.startX, this.startY, endX, endY, { stroke: "white", strokeWidth: 0.8, roughness: 0.6 });
                break;
            case "arrow":
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                const x1 = this.startX;
                const y1 = this.startY;
                const x2 = endX;
                const y2 = endY;
                const headlen = 10;
                const dx = x2 - x1;
                const dy = y2 - y1;
                const angle = Math.atan2(dy, dx);
                this.ctx.beginPath();
                this.ctx.moveTo(x1, y1);
                this.ctx.lineTo(x2, y2);
                this.ctx.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 6), y2 - headlen * Math.sin(angle - Math.PI / 6));
                this.ctx.moveTo(x2, y2);
                this.ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 6), y2 - headlen * Math.sin(angle + Math.PI / 6));
                this.ctx.strokeStyle = "white";
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
                break;
        }
    }

}

export { CanvasLogic };