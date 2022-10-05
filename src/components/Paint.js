import {BrowserRouter, Switch, Route, Router, Redirect, Link} from "react-router-dom";
import ToolBar from "./ToolBar";
import SettingBar from "./SettingBar";
import Canvas from "./Canvas";
import User from "./User";


const socket = new WebSocket('ws://localhost:5000/')

function Paint() {
    socket.onopen = ()=>{
        console.log("Connected front message")
    }

    socket.onmessage =(event)=>{
        console.log('You got message from server', event.data)
    }


    return (
        <BrowserRouter>
            <div className="App">
                <Switch>
                    <Route path={'/:id'}>
                        <ToolBar/>
                        <SettingBar/>
                        <Canvas/>
                    </Route>
                    <Redirect to={`f${(+new Date()).toString(16)}`}/>
                </Switch>

            </div>
        </BrowserRouter>
    );
}

export default Paint;