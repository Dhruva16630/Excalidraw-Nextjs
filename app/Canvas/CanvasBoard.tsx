"use client";

import { useEffect, useRef, useState } from "react";
import { CanvasLogic } from "./CanvasLogic";
import { Tool } from "./types";

export default function CanvasBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [engine, setEngine] = useState<CanvasLogic | null>(null);
  const [tool, setTool] = useState<Tool>(null);
  const [zoomPercentage, setZoomPercentage] = useState(1);


  const tools: { key: string, value: string }[] = [
    { key: "grab", value: "Grab" },
    { key: "rectangle", value: "Rect" },
    { key: "circle", value: "Circle" },
    { key: "diamond", value: "Diamond" },
    { key: "pencil", value: "Pencil" },
    { key: "line", value: "Line" },
    { key: "arrow", value: "Arrow" },
    { key: "text", value: "Write" },
    { key: "eraser", value: "Eraser" }
  ]

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    // set proper size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // ✅ create engine once
    const engineInstance = new CanvasLogic(canvas);
    setEngine(engineInstance);





    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);



  }, []);

  useEffect(() => {
    if (engine && tool) {
      engine.setTool(tool);

    }

  }, [tool, engine])


  useEffect(() => {
    if (!engine) return;

    const interval = setInterval(() => {
      setZoomPercentage(engine.getZoomedPercentage()); // keep sync with engine
    }, 100);

    return () => clearInterval(interval);
  }, [engine]);


  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="w-screen h-screen bg-[#121212]"
      />
      <div className="fixed top-5 w-full flex justify-center">
        <div className="gap-2  rounded-2xl bg-white flex p-2">
          {tools.map(({ key, value }) => (
            <button
              key={key}
              onClick={() => setTool(key as Tool)}
              className={`px-3 py-1 rounded-lg transition ${tool === key ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
      <div className="fixed bottom-5 left-4 flex justify-center gap-1 bg-white rounded-lg p-1">
        <button className="hover:bg-gray-200 px-3 py-1 rounded-2xl"
          onClick={() => engine?.zoomAtCenter(1.1)}
        >
          Plus
        </button>
        <button className="hover:bg-gray-200 px-3 py-1 rounded-2xl"
          onClick={() => engine?.resetZoom()}
        >
          {Math.round(zoomPercentage * 100)}%
        </button>
        <button className="hover:bg-gray-200 px-3 py-1 rounded-2xl"
          onClick={() => engine?.zoomAtCenter(0.9)}
        >
          Minus
        </button>
      </div>

    </div>
  );
}
