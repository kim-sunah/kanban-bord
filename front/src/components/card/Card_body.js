import Modal from 'react-bootstrap/Modal'
import React, {useState, useEffect} from 'react'
import {server,Authorization} from '../../constant.js'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import CardForm from './Card_form'

const Cardbody = (props) => {
	const {cardSeq, name,color,description,deadline} = props.card
	const [show, setShow] = useState(false)
	const handleShow = () => setShow(true)
	const handleClose = () => setShow(false)
	const [showUpdate, setShowUpdate] = useState(false)
	const handleShowUpdate = () => setShowUpdate(true)
	const handleCloseUpdate = () => setShowUpdate(false)
	const [showCharge, setShowCharge] = useState(false)
	const handleShowCharge = () => setShowCharge(true)
	const handleCloseCharge = () => setShowCharge(false)
	const [showComment, setShowComment] = useState(false)
	const handleShowComment = () => setShowComment(true)
	const handleCloseComment = () => setShowComment(false)
	const [comments,setComments] = useState([])
	const [comment,setComment] = useState('')
	const [charges,setCharges] = useState([])
	
	const updateCard = async (e,body) => {
		e.preventDefault()
		await fetch(server+`/card/${cardSeq}`, {
			method: 'PATCH',
			headers:{'Content-Type':'application/json', Authorization},
			body: JSON.stringify(body)})
		handleClose()
		window.location.reload()
	}
	
	const createComment = async e => {
		e.preventDefault()
		const res = await fetch(server+`/comment/${cardSeq}`, {
			method:'post', 
			headers:{'Content-Type':'application/json', Authorization}, 
			body: JSON.stringify({body:comment})})
		const newComment = await res.json()
		setComments([...comments, newComment])
	}
	
	const deleteComment = async (e,commentSeq) => {
		e.preventDefault()
		const res = await fetch(server+`/comment/${commentSeq}`, {method:'delete', headers:{'Content-Type':'application/json', Authorization}})
		if(res.status!==204) return alert('권한이 없습니다.')
		setComments(comments.filter(comment => comment.commentSeq!==commentSeq))
	}
	
	const getComments = async () => {
		const res = await fetch(server+`/comment/${cardSeq}`, {headers:{'Content-Type':'application/json', Authorization}})
		const comments_ = await res.json()
		setComments(comments_)
	}
	
	useEffect(() => {
		getComments()
	},[comments.length])
	
	return ( 
		<div style={{textAlign:'center'}} className='mt-1'>
			<Button onClick={handleShow} className='me-1'>{name}</Button>
			<Button onClick={e => props.up(e,cardSeq)} className='me-1'> ↑</Button>
			<Button onClick={e => props.down(e,cardSeq)}>↓</Button>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header>
                    <Modal.Title>{name} ~{deadline.slice(0,10)}</Modal.Title>
                </Modal.Header>
				<Modal.Body>
					{description}
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={handleShowCharge}>작업자 목록</Button>
					<Button onClick={handleShowComment}>댓글</Button>
					<Button onClick={handleShowUpdate}>수정</Button>
					<Button onClick={e => props.deleteCard(e,cardSeq)}>삭제</Button>
					<Button onClick={handleClose}>닫기</Button>
				</Modal.Footer>
			</Modal>
			<Modal show={showUpdate} onHide={handleCloseUpdate}>
				<Modal.Header>
                    <Modal.Title>카드 수정</Modal.Title>
                </Modal.Header>
				<Modal.Body>
					<CardForm onSubmit={updateCard} handleClose={handleCloseUpdate} name={name} color={color} description={description} deadline={deadline} tag='수정' />
				</Modal.Body>
			</Modal>
			<Modal show={showCharge} onHide={handleCloseCharge}>
				<Modal.Header>
                    <Modal.Title>작업자 목록</Modal.Title>
                </Modal.Header>
				<Modal.Body>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={handleCloseCharge}>닫기</Button>
				</Modal.Footer>
			</Modal>
			<Modal show={showComment} onHide={handleCloseComment}>
				<Modal.Header>
                    <Modal.Title>댓글</Modal.Title>
                </Modal.Header>
				<Modal.Body>
					<Form onSubmit={createComment}>
						<Form.Group>
							<Form.Control required onChange={e => setComment(e.target.value)} />
						</Form.Group>
						<Button type='submit'>댓글 작성</Button>
					</Form>
					{comments.map(comment => {
						return (
							<div className='mt-1'>
								<p style={{display:'inline'}}>{comment.userSeq}: {comment.body}</p><Button onClick={e => deleteComment(e,comment.commentSeq)}>X</Button>
							</div>
						)})}
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={handleCloseComment}>닫기</Button>
				</Modal.Footer>
			</Modal>
		</div>
	)
}

export default Cardbody