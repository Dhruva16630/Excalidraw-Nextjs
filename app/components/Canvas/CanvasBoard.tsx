"use client";

import { useEffect,useRef } from "react";
import drawShapes from "../Shapes/drawShapes";


export default function CanvasBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;  
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
  })

  return(
    <>
      <canvas ref={canvasRef} className="top-o left-0 w-screen h-screen bg-[#121212]"/>
      <div className="absolute top-8 left-96 gap-2 rounded-2xl bg-white flex p-2">
      <button onClick={() =>drawShapes}>Rect</button>
      <button>Circle</button>
      <button>Line</button>
      <button>Arrow</button>
      <button>Text</button> 
      <button>Diamond</button>
      </div>
      
    </>
   
    
  )
}
