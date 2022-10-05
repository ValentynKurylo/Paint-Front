
import Brush from "./Brush";

export default class Eraser extends Brush{
    constructor(canvas, socket, id) {
        super(canvas, socket, id);
        this.listen()
    }

    mouseMoveHandler(e){
        if(this.mouseDown){
            //this.draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
            // console.log(e.pageX , e.target.offsetLeft, e.pageY , e.target.offsetTop)
            this.socket.send(JSON.stringify({
                method: "draw",
                id: this.id,
                figure: {
                    type: "eraser",
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop,
                    lineWidth: this.ctx.lineWidth
                }
            }))

        }
    }

    static draw(ctx, x, y, width){
        ctx.lineTo(x, y)
        ctx.stroke();
        ctx.strokeStyle = "white"
        ctx.lineWidth = width
    }
}