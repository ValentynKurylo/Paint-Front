
import {BrowserRouter, Switch, Route, Router, Redirect, Link} from "react-router-dom";
import ToolBar from "./ToolBar";
import SettingBar from "./SettingBar";
import Canvas from "./Canvas";
import User from "./User";
import Paint from "./Paint";


const socket = new WebSocket('ws://localhost:5000/')

function MainPage() {
    socket.onopen = ()=>{
        console.log("Connected front message")
    }

    socket.onmessage =(event)=>{
        console.log('You got message from server', event.data)
    }


    return (
        <div className="App">
            <BrowserRouter>
                <Link to={"/reg"}>REgggg</Link><br/>
                <Link to={"/re"}>R</Link>
                <br/>
                <Link to={"/paint"}>Paint</Link>
                <Switch>

                </Switch>
            </BrowserRouter>
        </div>

    );
}

export default MainPage;