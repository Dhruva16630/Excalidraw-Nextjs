

export type Tool = "rectangle" | "circle" | "diamond" | "line" | "arrow" | "pencil" | "text" | null;

export interface Shapes {
  tool: Tool;
  startX: number;
  startY: number;
  endX?: number;
  endY?: number;
  path?: Path2D;
  points?: { x:number , y:number }[];
  text?: string;
}

