import {makeAutoObservable} from "mobx";

class CanvasState{
    canvas = null
    undoList = []
    redoList = []
    username = ""
    sessionId = null
    socket = null
    constructor() {
        makeAutoObservable(this)
    }

    setCanvas(canvas){
        this.canvas = canvas;
    }

    setSessionId(id){
        this.sessionId = id
    }

    setSocket(socket){
        this.socket= socket
    }
    setUsername(username){
        this.username = username
    }

    pushToUndo(data){
        this.undoList.push(data)
    }

    pushToRedo(data){
        this.redoList.push(data)
    }

    undo(){
        let ctx = this.canvas.getContext('2d')
        if(this.undoList.length > 0){
            this.dataUrl = this.undoList.pop()
            this.redoList.push(this.canvas.toDataURL())
            this.img = new Image()
            this.img.src = this.dataUrl
            this.img.onload = ()=>{
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                ctx.drawImage(this.img,0, 0, this.canvas.width, this.canvas.height)
            }

        }
        else {
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        }
        this.socket.send(JSON.stringify({
            method: "draw",
            id: this.sessionId,
            figure: {
                type: "undo",
                img: this.dataUrl,
                w: this.canvas.width,
                h: this.canvas.height,
                undoList: this.undoList
            }
        }))

    }

    undoS(ctx, img, w, h, undoList){
        if(undoList.length > 0){
            console.log('uuuuuuuu')
            let img1 = new Image()
            img1.src = img
            img1.onload = ()=>{
                ctx.clearRect(0, 0, w, h)
                ctx.drawImage(img1,0, 0, w, h)
            }
        }
        else {
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        }

    }

    redo(){
        let ctx = this.canvas.getContext('2d')
        if(this.redoList.length > 0){
            this.dataUrl = this.redoList.pop()
            this.undoList.push(this.canvas.toDataURL())
            let img = new Image()
            img.src = this.dataUrl
            img.onload = ()=>{
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                ctx.drawImage(img,0, 0, this.canvas.width, this.canvas.height)
            }
            this.socket.send(JSON.stringify({
                method: "draw",
                id: this.sessionId,
                figure: {
                    type: "redo",
                    img: this.dataUrl,
                    w: this.canvas.width,
                    h: this.canvas.height,
                    redoList: this.redoList
                }
            }))
        }

    }

    redoS(ctx,img,  w, h, redoList){
        //console.log('r')
        redoList.push(img)
        if(redoList.length > 0){
            //console.log(redoList)
            let data = redoList.pop()
            let img1 = new Image()
            img1.src = data
            img1.onload = ()=>{
                ctx.clearRect(0, 0, w, h)
                ctx.drawImage(img1,0, 0, w, h)
            }
        }

    }

}
export default new CanvasState();