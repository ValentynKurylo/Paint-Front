import {makeAutoObservable} from "mobx";
import Tool from "../tools/Tool";

class ToolState{
    tool = null
    constructor() {
        makeAutoObservable(this)
    }
    setTool(t){
        this.tool = t;
    }

    setFillColor(color){
        this.tool.fillColor = color
    }

    setStrokeColor(color){
        this.tool.strokeColor = color
    }

    setWidthLine(width){
        this.tool.widthLine = width
    }

}

export default new ToolState();