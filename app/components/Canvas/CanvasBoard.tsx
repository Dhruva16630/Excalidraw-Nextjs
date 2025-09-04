"use client";

import { useEffect, useRef, useState } from "react";
import { CanvasLogic } from "./CanvasLogic";

export default function CanvasBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [engine, setEngine] = useState<CanvasLogic | null>(null);
  const [tool, setTool] = useState<"rectangle" | "circle" | "diamond" | "line" | "arrow" | null>(null);
  const [storeShapes, setStoreShapes] = useState<[]>([]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    // set proper size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // ✅ create engine once
    const engineInstance = new CanvasLogic(canvas);
    setEngine(engineInstance);

    let startX = 0;
    let startY = 0;
    let isDrawing = false;
    let hasMoved = false;

    const handleMouseDown = (e: MouseEvent) => {
      if (!tool) return;
      isDrawing = true;
      hasMoved = false;
      const rect = canvas.getBoundingClientRect();
      startX = e.clientX - rect.left;
      startY = e.clientY - rect.top;
    };

     const handleMouseMove = (e: MouseEvent) => {
      if (!tool || !isDrawing) return;
      hasMoved = true;

      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      // live preview
      switch (tool) {
        case "rectangle":
          engineInstance.drawRectangle(startX, startY, currentX - startX, currentY - startY);
          break;
        case "circle":
          const radius = Math.sqrt(
            Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2)
          );
          engineInstance.drawCircle(startX, startY, radius);
          break;
        case "diamond":
          engineInstance.drawDiamond(startX, startY, currentX - startX, currentY - startY);
          break;
        case "line":
          engineInstance.drawLine(startX, startY, currentX, currentY);
          break;
        case "arrow":
          engineInstance.drawArrow(startX, startY, currentX, currentY);
          break;
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!tool || !isDrawing) return;
      isDrawing = false;
      if (!hasMoved) return; // prevent click without movement
      const rect = canvas.getBoundingClientRect();
      const endX = e.clientX - rect.left;
      const endY = e.clientY - rect.top;

      switch (tool) {
        case "rectangle":
          engineInstance.drawRectangle(startX, startY, endX - startX, endY - startY);
          break;
        case "circle":
          const radius = Math.sqrt(
            Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
          );
          engineInstance.drawCircle(startX, startY, radius);
          break;
        case "diamond":
          engineInstance.drawDiamond(startX, startY, endX - startX, endY - startY);
          break;
        case "line":
          engineInstance.drawLine(startX, startY, endX, endY);
          break;
        case "arrow":
          engineInstance.drawArrow(startX, startY, endX, endY);
          break;
      }
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [tool]); // ✅ only depends on tool


  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="w-screen h-screen bg-[#121212]"
      />
      <div className="absolute top-8 left-96 gap-2 rounded-2xl bg-white flex p-2">
        <button onClick={()=> setTool("rectangle")}>
          Rect
        </button>
        <button onClick={() => setTool("circle")}>
          Circle
        </button>
        <button onClick={() => setTool("diamond")}>
          Diamond
        </button>
        <button onClick={() => setTool("line")}>
          Line
        </button>
        <button onClick={() => setTool("arrow")}>
          Arrow
        </button>
        
      </div>
    </div>
  );
}
