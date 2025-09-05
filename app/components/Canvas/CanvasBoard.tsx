"use client";

import { useEffect, useRef, useState } from "react";
import { CanvasLogic } from "./CanvasLogic";
import { Tool } from "./types";

export default function CanvasBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [engine, setEngine] = useState<CanvasLogic | null>(null);
  const [tool, setTool] = useState<Tool>(null);

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

  useEffect(() =>{
    if(engine && tool){
      engine.setTool(tool);
    }

  }, [tool, engine])


  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="w-screen h-screen bg-[#121212]"
      />
      <div className="absolute top-8 left-96 gap-2 rounded-2xl bg-white flex p-2">
        <button onClick={() =>{setTool("rectangle")}} >
          Rect
        </button>
        <button onClick={()=>{setTool("circle"), console.log("tool set to circle")}}>
          Circle
        </button>
        <button onClick={()=>{setTool("diamond")}}>
          Diamond
        </button>
        <button onClick={()=>{setTool("line")}}>
          Line
        </button>
        <button onClick={()=>{setTool("arrow")}}>
          Arrow
        </button>
        
      </div>
    </div>
  );
}
