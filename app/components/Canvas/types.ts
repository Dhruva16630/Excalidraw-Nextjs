// export type Shapes = 
//     | { type: "rectangle"; x: number; y: number; width: number; height: number }
//     | { type: "circle"; x: number; y: number; radius: number }
//     | { type: "diamond"; x: number; y: number; width: number; height: number }
//     | { type: "line"; x1: number; y1: number; x2: number; y2: number }
//     | { type: "arrow"; x1: number; y1: number; x2: number; y2: number };


export type Tool = "rectangle" | "circle" | "diamond" | "line" | "arrow" | null;

export interface Shapes {
  tool: Tool;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  path?: Path2D
}

