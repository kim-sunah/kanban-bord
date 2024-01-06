import React, { useRef, useState } from "react";
import classes from "./Board_main.module.css"
import { BsClipboard2 } from "react-icons/bs";
import { AiOutlineUser } from "react-icons/ai";
import { AiOutlinePlus } from "react-icons/ai";
import { TbAlignBoxCenterStretch } from "react-icons/tb";
import { TbCalendar } from "react-icons/tb";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';
import Createboard from "./Create_board";
const Boardsidebar = () => {
    const inputref = useRef()
    const [show, setShow] = useState(false);
    const [create, setcreate] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const createshow = () => setcreate(!create)

    const submithandler = (event) =>{
        event.preventDefault()
        console.log(inputref.current.value)

    }
    return (
        <div className={classes.sidebar} style={{ width: "280px" }}>
            <ul className="nav nav-pills flex-column mb-auto" style={{ color: "white" }}>
                <li>
                    <BsClipboard2 size="30"></BsClipboard2>
                    <span className={classes.text}>Boards</span>
                </li>
                <li className={classes.li}>
                    <AiOutlineUser size="30" />
                    <span className={classes.text}>Members</span>
                    <AiOutlinePlus size="30" onClick={handleShow} style={{ cursor: "pointer" }} />
                </li>
                <li className={classes.li} >

                    Workspace views

                </li>
                <li>
                    <TbAlignBoxCenterStretch size="30" />
                    <span className={classes.text}>table</span>
                </li>
                <li >
                    <TbCalendar size="30" />
                    <span className={classes.text}>calendar</span>
                </li>
               


                <li className={classes.li} >
                    <span className={classes.text}  >your boards</span>
                    <AiOutlinePlus size="30" onClick={createshow}/>
                </li>
                
            </ul>
            {create && <Createboard click = {createshow}></Createboard>}
           

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>invite to Workspace</Modal.Title>
                </Modal.Header>
                <form onSubmit={submithandler}>
                    <InputGroup>
                        <Form.Control placeholder="Email address or name" aria-label="Dollar amount (with dot and two decimal places)" ref={inputref}/>
                    </InputGroup>
                </form>
            </Modal>
        </div>

    )
}
export default Boardsidebar