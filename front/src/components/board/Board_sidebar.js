import React, { useEffect, useRef, useState } from "react";
import classes from "./Board_main.module.css"
import { CiUser } from "react-icons/ci";
import { BsClipboard2 } from "react-icons/bs";
import { AiOutlineUser } from "react-icons/ai";
import { AiOutlinePlus } from "react-icons/ai";
import { TbAlignBoxCenterStretch } from "react-icons/tb";
import { TbCalendar } from "react-icons/tb";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';
import Createboard from "./Create_board";
import { Link, useParams, useNavigate } from "react-router-dom"
import { BsPersonCheckFill } from "react-icons/bs";
import { BsPersonFillX } from "react-icons/bs";
import { BsTrash } from "react-icons/bs";
import { CiLogout } from "react-icons/ci";
const Boardsidebar = () => {
    const inputref = useRef()
    const [show, setShow] = useState(false);
    const [membershow, setmembershow] = useState(false);
    const [create, setcreate] = useState(false);
    const [title, settitle] = useState([])
    const [invite, setinvite] = useState()
    const { id } = useParams()
    const navigate = useNavigate()

    const handleClose = () => {
        setShow(false);
        setinvite("")
    };
    const memberClose = () => {
        setmembershow(false);
        setinvite("")
    };
    const handleShow = () => setShow(true);
    const membershows = () => setmembershow(true);
    const createshow = () => setcreate(!create)

    const submithandler = (event) => {
        event.preventDefault()

        fetch(`http://localhost:4000/board/${id}/invite`, { method: "Post", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${sessionStorage.getItem("access_token")}` }, body: JSON.stringify({ email: inputref.current.value }) })
            .then(res => res.json()).then(resData => { setinvite(resData); console.log(resData) }).catch(err => console.log(err))
    }

    const deletehandler = (deleteid) => {
        fetch(`http://localhost:4000/board/${deleteid}`, { method: "Delete", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${sessionStorage.getItem("access_token")}` } })
            .then(res => res.json()).then(resData => { alert("삭제에 성공했습니다.")  }).catch(err => console.log(err))
   


    }
    const logOut = () => {
        window.sessionStorage.removeItem("access_token");
        return navigate('/')
    }

    useEffect(() => {
        fetch("http://localhost:4000/user", { method: "GET", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${sessionStorage.getItem("access_token")}` } })
            .then(res => {
                if (res.status == 200) {
                    fetch("http://localhost:4000/board", { method: "GET", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${sessionStorage.getItem("access_token")}` } })
                        .then(res => res.json())
                        .then(resData => {
                            console.log(resData)
                            if (resData.statusCode === 200) {
                                settitle(resData.board)
                                fetch(`http://localhost:4000/board/${id}/invite`,{ method: "GET", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${sessionStorage.getItem("access_token")}`} })
                                .then(res => res.json())
                                .then(resData => console.log(resData))
                                .catch(err => console.log(err))
                            }
                        }).catch(err => console.log(err))
                } else {
                    alert('로그인이 필요합니다')
                    return navigate('/')
                }

            }).catch(err => {
                console.log(err);
            })
    }, [])
    return (
        <div className={classes.sidebar} style={{ width: "280px", height: "100%" }}>
            <ul className="nav nav-pills flex-column mb-auto" style={{ color: "white" }}>
                <li>
                    <CiUser size="30"></CiUser>
                    <span className={classes.text}>Log Out</span>
                    <CiLogout onClick={() => logOut()} style={{ cursor: "pointer" }} />
                </li>
                <li className={classes.li}>
                    <BsClipboard2 size="30"></BsClipboard2>
                    <span className={classes.text}>Boards</span>
                </li>
                <li className={classes.li}>
                    <AiOutlineUser size="30" />
                    <span className={classes.text} onClick={membershows} style={{cursor :"pointer"}}>Members</span>
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
                {create && <Createboard click={createshow}></Createboard>}
                <div>
                    {title && title.map(title => (
                        <li key={title.id}>
                            <Link to={`${title.id}/${title.name}`} className={classes.Link} style={{ textDecoration: 'none', color: "white", marginRight: "50%" }} >
                                {title.name}
                            </Link>
                            <BsTrash onClick={() => deletehandler(title.id)} style={{ cursor: "pointer" }} />
                        </li>
                    ))}
                </div>

            </ul>



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


            
            <Modal show={membershow} onHide={memberClose}>
                <Modal.Header closeButton>
                    <Modal.Title>invite user</Modal.Title>
                </Modal.Header>
            </Modal>
        </div>

    )
}
export default Boardsidebar