import rough from "roughjs"


export default function drawShapes(ctx: CanvasRenderingContext2D) {
    const rc = rough.canvas(ctx.canvas)
    console.log("draw rectangle");
    rc.rectangle(200,200,200,200,{fill: "white"})
    console.log("draw rectangle done");
}