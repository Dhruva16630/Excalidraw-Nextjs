import React from "react";
import Buttons from "./Buttons";
import { Tool } from "../Canvas/types";

interface ToolBarProps {
  tool: Tool;
  setTool: (tool: Tool) => void;
}

const ToolBar: React.FC<ToolBarProps> = ({ tool, setTool }) => {
  const tools: { key: Tool; icon: string; label: string, num?:number }[] = [
    { key: "grab", icon: "ri-hand", label: "Hand (panning-tool)" },
    { num:1, key: "rectangle", icon: "ri-rectangle-line", label: "Rectangle" },
    { num:2, key: "diamond", icon: "ri-poker-diamonds-line", label: "Diamond" },
    { num:3, key: "circle", icon: "ri-circle-line", label: "Circle" },
    { num:4, key: "arrow", icon: "ri-arrow-right-line", label: "Arrow" },
    { num:5, key: "line", icon: "ri-subtract-line", label: "Line" },
    { num:6, key: "pencil", icon: "ri-pencil-line", label: "Pencil" },
    { num:7, key: "text", icon: "ri-anthropic-line", label: "Text" },
    { num:0, key: "eraser", icon: "ri-eraser-line", label: "Eraser" },
  ];

  return (
    <div className="gap-1 p-1 md:gap-1.5 md:p-0.75 lg:gap-2 lg:p-1 2xl:gap-2.5 2xl:p-1.5 rounded-lg bg-[#232329] flex ">
{tools.map(({ key, icon, num, label }) => (
  <div key={key} className="relative group">
    <Buttons
      onClick={() => setTool(key)}
      icon={<i className={`${icon}  text-[15px]  md:text-lg 2xl:text-xl `} />}
      num={num}
      className={`px-1.5 py-1 md:px-2.25 md:py-1.25 lg:px-2.5 lg:py-1.5 2xl:px-3 2xl:py-2 rounded-lg transition ${
        tool === key
          ? "bg-[#403e6a] text-gray-300"
          : "text-gray-300 hover:bg-[#3b3c41] "
      } `}
    />
    <span className="absolute top-full mt-1 hidden group-hover:block whitespace-nowrap text-xs border-1 border-white bg-[#3b3c41] text-white px-2 py-1">
      {label}
    </span>
  </div>
))}
      
    </div>
  );
};

export default ToolBar;
