import Cardbody from './Card_body'
import React, {useState,useEffect} from 'react'
import {server,Authorization} from '../../constant.js'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import CardForm from './Card_form'

const ColumnTemp = (props) => {
	const [cards,setCards] = useState(window.sessionStorage.getItem('cards') || [])
	const [show, setShow] = useState(false)
	const getCards = async () => {
		const res = await fetch(server+`/card/column/${props.columnSeq}`, {headers:{'Content-Type':'application/json', Authorization}})
		const rawCards = await res.json()
		setCards(rawCards.map(card => <Cardbody key={card.cardSeq} card={card} />))
	}
	useEffect(() => {
		getCards()
		window.sessionStorage.setItem('cards',cards)
	},[])
	
	const handleShow = () => setShow(true)
	const handleClose = () => setShow(false)
	const createCard = async (e,body) => {
		e.preventDefault()
		await fetch(server+`/card/column/${props.columnSeq}`, {
			method: 'post',
			headers:{'Content-Type':'application/json', Authorization},
			body: JSON.stringify(body)})
		handleClose()
	}
	
	return (
		<div style={{textAlign:'center'}}>
			<Button onClick={handleShow}>카드 추가하기</Button>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header>
                    <Modal.Title>새 카드 만들기</Modal.Title>
                </Modal.Header>
				<Modal.Body>
					<CardForm onSubmit={createCard} handleClose={handleClose} />
				</Modal.Body>
			</Modal>
			{cards}
		</div>	
	)
}

export default ColumnTemp