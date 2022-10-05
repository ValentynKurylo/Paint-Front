import React, {useRef, useState} from 'react';
import '../style/SettingBar.css'
import toolState from "../store/toolState";
import {Button, Modal} from "react-bootstrap";
import UserState from "../store/userState";
import {useParams} from "react-router-dom";
import axios from "axios";

const SettingBar = () => {

    let [sPicture, setSPicture] = useState(false)
    let [data, setData] = useState({})

    let nameRef = useRef()

    let params = useParams()

    function savePictureShow(e) {
        setSPicture(true)
    }

    function SavePicture(e) {
        e.preventDefault()

        setData(data.name = nameRef.current.value)
        setData(data.path = params.id)
        setData(data.user_id = UserState.CurrentUser.id)
        console.log(data)
        axios.post('http://localhost:5000/picture/', data).then(value => {
            console.log(value)
            alert('Your picture was added')
            setSPicture(false)
        })
    }

    return (
        <div className={"SettingBar"}>
            <label htmlFor={"line-width"}>Грубина лінії</label>
            <input type={"number"} id={"line-width"} defaultValue={1} min={1} max={100}
                   onChange={(e)=>{
                       toolState.setWidthLine(e.target.value)
                   }}
            />
            <label className={"Label-color"} htmlFor={"stroke-color"}>Колір:</label>
            <input onChange={e => toolState.setStrokeColor(e.target.value)} id={"stroke-color"} type={"color"}/>
            <div onClick={(e)=> savePictureShow(e)} className={"Save"}>Save</div>

            <Modal show={sPicture} onHide={() => {
                setSPicture(false)
            }}>
                <Modal.Header closeButton>
                    <Modal.Title><center>Saving</center></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={"EnterNamePicture"}>
                        <label>
                            Enter name of Picture:
                            <br/>
                            <input className={"InputName"} type={"text"} ref={nameRef}/>
                        </label>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={(e)=>SavePicture(e)} >
                        Save
                    </Button>
                </Modal.Footer>

            </Modal>
        </div>
    );
};

export default SettingBar;