// import rough from "roughjs";
// import { RoughCanvas } from "roughjs/bin/canvas";
// import { Shapes, Tool } from "./types";

// class CanvasLogic {
//     private canvas: HTMLCanvasElement;
//     private ctx: CanvasRenderingContext2D
//     private roughCanvas: RoughCanvas;
//     private startX: number = 0;
//     private startY: number = 0;
//     private isDrawing: boolean = false;
//     private hasMoved: boolean = false;
//     private tool: Tool = null;
//     private exsistingShapes: Shapes[] = [];





//     constructor(canvas: HTMLCanvasElement) {
//         this.canvas = canvas;
//         this.ctx = canvas.getContext("2d")!;
//         this.roughCanvas = rough.canvas(canvas);

//         const savedShapes = localStorage.getItem("existingShapes");
//         if (savedShapes) {
//             this.exsistingShapes = JSON.parse(savedShapes);
//             this.redraw();
//         }


//     }
//     setTool(tool: Tool) {
//         this.tool = tool;
//         this.initEventListeners();

//     }




//     private saveShapesToLocalStorage() {
//         localStorage.setItem("existingShapes", JSON.stringify(this.exsistingShapes));
//     }
//     initEventListeners() {
//         this.canvas.addEventListener("mousedown", this.handleMouseDown);
//         this.canvas.addEventListener("mousemove", this.handleMouseMove);
//         this.canvas.addEventListener("mouseup", this.handleMouseUp);


//     }

//     private getHandleAt(x: number, y: number) {
//         for (const shape of this.exsistingShapes) {
//             if (shape.tool === "rectangle") {
//                 const handles = [
//                     { x: shape.startX, y: shape.startY, pos: "tl" },
//                     { x: shape.endX, y: shape.startY, pos: "tr" },
//                     { x: shape.startX, y: shape.endY, pos: "bl" },
//                     { x: shape.endX, y: shape.endY, pos: "br" },
//                 ];
//                 for (const h of handles) {
//                     if (Math.abs(x - h.x) < 6 && Math.abs(y - h.y) < 6) {
//                         return { shape, handle: h.pos };
//                     }
//                 }
//             }
//         }
//         return null;
//     }


//     private redraw(previewShape?: Shapes) {
//         this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

//         for (const shape of this.exsistingShapes) {
//             this.drawexsitngShapes(shape);
//         }

//         if (previewShape) {
//             this.drawexsitngShapes(previewShape);
//         }
//     }
//     drawexsitngShapes(shape: Shapes) {
//         switch (shape.tool) {
//             case "rectangle":
//             case "rectangle":
//                 this.roughCanvas.rectangle(
//                     shape.startX,
//                     shape.startY,
//                     shape.endX - shape.startX,
//                     shape.endY - shape.startY,
//                     { stroke: "white", strokeWidth: 0.8, roughness: 0.6, seed: 12345 }
//                 );
//                 break;
//             case "circle":
//                 const radius = Math.sqrt(
//                     Math.pow(shape.endX - shape.startX, 2) +
//                     Math.pow(shape.endY - shape.startY, 2)
//                 );
//                 this.roughCanvas.circle(shape.startX, shape.startY, radius, {
//                     stroke: "white",
//                     strokeWidth: 0.8,
//                     roughness: 0.6,
//                     seed: 12345,
//                 });
//                 break;
//             case "diamond":
//                 this.roughCanvas.polygon(
//                     [
//                         [shape.startX, shape.startY - (shape.endY - shape.startY) / 2],
//                         [shape.startX + (shape.endX - shape.startX) / 2, shape.startY],
//                         [shape.startX, shape.startY + (shape.endY - shape.startY) / 2],
//                         [shape.startX - (shape.endX - shape.startX) / 2, shape.startY],
//                     ],
//                     { stroke: "white", strokeWidth: 0.8, roughness: 0.6, seed: 12345 }
//                 );
//                 break;
//             case "line":
//                 this.roughCanvas.line(
//                     shape.startX,
//                     shape.startY,
//                     shape.endX,
//                     shape.endY,
//                     { stroke: "white", strokeWidth: 0.8, roughness: 0.6, seed: 12345 }
//                 );
//                 break;
//             case "arrow":
//                 const headlen = 10;
//                 const dx = shape.endX - shape.startX;
//                 const dy = shape.endY - shape.startY;
//                 const angle = Math.atan2(dy, dx);
//                 this.ctx.beginPath();
//                 this.ctx.moveTo(shape.startX, shape.startY);
//                 this.ctx.lineTo(shape.endX, shape.endY);
//                 this.ctx.lineTo(
//                     shape.endX - headlen * Math.cos(angle - Math.PI / 6),
//                     shape.endY - headlen * Math.sin(angle - Math.PI / 6)
//                 );
//                 this.ctx.moveTo(shape.endX, shape.endY);
//                 this.ctx.lineTo(
//                     shape.endX - headlen * Math.cos(angle + Math.PI / 6),
//                     shape.endY - headlen * Math.sin(angle + Math.PI / 6)
//                 );
//                 this.ctx.strokeStyle = "white";
//                 this.ctx.lineWidth = 1;
//                 this.ctx.stroke();
//                 break;
//         }
//     }
//     handleMouseDown = (e: MouseEvent) => {
//         this.isDrawing = true;
//         this.hasMoved = false;
//         if (!this.tool) return;
//         const rect = this.canvas.getBoundingClientRect();
//         this.startX = e.clientX - rect.left;
//         this.startY = e.clientY - rect.top;

        

//     }

//     handleMouseMove = (e: MouseEvent) => {
//         if (!this.tool || !this.isDrawing) return;
//         this.hasMoved = true;
//         const rect = this.canvas.getBoundingClientRect();
//         const currentX = e.clientX - rect.left;
//         const currentY = e.clientY - rect.top;

//         const previewShape: Shapes = {
//             tool: this.tool,
//             startX: this.startX,
//             startY: this.startY,
//             endX: currentX,
//             endY: currentY,
//         };

//         switch (this.tool) {
//             case "rectangle":
//                 const rectangle = this.roughCanvas.rectangle(this.startX, this.startY, currentX - this.startX, currentY - this.startY, { stroke: "white", strokeWidth: 0.8, roughness: 0.6, seed: 12345 });
//                 this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
//                 this.roughCanvas.draw(rectangle);
//                 break;
//             case "circle":
//                 const radius = Math.sqrt(
//                     Math.pow(currentX - this.startX, 2) + Math.pow(currentY - this.startY, 2)
//                 );
//                 const circle = this.roughCanvas.circle(this.startX, this.startY, radius, { stroke: "white", strokeWidth: 0.8, roughness: 0.6, seed: 12345 });
//                 this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
//                 this.roughCanvas.draw(circle);
//                 break;
//             case "diamond":
//                 const diamond = this.roughCanvas.polygon([[this.startX, this.startY - (currentY - this.startY) / 2], [this.startX + (currentX - this.startX) / 2, this.startY], [this.startX, this.startY + (currentY - this.startY) / 2], [this.startX - (currentX - this.startX) / 2, this.startY]], { stroke: "white", strokeWidth: 0.8, roughness: 0.6, seed: 12345 });
//                 this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
//                 this.roughCanvas.draw(diamond);
//                 break;
//             case "line":
//                 const line = this.roughCanvas.line(this.startX, this.startY, currentX, currentY, { stroke: "white", strokeWidth: 0.8, roughness: 0.6, seed: 12345 });
//                 this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
//                 this.roughCanvas.draw(line)
//                 break;
//             case "arrow":
//                 this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
//                 const x1 = this.startX;
//                 const y1 = this.startY;
//                 const x2 = currentX;
//                 const y2 = currentY;
//                 const headlen = 10;
//                 const dx = x2 - x1;
//                 const dy = y2 - y1;
//                 const angle = Math.atan2(dy, dx);
//                 this.ctx.beginPath();
//                 this.ctx.moveTo(x1, y1);
//                 this.ctx.lineTo(x2, y2);
//                 this.ctx.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 6), y2 - headlen * Math.sin(angle - Math.PI / 6));
//                 this.ctx.moveTo(x2, y2);
//                 this.ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 6), y2 - headlen * Math.sin(angle + Math.PI / 6));
//                 this.ctx.strokeStyle = "white";
//                 this.ctx.lineWidth = 1;
//                 this.ctx.stroke();
//         }
//         this.redraw(previewShape);




//     }

//     handleMouseUp = (e: MouseEvent) => {
//         if (!this.tool || !this.isDrawing) return;
//         this.isDrawing = false;
//         if (!this.hasMoved) return;
//         const rect = this.canvas.getBoundingClientRect();
//         const endX = e.clientX - rect.left;
//         const endY = e.clientY - rect.top;
//         const newShape: Shapes = {
//             tool: this.tool,
//             startX: this.startX,
//             startY: this.startY,
//             endX: endX,
//             endY: endY,
//         }

//         this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

//         switch (this.tool) {
//             case "rectangle":
//                 this.roughCanvas.rectangle(this.startX, this.startY, endX - this.startX, endY - this.startY, { stroke: "white", strokeWidth: 0.8, roughness: 0.6, seed: 12345 });
//                 console.log("rectangle drawn");
//                 break;
//             case "circle":
//                 const radius = Math.sqrt(
//                     Math.pow(endX - this.startX, 2) + Math.pow(endY - this.startY, 2)
//                 );
//                 this.roughCanvas.circle(this.startX, this.startY, radius, { stroke: "white", strokeWidth: 0.8, roughness: 0.6, seed: 12345 });
//                 break;
//             case "diamond":
//                 this.roughCanvas.polygon([[this.startX, this.startY - (endY - this.startY) / 2], [this.startX + (endX - this.startX) / 2, this.startY], [this.startX, this.startY + (endY - this.startY) / 2], [this.startX - (endX - this.startX) / 2, this.startY]], { stroke: "white", strokeWidth: 0.8, roughness: 0.6, seed: 12345 });
//                 break;
//             case "line":
//                 this.roughCanvas.line(this.startX, this.startY, endX, endY, { stroke: "white", strokeWidth: 0.8, roughness: 0.6, seed: 12345 });
//                 break;
//             case "arrow":
//                 this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
//                 const x1 = this.startX;
//                 const y1 = this.startY;
//                 const x2 = endX;
//                 const y2 = endY;
//                 const headlen = 10;
//                 const dx = x2 - x1;
//                 const dy = y2 - y1;
//                 const angle = Math.atan2(dy, dx);
//                 this.ctx.beginPath();
//                 this.ctx.moveTo(x1, y1);
//                 this.ctx.lineTo(x2, y2);
//                 this.ctx.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 6), y2 - headlen * Math.sin(angle - Math.PI / 6));
//                 this.ctx.moveTo(x2, y2);
//                 this.ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 6), y2 - headlen * Math.sin(angle + Math.PI / 6));
//                 this.ctx.strokeStyle = "white";
//                 this.ctx.lineWidth = 1;
//                 this.ctx.stroke();
//                 break;
//         }
//         this.exsistingShapes.push(newShape);
//         this.saveShapesToLocalStorage();
//         this.redraw();
//     }



// }

// export { CanvasLogic };



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
    localStorage.setItem(
      "existingShapes",
      JSON.stringify(this.exsistingShapes)
    );
  }

  initEventListeners() {
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
  }

  private getHandleAt(x: number, y: number) {
    for (const shape of this.exsistingShapes) {
      if (shape.tool === "rectangle") {
        const handles = [
          { x: shape.startX, y: shape.startY, pos: "tl" },
          { x: shape.endX, y: shape.startY, pos: "tr" },
          { x: shape.startX, y: shape.endY, pos: "bl" },
          { x: shape.endX, y: shape.endY, pos: "br" },
        ];
        for (const h of handles) {
          if (Math.abs(x - h.x) < 6 && Math.abs(y - h.y) < 6) {
            return { shape, handle: h.pos };
          }
        }
      }
    }
    return null;
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
            [
              shape.startX,
              shape.startY - (shape.endY - shape.startY) / 2,
            ],
            [
              shape.startX + (shape.endX - shape.startX) / 2,
              shape.startY,
            ],
            [
              shape.startX,
              shape.startY + (shape.endY - shape.startY) / 2,
            ],
            [
              shape.startX - (shape.endX - shape.startX) / 2,
              shape.startY,
            ],
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
    }
  }

  handleMouseDown = (e: MouseEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // hit-test first
    const shape = this.getShapeAt(x, y);
    if (shape) {
      console.log("Clicked on shape:", shape.tool);
      return;
    }

    this.isDrawing = true;
    this.hasMoved = false;
    if (!this.tool) return;
    this.startX = x;
    this.startY = y;
  };

  handleMouseMove = (e: MouseEvent) => {
    if (!this.tool || !this.isDrawing) return;
    this.hasMoved = true;
    const rect = this.canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const previewShape: Shapes = {
      tool: this.tool,
      startX: this.startX,
      startY: this.startY,
      endX: currentX,
      endY: currentY,
    };

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    switch (this.tool) {
      case "rectangle":
        this.roughCanvas.rectangle(
          this.startX,
          this.startY,
          currentX - this.startX,
          currentY - this.startY,
          { stroke: "white", strokeWidth: 0.8, roughness: 0.6, seed: 12345 }
        );
        break;
      case "circle":
        const radius = Math.sqrt(
          Math.pow(currentX - this.startX, 2) +
            Math.pow(currentY - this.startY, 2)
        );
        this.roughCanvas.circle(this.startX, this.startY, radius * 2, {
          stroke: "white",
          strokeWidth: 0.8,
          roughness: 0.6,
          seed: 12345,
        });
        break;
      case "diamond":
        this.roughCanvas.polygon(
          [
            [this.startX, this.startY - (currentY - this.startY) / 2],
            [this.startX + (currentX - this.startX) / 2, this.startY],
            [this.startX, this.startY + (currentY - this.startY) / 2],
            [this.startX - (currentX - this.startX) / 2, this.startY],
          ],
          { stroke: "white", strokeWidth: 0.8, roughness: 0.6, seed: 12345 }
        );
        break;
      case "line":
        this.roughCanvas.line(this.startX, this.startY, currentX, currentY, {
          stroke: "white",
          strokeWidth: 0.8,
          roughness: 0.6,
          seed: 12345,
        });
        break;
      case "arrow":
        const headlen = 10;
        const dx = currentX - this.startX;
        const dy = currentY - this.startY;
        const angle = Math.atan2(dy, dx);
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.startY);
        this.ctx.lineTo(currentX, currentY);
        this.ctx.lineTo(
          currentX - headlen * Math.cos(angle - Math.PI / 6),
          currentY - headlen * Math.sin(angle - Math.PI / 6)
        );
        this.ctx.moveTo(currentX, currentY);
        this.ctx.lineTo(
          currentX - headlen * Math.cos(angle + Math.PI / 6),
          currentY - headlen * Math.sin(angle + Math.PI / 6)
        );
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }
    this.redraw(previewShape);
  };

  handleMouseUp = (e: MouseEvent) => {
    if (!this.tool || !this.isDrawing) return;
    this.isDrawing = false;
    if (!this.hasMoved) return;

    const rect = this.canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    let path: Path2D | undefined;

    switch (this.tool) {
      case "rectangle":
        path = new Path2D();
        path.rect(this.startX, this.startY, endX - this.startX, endY - this.startY);
        this.roughCanvas.rectangle(this.startX, this.startY, endX - this.startX, endY - this.startY, { stroke: "white", strokeWidth: 0.8 });
        break;

      case "circle":
        path = new Path2D();
        const radius = Math.sqrt(
          Math.pow(endX - this.startX, 2) + Math.pow(endY - this.startY, 2)
        );
        path.arc(this.startX, this.startY, radius, 0, Math.PI * 2);
        this.roughCanvas.circle(this.startX, this.startY, radius * 2, { stroke: "white", strokeWidth: 0.8 });
        break;

      case "diamond":
        path = new Path2D();
        path.moveTo(this.startX, this.startY - (endY - this.startY) / 2);
        path.lineTo(this.startX + (endX - this.startX) / 2, this.startY);
        path.lineTo(this.startX, this.startY + (endY - this.startY) / 2);
        path.lineTo(this.startX - (endX - this.startX) / 2, this.startY);
        path.closePath();
        this.roughCanvas.polygon([[this.startX, this.startY - (endY - this.startY) / 2], [this.startX + (endX - this.startX) / 2, this.startY], [this.startX, this.startY + (endY - this.startY) / 2], [this.startX - (endX - this.startX) / 2, this.startY]], { stroke: "white", strokeWidth: 0.8 });
        break;

      case "line":
        path = new Path2D();
        path.moveTo(this.startX, this.startY);
        path.lineTo(endX, endY);
        this.roughCanvas.line(this.startX, this.startY, endX, endY, { stroke: "white", strokeWidth: 0.8 });
        break;

      case "arrow":
        path = new Path2D();
        path.moveTo(this.startX, this.startY);
        path.lineTo(endX, endY);
        const headlen = 10;
        const dx = endX - this.startX;
        const dy = endY - this.startY;
        const angle = Math.atan2(dy, dx);
        path.lineTo(endX - headlen * Math.cos(angle - Math.PI / 6), endY - headlen * Math.sin(angle - Math.PI / 6));
        path.moveTo(endX, endY);
        path.lineTo(endX - headlen * Math.cos(angle + Math.PI / 6), endY - headlen * Math.sin(angle + Math.PI / 6));
        this.ctx.stroke(path);
        break;
    }

    const newShape: Shapes = {
      tool: this.tool,
      startX: this.startX,
      startY: this.startY,
      endX,
      endY,
      path,
    };

    this.exsistingShapes.push(newShape);
    this.saveShapesToLocalStorage();
    this.redraw();
  };

  public getShapeAt(x: number, y: number): Shapes | null {
    for (const shape of this.exsistingShapes) {
      if (!shape.path) continue;
      if (
        // this.ctx.isPointInStroke(shape.path, x, y) ||
        this.ctx.isPointInPath(shape.path, x, y)
      ) {
        return shape;
      }
    }
    return null;
  }
}

export { CanvasLogic };
