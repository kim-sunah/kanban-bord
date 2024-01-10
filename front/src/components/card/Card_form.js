import {useState} from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

const colors = [['red','빨강🔴'],['orange','오렌지🟠'],['yellow','노랑🟡'],['green','초록🟢'],['brown','갈색🟤'],['blue','파랑🔵'],['purple','보라🟣'],['black','검정⚫']]
const CardForm = props => {
	const [name,setName] = useState(props.name||'')
	const [color,setColor] = useState(props.color||'red')
	const [description,setDescription] = useState(props.description||'')
	const [deadline,setDeadline] = useState(props.deadline||'')
	
	return (
		<Form onSubmit={e => props.onSubmit(e,{name,color,description,deadline})}>
			<Form.Group>
				<Form.Label>이름</Form.Label>
				<Form.Control required onChange={e => setName(e.target.value)} defaultValue={props.name || ''} />
			</Form.Group>
			<Form.Group>
				<Form.Label>색깔</Form.Label>
				<Form.Select value={color} onChange={e => setColor(e.target.value)} aria-label="Default select example">
					{colors.map(color => <option value={color[0]}>{color[1]}</option>)}
				</Form.Select>
			</Form.Group>
			<Form.Group>
				<Form.Label>설명</Form.Label>
				<Form.Control as="textarea" onChange={e => setDescription(e.target.value)} defaultValue={props.description || ''} />
			</Form.Group>
			<Form.Group>
				<Form.Label>기한</Form.Label>
				<Form.Control required type='date' onChange={e => setDeadline(e.target.value)} value={deadline.slice(0,10)} />
			</Form.Group>
			<br />
			<Button type='submit' className='me-2'>{props.tag || '카드 추가'}</Button>
			<Button onClick={props.handleClose}>취소</Button>
		</Form>
	)
}

export default CardForm