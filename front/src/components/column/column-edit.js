import React, { useState, useEffect } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import ColumnForm from './Column_form'

const Columns = ({ boardid }) => {
  const [columns, setColumns] = useState([])
  const [newColumnName, setNewColumnName] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedColumn, setSelectedColumn] = useState(null)
  const Authorization = 'Bearer '+window.sessionStorage.getItem("access_token")

  useEffect(() => {
    fetchColumns(boardid)
  }, [])

  const fetchColumns = async (boardid) => {
    const response = await fetch(`http://localhost:4000/column/${boardid}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization,
      },
    })
    const columns = await response.json()
    setColumns(columns)
  }

  const addColumn = async () => {
    try {
      console.log(newColumnName)
      const response = await fetch(`http://localhost:4000/column/${boardid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization,
        },
        body: JSON.stringify({ name: newColumnName }),
      })

      fetchColumns(boardid)
      setNewColumnName('')
    } catch (error) {
      console.error('Error adding column:', error.message)
    }
  }

  const updateColumn = async () => {
    if (!selectedColumn || !newColumnName.trim()) return

    try {
      console.log(selectedColumn.id)
      console.log(newColumnName)
      const response = await fetch(`http://localhost:4000/column/put/${selectedColumn.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization,
        },
        body: JSON.stringify({ name: newColumnName }),
      })
      await fetchColumns(boardid)
      setNewColumnName('')
      setShowModal(false)
    } catch (error) {
      console.error('Error updating column:', error.message)
    }
  }

  const moveColumn = async (droppedColumnId, targetOrder) => {
    try {
      console.log(droppedColumnId)
      console.log(targetOrder)
      const response = await fetch(`http://localhost:4000/column/move/${droppedColumnId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization,
        },
        body: JSON.stringify({ order: targetOrder }),
      })
	  window.location.reload()
    } catch (error) {
      console.error('Error moving column:', error.message)
    }
  }

  const deleteColumn = async (columnId) => {
    try {
      const shouldDelete = window.confirm('Are you sure you want to delete this column?')
      if (shouldDelete) {
        const response = await fetch(`http://localhost:4000/column/delete/${columnId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization,
          },
          body: JSON.stringify(),
        })
		setColumns(columns.filter(column => column.id!==columnId))
      } else {
        alert('Delete cancelled')
        return
      }
    } catch (error) {
      console.error('Error deleting column:', error.message)
    }
  }

  const openModal = (column) => {
    setSelectedColumn(column)
    setNewColumnName(column.name)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }
  const handleColumnClick = (e,column) => {
	  if(e.target.tagName==='DIV') openModal(column)
  }

  const handleDragStart = (e, column) => {
    e.dataTransfer.setData('text/plain', column.id.toString())
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const droppedColumnId = parseInt(e.dataTransfer.getData('text/plain'), 10)
    console.log(droppedColumnId)
    deleteColumn(droppedColumnId)
  }
  const ColumnDrop = (e) => {
    e.preventDefault()
    const droppedColumnId = parseInt(e.dataTransfer.getData('text/plain'), 10)

    const newIndex = Array.from(e.currentTarget.parentNode.children).indexOf(e.currentTarget)
    console.log(newIndex)

    const targetColumn = columns[newIndex]
    const targetOrder = targetColumn.order

    moveColumn(droppedColumnId, targetOrder)
  }
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addColumn(newColumnName)
    }
  }

  return (
    <div>
      <div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginTop: '10px',
            marginRight: '10px',
          }}
        >
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{ border: '1px solid black', marginRight: '10px' }}
          >
            Trash Can{' '}
          </div>
          <div>
            <input
              type='text'
              placeholder='New Column Name'
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button onClick={() => addColumn(newColumnName)}> Add </button>
          </div>
        </div>
      </div>{' '}
      <div className="overflow-auto" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', marginTop: '50px' }}>
        {columns.map((column) => (
          <ColumnForm
            id={column.id}
            name={column.name}
            key={column.id}
            onClick={e => handleColumnClick(e,column)}
            draggable={true}
            onDragStart={(e) => handleDragStart(e, column)}
            onDragOver={handleDragOver}
            onDrop={ColumnDrop}
            style={{
              border: '1px solid #ddd',
              padding: '10px',
              marginBottom: '5px',
              cursor: 'move',
            }}
          >
            {column.name}
          </ColumnForm>
        ))}
      </div>{' '}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title> Update Column </Modal.Title>{' '}
        </Modal.Header>{' '}
        <Modal.Body>
          <Form>
            <Form.Group controlId='newColumnName'>
              <Form.Label> New Column Name </Form.Label>{' '}
              <Form.Control
                type='text'
                placeholder='Enter new column name'
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
              />{' '}
            </Form.Group>{' '}
          </Form>{' '}
        </Modal.Body>{' '}
        <Modal.Footer>
          <Button variant='secondary' onClick={closeModal}>
            Close{' '}
          </Button>{' '}
          <Button variant='primary' onClick={updateColumn}>
            Update Column{' '}
          </Button>{' '}
        </Modal.Footer>{' '}
      </Modal>{' '}
    </div>
  )
}

export default Columns
