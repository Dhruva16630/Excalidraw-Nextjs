import rough from "roughjs";
import { RoughCanvas } from "roughjs/bin/canvas";
import { Shapes, Tool } from "./types";

class CanvasLogic {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private roughCanvas: RoughCanvas;
  private startX: number = 0;
  private startY: number = 0;
  private isDrawing: boolean = false;
  private hasMoved: boolean = false;
  private tool: Tool = null;
  private exsistingShapes: Shapes[] = [];
  public shapeIdCounter:number = 0;
  private ERASER_SIZE = 10;




  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.roughCanvas = rough.canvas(canvas);

    const savedShapes = localStorage.getItem("existingShapes");
    if (savedShapes) {
      this.exsistingShapes = JSON.parse(savedShapes);
      this.redraw();
    }


  }
  setTool(tool: Tool) {
    this.tool = tool;
    this.initEventListeners();

  }




  private saveShapesToLocalStorage() {
    localStorage.setItem("existingShapes", JSON.stringify(this.exsistingShapes));
  }
  initEventListeners() {
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
    this.canvas.addEventListener("dblclick", this.onDoubleClick);



  }


  private redraw(previewShape?: Shapes) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const shape of this.exsistingShapes) {
      this.drawexsitngShapes(shape);
    }

    if (previewShape) {
      this.drawexsitngShapes(previewShape);
    }
  }
  drawexsitngShapes(shape: Shapes) {
    if (shape.endX && shape.endY)
      switch (shape.tool) {
        case "rectangle":
          this.roughCanvas.rectangle(
            shape.startX,
            shape.startY,
            shape.endX - shape.startX,
            shape.endY - shape.startY,
            { stroke: "white", strokeWidth: 0.8, roughness: 0.6, seed: 12345 }
          );
          break;
        case "circle":
          const radius = Math.sqrt(
            Math.pow(shape.endX - shape.startX, 2) +
            Math.pow(shape.endY - shape.startY, 2)
          );
          this.roughCanvas.circle(shape.startX, shape.startY, radius, {
            stroke: "white",
            strokeWidth: 0.8,
            roughness: 0.6,
            seed: 12345,
          });
          break;
        case "diamond":
          this.roughCanvas.polygon(
            [
              [shape.startX, shape.startY - (shape.endY - shape.startY) / 2],
              [shape.startX + (shape.endX - shape.startX) / 2, shape.startY],
              [shape.startX, shape.startY + (shape.endY - shape.startY) / 2],
              [shape.startX - (shape.endX - shape.startX) / 2, shape.startY],
            ],
            { stroke: "white", strokeWidth: 0.8, roughness: 0.6, seed: 12345 }
          );
          break;
        case "line":
          this.roughCanvas.line(
            shape.startX,
            shape.startY,
            shape.endX,
            shape.endY,
            { stroke: "white", strokeWidth: 0.8, roughness: 0.6, seed: 12345 }
          );
          break;
        case "arrow":
          const headlen = 10;
          const dx = shape.endX - shape.startX;
          const dy = shape.endY - shape.startY;
          const angle = Math.atan2(dy, dx);
          this.ctx.beginPath();
          this.ctx.moveTo(shape.startX, shape.startY);
          this.ctx.lineTo(shape.endX, shape.endY);
          this.ctx.lineTo(
            shape.endX - headlen * Math.cos(angle - Math.PI / 6),
            shape.endY - headlen * Math.sin(angle - Math.PI / 6)
          );
          this.ctx.moveTo(shape.endX, shape.endY);
          this.ctx.lineTo(
            shape.endX - headlen * Math.cos(angle + Math.PI / 6),
            shape.endY - headlen * Math.sin(angle + Math.PI / 6)
          );
          this.ctx.strokeStyle = "white";
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
          break;
        case "pencil":
          if (shape.points && shape.points.length > 1) {
            this.ctx.beginPath();
            this.ctx.moveTo(shape.points[0].x, shape.points[0].y);

            for (let i = 1; i < shape.points.length - 1; i++) {
              const midX = (shape.points[i].x + shape.points[i + 1].x) / 2;
              const midY = (shape.points[i].y + shape.points[i + 1].y) / 2;
              this.ctx.quadraticCurveTo(shape.points[i].x, shape.points[i].y, midX, midY);
            }

            this.ctx.strokeStyle = "white";
            this.ctx.lineWidth = 2.5;   // thickness
            this.ctx.lineCap = "round";
            this.ctx.lineJoin = "round";
            this.ctx.stroke();
          }
          break;
        case "text":
          if (shape.text) {
            this.ctx.font = "20px Arial";
            this.ctx.fillStyle = "white";
            this.ctx.fillText(shape.text, shape.startX, shape.startY);
          }
          break;
      }
  }







  enableTextInput(x: number, y: number) {
    const rect = this.canvas.getBoundingClientRect();

    const input = document.createElement("input");
    input.type = "text";
    input.style.position = "absolute";
    input.style.left = `${rect.left + x}px`;
    input.style.top = `${rect.top + y}px`;
    input.style.background = "transparent";
    input.style.border = "none";
    input.style.outline = "none";
    input.style.color = "white";
    input.style.font = "20px Arial";

    document.body.appendChild(input);
    input.focus();

    let saved = false; // ✅ guard flag

    const saveText = () => {
      if (saved) return; // prevent double execution
      saved = true;

      const value = input.value.trim();
      if (value !== "") {
        const newShape: Shapes = {
          id:this.shapeIdCounter,
          tool: "text",
          startX: x,
          startY: y,
          endX: x,
          endY: y,
          text: value,
        };
        this.exsistingShapes.push(newShape);
        this.saveShapesToLocalStorage();
        this.redraw();
      }

      if (input.parentNode) {
        input.parentNode.removeChild(input);
      }
    };

    input.addEventListener("blur", saveText);
    input.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") {
        saveText();
      }
    });
  }



  private onDoubleClick = (e: MouseEvent) => {
    if (this.tool !== "text") return;

    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    this.enableTextInput(mouseX, mouseY);
  };

  createShape(shape: Shapes) {
  shape.id = ++this.shapeIdCounter;
  this.exsistingShapes.push(shape);
  this.saveShapesToLocalStorage();
}

  handleMouseDown = (e: MouseEvent) => {
    this.isDrawing = true;
    this.hasMoved = false;
    if (!this.tool) return;
    const rect = this.canvas.getBoundingClientRect();
    this.startX = e.clientX - rect.left;
    this.startY = e.clientY - rect.top;


    if (this.tool === "pencil") {
      const newShape: Shapes = {
        id:this.shapeIdCounter,
        tool: "pencil",
        startX: this.startX,
        startY: this.startY,
        endX: this.startX,
        endY: this.startY,
        points: [{ x: this.startX, y: this.startY }],
      };
      this.exsistingShapes.push(newShape);
    }

    // if(this.tool === "eraser") return
    if (this.tool === "eraser") {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      this.eraseObjectAt(mouseX, mouseY);
      return;
    }



  }

  handleMouseMove = (e: MouseEvent) => {
    if (!this.tool || !this.isDrawing) return;
    this.hasMoved = true;
    const rect = this.canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const previewShape: Shapes = {
      id:this.shapeIdCounter,
      tool: this.tool,
      startX: this.startX,
      startY: this.startY,
      endX: currentX,
      endY: currentY,
    };

    if (this.tool === "pencil") {
      const currentShape = this.exsistingShapes[this.exsistingShapes.length - 1];
      currentShape.points?.push({ x: currentX, y: currentY });
      this.redraw(); // redraw all shapes including pencil
      return;
    }

    if (this.tool === "eraser" && this.isDrawing) {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      this.eraseObjectAt(mouseX, mouseY);
      return;
    }

    switch (this.tool) {
      case "rectangle":
        const rectangle = this.roughCanvas.rectangle(this.startX, this.startY, currentX - this.startX, currentY - this.startY, { stroke: "white", strokeWidth: 0.8, roughness: 0.6, seed: 12345 });
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.roughCanvas.draw(rectangle);
        break;
      case "circle":
        const radius = Math.sqrt(
          Math.pow(currentX - this.startX, 2) + Math.pow(currentY - this.startY, 2)
        );
        const circle = this.roughCanvas.circle(this.startX, this.startY, radius, { stroke: "white", strokeWidth: 0.8, roughness: 0.6, seed: 12345 });
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.roughCanvas.draw(circle);
        break;
      case "diamond":
        const diamond = this.roughCanvas.polygon([[this.startX, this.startY - (currentY - this.startY) / 2], [this.startX + (currentX - this.startX) / 2, this.startY], [this.startX, this.startY + (currentY - this.startY) / 2], [this.startX - (currentX - this.startX) / 2, this.startY]], { stroke: "white", strokeWidth: 0.8, roughness: 0.6, seed: 12345 });
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.roughCanvas.draw(diamond);
        break;
      case "line":
        const line = this.roughCanvas.line(this.startX, this.startY, currentX, currentY, { stroke: "white", strokeWidth: 0.8, roughness: 0.6, seed: 12345 });
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
        break;
    }
    this.redraw(previewShape);




  }

  handleMouseUp = (e: MouseEvent) => {
    if (!this.tool || !this.isDrawing) return;
    this.isDrawing = false;
    if (!this.hasMoved) return;
    const rect = this.canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;
    const newShape: Shapes = {
      id: this.shapeIdCounter,
      tool: this.tool,
      startX: this.startX,
      startY: this.startY,
      endX: endX,
      endY: endY,
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.tool === "pencil") {
      const currentShape = this.exsistingShapes[this.exsistingShapes.length - 1];
      if (currentShape.points) {
        const path = new Path2D();
        path.moveTo(currentShape.points[0].x, currentShape.points[0].y);
        for (let i = 1; i < currentShape.points.length; i++) {
          path.lineTo(currentShape.points[i].x, currentShape.points[i].y);
        }
        currentShape.path = path;
      }
      this.saveShapesToLocalStorage();
      this.redraw();
      return;
    }


    switch (this.tool) {
      case "rectangle":
        this.roughCanvas.rectangle(this.startX, this.startY, endX - this.startX, endY - this.startY, { stroke: "white", strokeWidth: 0.8, roughness: 0.6, seed: 12345 });
        console.log("rectangle drawn");
        break;
      case "circle":
        const radius = Math.sqrt(
          Math.pow(endX - this.startX, 2) + Math.pow(endY - this.startY, 2)
        );
        this.roughCanvas.circle(this.startX, this.startY, radius, { stroke: "white", strokeWidth: 0.8, roughness: 0.6, seed: 12345 });
        break;
      case "diamond":
        this.roughCanvas.polygon([[this.startX, this.startY - (endY - this.startY) / 2], [this.startX + (endX - this.startX) / 2, this.startY], [this.startX, this.startY + (endY - this.startY) / 2], [this.startX - (endX - this.startX) / 2, this.startY]], { stroke: "white", strokeWidth: 0.8, roughness: 0.6, seed: 12345 });
        break;
      case "line":
        this.roughCanvas.line(this.startX, this.startY, endX, endY, { stroke: "white", strokeWidth: 0.8, roughness: 0.6, seed: 12345 });
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
    
    // this.exsistingShapes.push(newShape);
    // this.saveShapesToLocalStorage();
    this.createShape(newShape);
    this.redraw();
  }

  
  private isPointInShape(x: number, y: number, shape: Shapes): boolean {
    switch (shape.tool) {
      case "rectangle":
      case "diamond":
        return (
          x >= Math.min(shape.startX, shape.endX) &&
          x <= Math.max(shape.startX, shape.endX) &&
          y >= Math.min(shape.startY, shape.endY) &&
          y <= Math.max(shape.startY, shape.endY)
        );

      case "circle":
        const r = Math.sqrt(
          (shape.endX - shape.startX) ** 2 + (shape.endY - shape.startY) ** 2
        );
        const dist = Math.sqrt(
          (x - shape.startX) ** 2 + (y - shape.startY) ** 2
        );
        return dist <= r;

      case "line":
      case "arrow":
        // Distance from point to line
        const dx = shape.endX - shape.startX;
        const dy = shape.endY - shape.startY;
        const length = Math.sqrt(dx * dx + dy * dy);
        if (length === 0) return false;
        const t =
          ((x - shape.startX) * dx + (y - shape.startY) * dy) / (length * length);
        const closestX = shape.startX + t * dx;
        const closestY = shape.startY + t * dy;
        const distToLine = Math.sqrt((x - closestX) ** 2 + (y - closestY) ** 2);
        return distToLine <= this.ERASER_SIZE;

      case "text":
        this.ctx.font = "20px Arial";
        const textWidth = this.ctx.measureText(shape.text || "").width;
        const textHeight = 20; // approx font size
        return (
          x >= shape.startX &&
          x <= shape.startX + textWidth &&
          y <= shape.startY &&
          y >= shape.startY - textHeight
        );

      case "pencil":
        // Just erase whole freehand if cursor touches its bounding box
        return (
          x >= Math.min(shape.startX, shape.endX) - this.ERASER_SIZE &&
          x <= Math.max(shape.startX, shape.endX) + this.ERASER_SIZE &&
          y >= Math.min(shape.startY, shape.endY) - this.ERASER_SIZE &&
          y <= Math.max(shape.startY, shape.endY) + this.ERASER_SIZE
        );

      default:
        return false;
    }
  }

  // Object eraser: delete full shape if cursor touches it
 private eraseObjectAt(x: number, y: number) {
  const touchedShapes = this.exsistingShapes.filter(shape =>
    this.isPointInShape(x, y, shape)
  );

  if (touchedShapes.length > 0) {
    // Pick shape with largest ID (latest drawn)
    const target = touchedShapes.reduce((a, b) => (a.id > b.id ? a : b));

    this.exsistingShapes = this.exsistingShapes.filter(
      shape => shape.id !== target.id
    );

    this.saveShapesToLocalStorage();
    this.redraw();
  }
}



}

export { CanvasLogic }