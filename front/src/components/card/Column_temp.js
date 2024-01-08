import Cardbody from './Card_body'
import React, {useState,useEffect} from 'react'
import {server,Authorization} from '../../constant.js'
import Button from 'react-bootstrap/Button'

const ColumnTemp = (props) => {
	const [cards,setCards] = useState([])
	
	useEffect(() => {
		const getCards = async () => {
			const res = await fetch(server+`/card/column/${props.columnSeq}`, {headers:{'Content-Type':'application/json', Authorization}})
			const rawCards = await res.json()
			setCards(rawCards.map(card => <Cardbody card={card} />))
		}
		getCards()
	},[])
	
	const createCard = async() => {
		alert('Hello')
	}
	
	return (
		<div>
			<Button onClick={createCard}>카드 추가하기</Button>
			{cards}
		</div>	
	)
}

export default ColumnTemp