import React from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

function ColumnForm({ id, name, onClick, onDragStart, onDragOver, onDrop }) {
  const cardStyle = {
    width: '200px',
    margin: '0 50px 0 20px',
  }

  return (
    <Card
      onClick={onClick}
      draggable={true}
      onDragStart={(e) => onDragStart(e, id)}
      onDragOver={(e) => onDragOver(e)}
      onDrop={(e) => onDrop(e, id)}
      style={cardStyle}
    >
      <Card.Header className='name'> {name} </Card.Header>{' '}
      <Card.Body>
        <Button variant='primary'> 카드추가 </Button>{' '}
      </Card.Body>{' '}
      <Card.Footer className='date'> </Card.Footer>{' '}
    </Card>
  )
}

export default ColumnForm
