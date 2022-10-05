import logo from './logo.svg';
import './App.css';
import ToolBar from "./components/ToolBar";
import SettingBar from "./components/SettingBar";
import Canvas from "./components/Canvas";
import {BrowserRouter, Switch, Route, Router, Redirect} from "react-router-dom";


const socket = new WebSocket('ws://localhost:5000/')

function App() {
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

export default App;
