import Modal from 'react-bootstrap/Modal'
import React, {useState} from 'react'
import {server,Authorization} from '../../constant.js'
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
	
	// 왜 안될까...
	const updateCard = async (e,body) => {
		e.preventDefault()
		await fetch(server+`/card/${cardSeq}`, {
			method: 'patch',
			headers:{'Content-Type':'application/json', Authorization},
			body: JSON.stringify(body)})
		handleClose()
	}
	
	const deleteCard = async (e,body) => {
		e.preventDefault()
		await fetch(server+`/card/${cardSeq}`, {
			method: 'delete',
			headers:{'Content-Type':'application/json', Authorization}})
		handleClose()
	}
	
	return ( 
		<div style={{textAlign:'center'}}>
			<Button onClick={handleShow} className='mt-1'>{name}</Button>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header>
                    <Modal.Title>{name}</Modal.Title>
                </Modal.Header>
				<Modal.Body>
					{description}
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={handleShowUpdate}>수정</Button>
					<Button onClick={deleteCard}>삭제</Button>
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
		</div>
	)
}

export default Cardbody