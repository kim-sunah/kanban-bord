import Modal from 'react-bootstrap/Modal'

const Cardbody = (props) => {
	const {name} = props.card
	return ( 
		<div>
			<p>{name}</p>
		</div>
	)
}

export default Cardbody