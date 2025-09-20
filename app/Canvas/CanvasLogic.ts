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
  public shapeIdCounter: number = 0;
  private ERASER_SIZE = 10;
  private scale = 1;
  private offsetX = 0;
  private offsetY = 0;
  private isPanning = false;
  private panStartX = 0;
  private panStartY = 0;




  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.roughCanvas = rough.canvas(canvas);

    const savedShapes = localStorage.getItem("existingShapes");
    if (savedShapes) {
      this.exsistingShapes = JSON.parse(savedShapes);
      this.redraw();
    }

    this.canvas.addEventListener("mousedown", (e) => {
      if (this.tool === "grab") {
        this.isPanning = true;
        this.panStartX = e.clientX - this.offsetX;
        this.panStartY = e.clientY - this.offsetY;
      }
    });
    this.canvas.addEventListener("mousemove", (e) => {
      if (this.isPanning) {
        this.offsetX = e.clientX - this.panStartX;
        this.offsetY = e.clientY - this.panStartY;
        this.redraw();
      }
    });
    this.canvas.addEventListener("mouseup", () => {
      this.isPanning = false;
    });

    this.canvas.addEventListener("wheel", (e: WheelEvent) => {

      if (!e.ctrlKey) return; // only zoom when ctrl is pressed
      e.preventDefault();

      const zoomFactor = 1.1; // 10% per step
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const prevScale = this.scale;
      if (e.deltaY < 0) {
        this.scale *= zoomFactor; // zoom in
      } else {
        this.scale /= zoomFactor; // zoom out
      }

      // keep mouse under same position
      this.offsetX -= (mouseX - this.offsetX) * (this.scale / prevScale - 1);
      this.offsetY -= (mouseY - this.offsetY) * (this.scale / prevScale - 1);

      this.redraw();
    }, { passive: false });




  }
  setTool(tool: Tool) {
    this.tool = tool;
    this.initEventListeners();

  }

  private screenToWorld(x: number, y: number): { x: number; y: number } {
    return {
      x: (x - this.offsetX) / this.scale,
      y: (y - this.offsetY) / this.scale,
    };
  }

  private worldToScreen(x: number, y: number): { x: number; y: number } {
    return {
      x: x * this.scale + this.offsetX,
      y: y * this.scale + this.offsetY,
    };
  }



  public saveShapesToLocalStorage() {
    localStorage.setItem("existingShapes", JSON.stringify(this.exsistingShapes));
  }
  initEventListeners() {
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
    this.canvas.addEventListener("dblclick", this.onDoubleClick);
    window.addEventListener("resize",() => this.redraw());
    window.addEventListener("visibilitychange",()=>{
      if(document.visibilityState === "visible"){
        this.redraw();
      }
    })



  }

  public resetZoom() {
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.redraw();
  }

  public zoomAtCenter(factor: number) {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const worldPos = this.screenToWorld(centerX, centerY);

    this.scale *= factor;
    const newScreen = this.worldToScreen(worldPos.x, worldPos.y);
    this.offsetX += centerX - newScreen.x;
    this.offsetY += centerY - newScreen.y;

    this.redraw();
  }
  getZoomedPercentage(){
    return this.scale;
  }


  private redraw(previewShape?: Shapes) {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.setTransform(this.scale, 0, 0, this.scale, this.offsetX, this.offsetY);
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
            { stroke: "white", strokeWidth: 0.8, roughness: 0.6,seed: 12345,  }
          );
          break;
        case "circle":
          const radius = Math.sqrt(
            Math.pow(shape.endX - shape.startX, 2) +
            Math.pow(shape.endY - shape.startY, 2)
          );
          this.roughCanvas.circle(shape.startX, shape.startY, radius * 2, {
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
            this.ctx.font = "28px Excalifont";
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
    input.style.font = "28px Excalifont";

    document.body.appendChild(input);
    input.focus();

    let saved = false; // ✅ guard flag

    const saveText = () => {
      if (saved) return; // prevent double execution
      saved = true;

      const value = input.value.trim();
      if (value !== "") {
        const newShape: Shapes = {
          id: ++this.shapeIdCounter,
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
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const { x: worldX, y: worldY } = this.screenToWorld(mouseX, mouseY);
    this.startX = worldX;
    this.startY = worldY

    if (this.tool === "eraser") {

      this.eraseObjectAt(mouseX, mouseY);
      return;
    }


    if (this.tool === "pencil") {
      const newShape: Shapes = {
        id: ++this.shapeIdCounter,
        tool: "pencil",
        startX: worldX,
        startY: worldY,
        endX: worldX,
        endY: worldY,
        points: [{ x: worldX, y: worldY }],
      };
      this.exsistingShapes.push(newShape);
    }




  }

  handleMouseMove = (e: MouseEvent) => {
    if (!this.tool || !this.isDrawing) return;
    this.hasMoved = true;
    const rect = this.canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    const { x: worldX, y: worldY } = this.screenToWorld(currentX, currentY);
    const previewShape: Shapes = {
      id: this.shapeIdCounter,
      tool: this.tool,
      startX: this.startX,
      startY: this.startY,
      endX: worldX,
      endY: worldY,
    };

    if (this.tool === "eraser" && this.isDrawing) {

      this.eraseObjectAt(worldX, worldY);
      return;
    }

    if (this.tool === "pencil") {
      const currentShape = this.exsistingShapes[this.exsistingShapes.length - 1];
      currentShape.points?.push({ x: worldX, y: worldY });
      this.redraw(); // redraw all shapes including pencil
      return;
    }


    switch (this.tool) {
      case "rectangle":
        const rectangle = this.roughCanvas.rectangle(this.startX, this.startY, worldX - this.startX, worldY - this.startY, { stroke: "white", strokeWidth: 0.8, roughness: 0.6, seed: 12345 });
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.roughCanvas.draw(rectangle);
        break;
      case "circle":
        const radius = Math.sqrt(
          Math.pow(currentX - this.startX, 2) + Math.pow(currentY - this.startY, 2)
        );
        const circle = this.roughCanvas.circle(this.startX, this.startY, radius * 2, { stroke: "white", strokeWidth: 0.8, roughness: 0.6, seed: 12345 });
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
    const { x: worldX, y: worldY } = this.screenToWorld(endX, endY);

    const newShape: Shapes = {
      id: ++this.shapeIdCounter,
      tool: this.tool,
      startX: this.startX,
      startY: this.startY,
      endX: worldX,
      endY: worldY,
    }
    if (this.tool === "eraser") return;

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
        this.roughCanvas.circle(this.startX, this.startY, radius * 2, { stroke: "white", strokeWidth: 0.8, roughness: 0.6, seed: 12345 });
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

  private pointToSegmentDistance(px: number, py: number, x1: number, y1: number, x2: number, y2: number) {
    const dx = x2 - x1, dy = y2 - y1;
    const len2 = dx * dx + dy * dy;
    if (len2 === 0) return Math.hypot(px - x1, py - y1);
    let t = ((px - x1) * dx + (py - y1) * dy) / len2;
    t = Math.max(0, Math.min(1, t));
    const cx = x1 + t * dx, cy = y1 + t * dy;
    return Math.hypot(px - cx, py - cy);
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
        const length = Math.hypot(dx, dy);
        if (length === 0) return Math.hypot(x - shape.startX, y - shape.startY) <= this.ERASER_SIZE;
        let t = ((x - shape.startX) * dx + (y - shape.startY) * dy) / (length * length);
        t = Math.max(0, Math.min(1, t)); // clamp to segment
        const closestX = shape.startX + t * dx;
        const closestY = shape.startY + t * dy;
        const distToLine = Math.hypot(x - closestX, y - closestY);
        return distToLine <= this.ERASER_SIZE;

      case "text":
        this.ctx.font = "28px Excalifont";
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
        if (shape.path) {
          // widen stroke for an eraser tolerance
          const prev = this.ctx.lineWidth;
          this.ctx.lineWidth = (2.5 /* your draw width */) + this.ERASER_SIZE * 2;
          const hit = this.ctx.isPointInStroke(shape.path as Path2D, x, y);
          this.ctx.lineWidth = prev;
          return hit;
        }

        if (shape.points && shape.points.length > 1) {
          for (let i = 0; i < shape.points.length - 1; i++) {
            const p1 = shape.points[i], p2 = shape.points[i + 1];
            const d = this.pointToSegmentDistance(x, y, p1.x, p1.y, p2.x, p2.y);
            if (d <= this.ERASER_SIZE + 2.5 * 0.5) return true;
          }
        }

      default:
        return false;
    }
  }

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