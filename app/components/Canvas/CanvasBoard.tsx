"use client";

import { useEffect, useRef, useState } from "react";
import { CanvasLogic } from "./CanvasLogic";

export default function CanvasBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [engine, setEngine] = useState<CanvasLogic | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    // set proper size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const engineInstance = new CanvasLogic(canvas);
    setEngine(engineInstance);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="w-screen h-screen bg-[#121212]"
      />
      <div className="absolute top-8 left-96 gap-2 rounded-2xl bg-white flex p-2">
        <button onClick={() => engine?.drawRectangle(200, 200, 200, 200)}>
          Rect
        </button>
      </div>
    </div>
  );
}
