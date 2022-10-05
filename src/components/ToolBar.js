import React, {useState} from 'react';
import '../style/toolBar.css'
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import CanvasState from "../store/CanvasState";
import Rect from "../tools/Rect";
import Circle from "../tools/Circle";
import Line from "../tools/Line";
import Eraser from "../tools/Eraser";
import canvasState from "../store/CanvasState";

import {Button, Modal} from "react-bootstrap";
import UserState from "../store/userState";
import axios from "axios";
import {Link, Redirect} from "react-router-dom";
import {upload} from "@testing-library/user-event/dist/upload";


const ToolBar = () => {

    const [b, setB] = useState(false)
    const [myProfile, setMyProfile] = useState(false)
    const [MyFriends, setMyFriends] = useState(false)
    const [People, setPeople] = useState(false)
    const [showUser, setShowUser] = useState(false)
    const [butAddFriend, setButAddFriend] = useState(false)


    const changeColor = e => {
        toolState.setStrokeColor(e.target.value)
        toolState.setFillColor(e.target.value)
    }

    const download = ()=>{
        const data = canvasState.canvas.toDataURL()
        const a = document.createElement('a')
        a.href = data
        a.download = canvasState.sessionId + 'jpg'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    function userBut(e) {
        setB(true)
    }

    function Close(e) {
        setB(false)
    }

    function MyProfile(e) {
        axios.get('http://localhost:5000/picture/userId/' + UserState.CurrentUser.id).then(value => {

            UserState.setUserPicture(value.data)
            setB(false)
            setMyProfile(true)

        })



    }


    function PeopleShow(e) {
        setB(false)

        axios.get(`http://localhost:5000/users`).then(value => {
            UserState.setPeople(value.data)
            setPeople(true)
        })
    }

    function ShowUser(e, id) {
        setPeople(false)
        setMyFriends(false)

        axios.get(`http://localhost:5000/friends/ByUserId/` + UserState.CurrentUser.id).then(value => {
            UserState.setUserFriends(value.data)
            setButAddFriend(false)
            value.data.map(v => {
                if (v.id === id) {
                    UserState.setFriendId(v.fId)
                    setButAddFriend(true)
                }

            })
            axios.get(`http://localhost:5000/users/${id}`).then(value => {
                console.log(value.data)
                UserState.setShowUserState(value.data)
                setShowUser(true)
            })
        })




    }
    function MyFriendsFunc(e) {
        setB(false)
        console.log(UserState.CurrentUser.id)
        axios.get(`http://localhost:5000/friends/ByUserId/` + UserState.CurrentUser.id).then(value => {
            console.log(value.data)
            UserState.setUserFriends(value.data)
            setMyFriends(true)
        })

    }

    function addFriend(e, id) {
        let user = {
            userId: UserState.CurrentUser.id,
            friendId: id
        }
        axios.post(`http://localhost:5000/friends/`, user).then(value => {
            console.log(value)
            alert("You added new friend")
        })
    }

    function DeleteFriend(e) {

        axios.delete(`http://localhost:5000/friends/` + UserState.friendId).then(v=>{
            console.log(v)
            alert("Friend was deleted")
        })
    }


    function changePicture(e) {
        setMyProfile(false)
        console.log('-----')

        console.log('=======')
    }

    return (
        <div className={"ToolBar"}>
            <div className={"Left"}>
                <button className={"butBrush"} onClick={()=>{ toolState.setTool(new Brush(CanvasState.canvas, canvasState.socket, canvasState.sessionId))}}></button>
                <button className={"butRect"} onClick={()=>{ toolState.setTool(new Rect(CanvasState.canvas, canvasState.socket, canvasState.sessionId))}}></button>
                <button className={"butCircle"} onClick={()=>{toolState.setTool(new Circle(CanvasState.canvas, canvasState.socket, canvasState.sessionId))}}></button>
                <button className={"butLine"} onClick={()=>{toolState.setTool(new Line(CanvasState.canvas, canvasState.socket, canvasState.sessionId))}}></button>
                <button className={"butEraser"} onClick={()=>{toolState.setTool(new Eraser(CanvasState.canvas, canvasState.socket, canvasState.sessionId))}}></button>
            </div>
            <input onChange={e => changeColor(e)} className={"butColar"} type={"color"} />
            <div className={"Right"}>
                <button className={"butUndo"} onClick={()=>{canvasState.undo()}}></button>
                <button className={"butRedo"} onClick={()=>{canvasState.redo()}}></button>
                <button className={"butSave"} onClick={()=> download()}></button>
                <button className={"userBut"} onClick={(e)=>userBut(e)}></button>
            </div>
            <Modal show={b} onHide={() => {
                setB(false)
            }}>
                <Modal.Header closeButton>
                    <Modal.Title><center>User Page</center></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                   <button className={"but1"} onClick={(e)=>MyProfile(e)}>My Profile</button><br/>
                    <button className={"but1"} onClick={(e)=>MyFriendsFunc(e)}>My friends</button><br/>
                    <button className={"but1"} onClick={(e)=>PeopleShow(e)}>People</button>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={(e)=>Close(e)} >
                        Close
                    </Button>
                </Modal.Footer>

            </Modal>
            <Modal show={myProfile} onHide={() => {
                setMyProfile(false)
            }}>
                <Modal.Header closeButton>
                    <Modal.Title><center>My Profile</center></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        UserState.CurrentUser.username
                    }
                    <hr/>
                    <p>My Pictures</p>
                    {
                       UserState.userPicture ? UserState.userPicture.map(v => <div key={v.id} onClick={(e)=>{changePicture(e)}}>
                           <Link to={'/' + v.path}>{v.name}</Link></div>) : <div>User has no pictures</div>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={(e)=>setMyProfile(false)} >
                        Close
                    </Button>
                </Modal.Footer>

            </Modal>
            <Modal show={People} onHide={() => {
                setPeople(false)
            }}>
                <Modal.Header closeButton>
                    <Modal.Title><center>People</center></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={"peopleBox"}>{
                        UserState.people.map(value => <div key={value.id}
                                                           onClick={(e) => ShowUser(e, value.id)}>{value.username}
                            <hr/>
                        </div>)
                    }</div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={(e)=>setPeople(false)} >
                        Close
                    </Button>
                </Modal.Footer>

            </Modal>
            <Modal show={MyFriends} onHide={() => {
                setMyFriends(false)
            }}>
                <Modal.Header closeButton>
                    <Modal.Title><center>My Friends</center></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div >
                        {
                            UserState.userFriends.length ? <div>

                                {
                                    UserState.userFriends.map(value => <div key={value.id}
                                                                            onClick={(e) => ShowUser(e, value.id)}>{value.username}
                                        <hr/>
                                    </div>)
                                }

                            </div> : <div>You have had not friends yet</div>
                        }

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={(e)=>setMyFriends(false)} >
                        Close
                    </Button>
                </Modal.Footer>

            </Modal>
            <Modal show={showUser} onHide={() => {
                setShowUser(false)
            }}>
                <Modal.Header closeButton>
                    <Modal.Title><center></center></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        UserState.showUserState.username
                    }
                    <div>
                        {
                            UserState.showUserState.email
                        }

                    </div>
                    <hr/>
                    {
                        !butAddFriend ? <button className={"AddDelFriend"} onClick={(e)=>addFriend(e, UserState.showUserState.id)}>Add Friends</button> :
                            <button className={"AddDelFriend"} onClick={(e)=>DeleteFriend(e)}>Delete</button>
                    }

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={(e)=>setShowUser(false)} >
                        Close
                    </Button>
                </Modal.Footer>

            </Modal>
        </div>
    );
};

export default ToolBar;