import Cardbody from './Card_body'
import React, {useState,useEffect} from 'react'
import {server,Authorization} from '../../constant.js'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import CardForm from './Card_form'

const ColumnTemp = (props) => {
	const [cards,setCards] = useState([])
	const [show, setShow] = useState(false)
	const getCards = async () => {
		const res = await fetch(server+`/card/column/${props.columnSeq}`, {headers:{'Content-Type':'application/json', Authorization}})
		const cards_ = await res.json()
		setCards(cards_)
	}

	useEffect(() => {
		getCards()
	},[cards.length])
	
	const handleShow = () => setShow(true)
	const handleClose = () => setShow(false)
	
	const createCard = async (e,body) => {
		e.preventDefault()
		const res = await fetch(server+`/card/column/${props.columnSeq}`, {
			method: 'post',
			headers:{'Content-Type':'application/json', Authorization},
			body: JSON.stringify(body)})
		const newCard = await res.json()
		setCards([...cards, newCard])
		alert('카드를 생성했습니다.')
		handleClose()
	}
	
	const deleteCard = async (e,cardSeq) => {
		e.preventDefault()
		await fetch(server+`/card/${cardSeq}`, {
			method: 'delete',
			headers:{'Content-Type':'application/json', Authorization}})
		setCards(cards.filter(card => card.cardSeq!==cardSeq))
	}
	
	const up = async (e,cardSeq) => {
		e.preventDefault()
		await fetch(server+`/card/${cardSeq}/up`, {
			method: 'PATCH',
			headers:{'Content-Type':'application/json', Authorization}})
		const ind = cards.findIndex(card => card.cardSeq===cardSeq)
		if(ind) setCards(cards.map((card,i) => {
			if(i==ind) return cards[i-1]
			else if(i==ind-1) return cards[i+1]
			return card
		}))
	}
	
	const down = async (e,cardSeq) => {
		e.preventDefault()
		await fetch(server+`/card/${cardSeq}/down`, {
			method: 'PATCH',
			headers:{'Content-Type':'application/json', Authorization}})
		const ind = cards.findIndex(card => card.cardSeq===cardSeq)
		if(ind<cards.length-1) setCards(cards.map((card,i) => {
			if(i==ind) return cards[i+1]
			else if(i==ind+1) return cards[i-1]
			return card
		}))
	}
	
	return (
		<div style={{textAlign:'center'}}>
			<p>{props.name}</p>
			<Button onClick={handleShow}>카드 추가하기</Button>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header>
                    <Modal.Title>새 카드 만들기</Modal.Title>
                </Modal.Header>
				<Modal.Body>
					<CardForm onSubmit={createCard} handleClose={handleClose} />
				</Modal.Body>
			</Modal>
			{cards.map(card => <Cardbody key={card.cardSeq} card={card} deleteCard={deleteCard} up={up} down={down} />)}
		</div>	
	)
}

export default ColumnTemp