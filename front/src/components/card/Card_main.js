import ColumnTemp from './Column_temp'
import React, {useState,useEffect} from 'react'
import Cookies from 'js-cookie'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Cardmain = props => {
	const [columnSeqs,setColumnSeqs] = useState([1,2,5,7,9])
	const [columns,setColumns] = useState([])
	useEffect(() => {
		const getColumns = async () => {
			setColumns(await Promise.all(columnSeqs.map(async columnSeq => <ColumnTemp key={columnSeq} columnSeq={columnSeq} />)))
		}
		getColumns()
	},[columns])
	return (
		<Container>
			<Row>
				{columns.map((column,i) => <Col key={i}>{column}</Col>)}
			</Row>
		</Container>
	)
}

export default Cardmain