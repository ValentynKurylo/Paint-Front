import React, {useEffect, useRef, useState} from 'react';
import '../style/Canvas.css'
import {observer} from "mobx-react-lite";
import canvasState from "../store/CanvasState";
import ToolState from "../store/toolState";
import UserState from "../store/userState";
import Brush from "../tools/Brush";
import {Button, Modal} from "react-bootstrap";
import {Link, useParams} from "react-router-dom";
import Rect from "../tools/Rect";
import Circle from "../tools/Circle";
import Line from "../tools/Line";
import Eraser from "../tools/Eraser";
import axios from "axios";


const Canvas = observer(() => {

    const canvasRef = useRef()
    let emailRef = useRef()
    let passwordRef = useRef()
    const usernameRef = useRef()
    const email1Ref = useRef()
    const password1Ref = useRef()
    const params = useParams()

    const [user, setUser] = useState({})
    const [userRegister, setUserRegister] = useState({})

    const [modal, setModal] = useState(true);
    const [modalRegistr, setModalRegistr] = useState(false);

    useEffect(()=>{
      //console.log(canvasRef.current)
        canvasState.setCanvas(canvasRef.current)
        let ctx = canvasRef.current.getContext('2d')
        axios.get(`http://localhost:5000/image?id=${params.id}`) .then(response => {
            const img = new Image()
            img.src = response.data
            img.onload = () => {
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
                ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
            }
        })
    }, [])

    useEffect(()=>{
        if (canvasState.username) {
            const socket = new WebSocket('ws://localhost:5000')
            canvasState.setSocket(socket)
            canvasState.setSessionId(params.id)
            ToolState.setTool(new Brush(canvasRef.current, socket, params.id))
            socket.onopen = () => {
                socket.send(JSON.stringify({
                    id: params.id,
                    username: canvasState.username,
                    method: "connection"
                }))
            }
            socket.onmessage = (event) => {

                let msg = JSON.parse(event.data)
                //console.log(msg, typeof(msg))
                switch (msg.method) {
                    case "connection":
                        //console.log(event.data)
                        console.log(`User ${msg.username} was connected`)
                        break
                    case "draw":
                        drawHandler(msg)
                        break

                }
            }
        }
    }, [canvasState.username])

    const drawHandler=(msg)=>{
       let figure = msg.figure;
       let ctx = canvasRef.current.getContext('2d')
        axios.post(`http://localhost:5000/image?id=${params.id}`, {img: canvasRef.current.toDataURL(), userId: UserState.CurrentUser.id}).then(
            value => {
                console.log(value);}
        )
        switch (figure.type){
            case "brush":
                Brush.draw(ctx, figure.x, figure.y, figure.color, figure.lineWidth)
                break
            case "rect":
                Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color, figure.strokeStyle, figure.lineWidth)
                break
            case "circle":
                Circle.drawStatic(ctx, figure.x, figure.y, figure.radius, figure.strokeStyle, figure.color, figure.lineWidth)
                break
            case "line":
                Line.drawStatic(ctx, figure.currentX, figure.currentY, figure.x, figure.y, figure.strokeStyle, figure.lineWidth)
                break
            case "eraser":
                Eraser.draw(ctx, figure.x, figure.y, figure.lineWidth)
                break
            case "undo":
                canvasState.undoS(ctx, figure.img, figure.w, figure.h, figure.undoList)
                break
            case "redo":
                canvasState.redoS(ctx, figure.img, figure.w, figure.h, figure.redoList)
                break
            case "finish":
                ctx.beginPath();
                break
        }
    }

    const MouseDownHandler = () =>{
        canvasState.pushToUndo(canvasRef.current.toDataURL())

    }


    const login = (e, b)=> {
        e.preventDefault()
        console.log("login ")
        if(!b) {
            console.log("login1")
            setUser(user.email = emailRef.current.value)
            setUser(user.password = passwordRef.current.value)
        }
        console.log(user)
        axios.post('http://localhost:5000/auth/login', user).then(value=>{
            console.log(value.data.accessToken)
            UserState.setToken(value.data.accessToken)
            axios.get(`http://localhost:5000/users/ByEmail/` + user.email).then(value=>{
                console.log(value.data)
                UserState.setCurrentUser(value.data)
                canvasState.setUsername(value.data.username)
            })
        })

        setModal(false)
    }

    function registerShow(e) {
        e.preventDefault()
        setModal(false)
        setModalRegistr(true)
    }

    function registr(e) {
        e.preventDefault()
        setUserRegister(userRegister.username = usernameRef.current.value)
        setUserRegister(userRegister.email = email1Ref.current.value)
        setUserRegister(userRegister.password = password1Ref.current.value)
        axios.post(`http://localhost:5000/users/`, userRegister).then(value=>{
            console.log(value);
            setUser(user.email = userRegister.email)
            setUser(user.password = userRegister.password)
            login(e, 1)
        })
        setModalRegistr(false)
    }

    return (
        <div className={"Canvas"}>
            <Modal show={modal} onHide={() => {
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body><label htmlFor={"name"}>Enter your email: </label><br/>
                    <input id={"name"} type={"text"} className={"input"} ref={emailRef}/><br/>
                    <label htmlFor={"password"}>Enter your password: </label><br/>
                    <input id={"password"} type={"password"} className={"input"} ref={passwordRef}/><br/>
                    <div className={"MinBox"}>
                        <p>If you are not registred</p>
                        <button className={"but"} type={"password"} onClick={(e)=>registerShow(e)}>register</button>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={(e) => login(e, 0)}>
                        Enter
                    </Button>
                </Modal.Footer>

            </Modal>


            <Modal show={modalRegistr} onHide={() => {
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>Registration</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label htmlFor={"username"}>Enter your username: </label><br/>
                    <input id={"username"} type={"text"} className={"input"} ref={usernameRef}/><br/>
                    <label htmlFor={"name"}>Enter your email: </label><br/>
                    <input id={"name"} type={"text"} className={"input"} ref={email1Ref}/><br/>
                    <label htmlFor={"password"}>Enter your password: </label><br/>
                    <input id={"password"} type={"password"} className={"input"} ref={password1Ref}/><br/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={(e) => registr(e)}>
                        Enter
                    </Button>
                </Modal.Footer>

            </Modal>
                <canvas ref={canvasRef} width={800} height={550} className={'n'} onMouseDown={() => MouseDownHandler()}>
                </canvas>
        </div>

);
});

export default Canvas;