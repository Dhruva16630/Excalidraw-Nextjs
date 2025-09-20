"use client";

import { useEffect, useRef, useState } from "react";
import { CanvasLogic } from "./CanvasLogic";
import { Tool } from "./types";
import ToolBar from "../components/ToolBar";
import ZoomToolbar from "../components/ZoomToolbar";
import Menu from "../components/Menu";
import { MainMenuWelcome } from "../components/Welcome-screen";
import { ToolMenuWelcome } from "../components/Welcome-screen";
import { ZoomMenuWelcome } from "../components/Welcome-screen";
import { HomeWelcome } from "../components/Welcome-screen";

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
      <div className="fixed top-3 w-full flex justify-center">
      <ToolBar tool={tool} setTool={setTool} />
     </div>
      <div className="fixed bottom-3 left-4">
        <ZoomToolbar 
         zoomPercentage={zoomPercentage}
          onZoomIn={() => engine?.zoomAtCenter(1.1)}
          onZoomOut={() => engine?.zoomAtCenter(0.9)}
          onResetZoom={() => engine?.resetZoom()}
        />
        
      </div>
      <div className="fixed top-3 left-4">
        <Menu/>
      </div>
      {engine?.saveShapesToLocalStorage  && <HomeWelcome />}
      {engine?.saveShapesToLocalStorage  && <MainMenuWelcome />}
      {engine?.saveShapesToLocalStorage && <ToolMenuWelcome />}
      {engine?.saveShapesToLocalStorage && <ZoomMenuWelcome />}
    </div>
  );
}
