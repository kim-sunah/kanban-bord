import React, {useState,useEffect} from 'react'

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useParams, useNavigate } from 'react-router-dom'
import {server} from '../../constant.js'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Columns from '../column/column-edit'

const Boardbody = props => {
	const navigate = useNavigate()
	const Authorization = 'Bearer '+window.sessionStorage.getItem("access_token")
	if(!Authorization){
		alert('권한이 없습니다.')
		navigate('/')
	}
	const boardId = +useParams().id
	const [columns,setColumns] = useState([])
	const getColumns = async () => {
		if(isNaN(boardId) || !Number.isInteger(boardId) || boardId<1){
			alert('존재하지 않는 페이지입니다.')
			navigate('/')
		}
		const res = await fetch(server+`/column/${boardId}`, {headers:{'Content-Type':'application/json', Authorization}})
		if(res.status===401){
			alert('권한이 없습니다.')
			return navigate('/')
		}
		const columns_ = await res.json()
		columns_.sort((a,b) => a.order-b.order)
		setColumns(columns_)
	}

	useEffect(() => {
		getColumns()
	},[])
	
	const [cardSeq,setCardSeq] = useState(0)
	const [columnSeq,setColumnSeq] = useState(0)
	const [newColumnSeq,setNewColumnSeq] = useState(0)
	const [showMove,setShowMove] = useState(false)
	const handleShowMove = (e,cardSeq,columnSeq) => {
		setShowMove(true)
		setCardSeq(cardSeq)
		setColumnSeq(columnSeq)
		setNewColumnSeq(columnSeq)
	}
	const handleCloseMove = () => setShowMove(false)
	const move = async () => {
		if(columnSeq===newColumnSeq) return alert('현재 카드가 있는 컬럼이 아닌 다른 컬럼을 선택해주세요.')
		const res = await fetch(server+`/card/${cardSeq}/${newColumnSeq}`, {
			method: 'PATCH',
			headers:{'Content-Type':'application/json', Authorization}})
		alert('카드를 이동했습니다.')
		 window.location.reload()
	}
	
	return (
		<Container>
			<Columns handleShowMove={handleShowMove} boardid={boardId} />
			<Modal show={showMove} onHide={handleCloseMove}>
				<Modal.Header>
					<Modal.Title>이동할 컬럼</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form.Select value={newColumnSeq} onChange={e => {
						setNewColumnSeq(e.target.value)
					}} aria-label="Default select example">
						{columns.map(column => <option value={column.id} key={column.id}>{column.name}</option>)}
					</Form.Select>
					<br />
					<Button onClick={move} className='me-2'>이동</Button>
					<Button onClick={handleCloseMove}>취소</Button>
				</Modal.Body>
			</Modal>
		</Container>
	)
}

export default Boardbody