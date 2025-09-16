

export type Tool = "rectangle" | "circle" | "diamond" | "line" | "arrow" | "pencil" | "text" |"eraser"|"grab" | null;

export interface Shapes {
  id:number;
  tool: Tool;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  path?: Path2D;
  points?: { x:number , y:number }[];
  text?: string;
  
}

