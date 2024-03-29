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
    const [inviteuser, setinviteuser] = useState()
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
    const membershows = () => {
        setmembershow(true)
        if (id) {
            fetch(`http://localhost:4000/board/${id}`, { method: "GET", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${sessionStorage.getItem("access_token")}` } })
                .then(res => res.json())
                .then(resData => setinviteuser(resData))
                .catch(err => console.log(err))
        }
    };
    const createshow = () => setcreate(!create)

    const submithandler = (event) => {
        event.preventDefault()
        fetch(`http://localhost:4000/board/${id}/invite`, { method: "Post", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${sessionStorage.getItem("access_token")}` }, body: JSON.stringify({ email: inputref.current.value }) })
            .then(res => res.json()).then(resData => { setinvite(resData); console.log(resData) }).catch(err => console.log(err))
    }

    const deletehandler = (deleteid) => {
        console.log(deleteid)
        fetch(`http://localhost:4000/board/${deleteid}`, { method: "Delete", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${sessionStorage.getItem("access_token")}` } })
            .then(res => res.json()).then(resData => { if(resData.statusCode === 200){alert("삭제에 성공했습니다.")} else{
                alert("삭제권한이 없습니다.")
            }}).catch(err => console.log(err))

    }
    const logOut = () => {
        window.sessionStorage.removeItem("access_token");
        return navigate('/')
    }

    const inviteDeleteuser = (email) =>{
       
        fetch(`http://localhost:4000/board/${id}/invite`,{method : "DELETE" , headers: { "Content-Type": "application/json", "Authorization": `Bearer ${sessionStorage.getItem("access_token")}`} , body : JSON.stringify({email})})
        .then(res=>res.json()).then(resData => console.log(resData)).catch(err => console.log(err))

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
                                console.log(resData)
                                settitle(resData.result)
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
                    <AiOutlineUser size="30" />
                    <span className={classes.text} onClick={membershows} style={{ cursor: "pointer" }}>Members</span>
                    <AiOutlinePlus size="30" onClick={handleShow} style={{ cursor: "pointer" }} />
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
                {inviteuser && inviteuser.map(user => (
                    <li className={classes.inviteuser}>{user.email}<BsTrash style={{marginLeft:"10%"}} onClick={() => inviteDeleteuser(user.email)}></BsTrash></li>
                ))}
                 
            </Modal>
        </div>

    )
}
export default Boardsidebar