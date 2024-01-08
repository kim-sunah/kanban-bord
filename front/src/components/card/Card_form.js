import {useState} from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

const CardForm = props => {
	const [name,setName] = useState(props.name||'')
	const [color,setColor] = useState(props.color||'')
	const [description,setDescription] = useState(props.description||'')
	const [deadline,setDeadline] = useState(props.deadline||'')
	
	return (
		<Form onSubmit={e => props.onSubmit(e,{name,color,description,deadline})}>
			<Form.Group>
				<Form.Label>이름</Form.Label>
				<Form.Control required onChange={e => setName(e.target.value)} />
			</Form.Group>
			<Form.Group>
				<Form.Label>색깔</Form.Label>
				<Form.Control onChange={e => setColor(e.target.value)} />
			</Form.Group>
			<Form.Group>
				<Form.Label>설명</Form.Label>
				<Form.Control onChange={e => setDescription(e.target.value)} />
			</Form.Group>
			<Form.Group>
				<Form.Label>기한</Form.Label>
				<Form.Control required type='date' onChange={e => setDeadline(e.target.value)} />
			</Form.Group>
			<br />
			<Button type='submit' className='me-2'>카드 추가</Button>
			<Button onClick={props.handleClose}>취소</Button>
		</Form>
	)
}

export default CardForm