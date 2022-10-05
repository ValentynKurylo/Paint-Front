import Tool from "./Tool";

export default class Circle extends Tool{
    constructor(canvas, socket, id) {
        super(canvas, socket, id);
        this.listen()
    }

    listen(){
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
        this.canvas.onmouseup = this.mouseUpHandler.bind(this);
        this.canvas.onmousedown = this.mouseDownHandler.bind(this);
    }

    mouseUpHandler(e){
        this.mouseDown = false
        this.socket.send(JSON.stringify({
            method: "draw",
            id: this.id,
            figure: {
                type: "circle",
                x: this.startX,
                y: this.startY,
                radius: Math.sqrt(this.width**2 + this.height**2),
                color: this.ctx.fillStyle,
                strokeStyle: this.ctx.strokeStyle,
                lineWidth: this.ctx.lineWidth
            }
        }))
    }
    mouseDownHandler(e){
        this.mouseDown = true
        this.ctx.beginPath()
        this.startX = e.pageX - e.target.offsetLeft;
        this.startY = e.pageY - e.target.offsetTop;
        //console.log(e.pageX, e.target.offsetLeft, e.pageY, e.target.offsetTop)
        this.saved = this.canvas.toDataURL()

    }
    mouseMoveHandler(e){
        if(this.mouseDown){
            let currentX = e.pageX - e.target.offsetLeft;
            let currentY = e.pageY - e.target.offsetTop;
            this.width = currentX - this.startX;
            this.height = currentY - this.startY;
            let r = Math.sqrt(this.width**2 + this.height**2)
            this.draw(this.startX, this.startY, r)
        }
    }
    draw(x, y, r){
        const img = new Image()
        img.src = this.saved
        img.onload = ()=>{
            this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            this.ctx.arc(x, y, r, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.stroke();
        }
    }

    static drawStatic(ctx, x, y, r, strokeColor, fillColor, width) {
        ctx.fillStyle = fillColor
        ctx.strokeStyle = strokeColor
        ctx.lineWidth = width
        ctx.beginPath()
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fill()
        ctx.stroke()

    }
}