import ColumnTemp from './Column_temp'
import React, {useState,useEffect} from 'react'
import Cookies from 'js-cookie'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useSearchParams, useNavigate } from 'react-router-dom'
import {server,Authorization} from '../../constant.js'

const Cardmain = props => {
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()
	const [columns,setColumns] = useState([])
	const getColumns = async () => {
		const boardId = +searchParams.get('id')
		if(isNaN(boardId) || !Number.isInteger(boardId) || boardId<1){
			alert('존재하지 않는 페이지입니다.')
			navigate('/')
		}
		const res = await fetch(server+`/column/${boardId}`, {headers:{'Content-Type':'application/json', Authorization}})
		const columns_ = await res.json()
		columns_.sort((a,b) => a.order-b.order)
		setColumns(columns_)
	}

	useEffect(() => {
		getColumns()
	},[])
	
	return (
		<Container>
			<Row>
				{columns.map((column,i) => (
					<Col key={i}>
						<ColumnTemp key={column.id} name={column.name} columnSeq={column.id} />
					</Col>))}
			</Row>
		</Container>
	)
}

export default Cardmain