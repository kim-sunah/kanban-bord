import React, { useEffect, useRef, useState } from "react";
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
import { Link } from "react-router-dom"
import { useParams } from "react-router-dom";
import { BsPersonCheckFill } from "react-icons/bs";
import { BsPersonFillX } from "react-icons/bs";
const Boardsidebar = () => {
    const inputref = useRef()
    const [show, setShow] = useState(false);
    const [create, setcreate] = useState(false);
    const [title, settitle] = useState([])
    const [invite, setinvite] = useState()
    const { id } = useParams()


    const handleClose = () => {
        setShow(false);
        setinvite("")
    };
    const handleShow = () => setShow(true);
    const createshow = () => setcreate(!create)

    const submithandler = (event) => {
        event.preventDefault()
        console.log(inputref.current.value)
        console.log(id)
        fetch(`http://54.180.109.210/board/${id}/invite`, { method: "Post", headers: { "Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNobHhvZHVkMDRAbmF2ZXIuY29tIiwic3ViIjozLCJpYXQiOjE3MDQ2MjMyMTF9.V-lfby5HCDBl9BBK7rgHwRqDE-nh46HQ8G4RRebfS7Y" }, body: JSON.stringify({ email: inputref.current.value }) })
            .then(res => res.json()).then(resData => { setinvite(resData); console.log(resData) }).catch(err => console.log(err))
    }

    useEffect(() => {
        fetch("http://54.180.109.210/board", { method: "GET", headers: { "Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNobHhvZHVkMDRAbmF2ZXIuY29tIiwic3ViIjozLCJpYXQiOjE3MDQ2MjMyMTF9.V-lfby5HCDBl9BBK7rgHwRqDE-nh46HQ8G4RRebfS7Y" } })
            .then(res => res.json())
            .then(resData => {
                if (resData.statusCode === 200) {
                    settitle(resData.board)
                }
            }).catch(err => console.log(err))

    }, [])
    return (
        <div className={classes.sidebar} style={{ width: "280px", height: "100%" }}>
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
                    <AiOutlinePlus size="30" onClick={createshow} />
                </li>
                <div>
                    {title && title.map(title => (
                        <li key={title.id}>
                            <Link to={`${title.id}/${title.name}`} classname={classes.Link} style={{ textDecoration: 'none', color: "white" }} >
                                {title.name}

                            </Link>
                        </li>
                    ))}
                </div>

            </ul>
            {create && <Createboard click={createshow}></Createboard>}


            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>invite to Workspace</Modal.Title>
                </Modal.Header>
                <form onSubmit={submithandler}>
                    <InputGroup>
                        <Form.Control placeholder="Email address or name" aria-label="Dollar amount (with dot and two decimal places)" ref={inputref} />
                    </InputGroup>
                </form>
                {invite && invite.statusCode === 200 && <h3 style={{ textAlign: "center" }}> <BsPersonCheckFill></BsPersonCheckFill>초대하는데 성공했습니다 </h3>}
                {invite && invite.statusCode !== 200 && <h3 style={{ textAlign: "center" }}> <BsPersonFillX> </BsPersonFillX>{invite.message}</h3>}
            </Modal>
        </div>

    )
}
export default Boardsidebar