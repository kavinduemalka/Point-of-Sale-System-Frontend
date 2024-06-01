import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Modal, Form } from 'react-bootstrap';

function Stockspage() {
  const [stocks, setStocks] = useState([]);
  const [items, setItems] = useState([]);
  const [editingStock, setEditingStock] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [itemId, setItemId] = useState('');
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    fetchStocks();
    fetchItems();
  }, []);

  const fetchStocks = async () => {
    try {
      const response = await axios.get('http://localhost:8800/stocks');
      setStocks(response.data);
    } catch (error) {
      console.error('Error fetching stocks:', error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:8800/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this stock?');

    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8800/stocks/${id}`);
        fetchStocks();
      } catch (error) {
        console.error('Error deleting stock:', error);
      }
    }
  };

  const handleEdit = (stock) => {
    setEditingStock(stock);
    setShowForm(true);
    setItemId(stock.item.id);
    setQuantity(stock.quantity);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setShowForm(false);
    if (editingStock) {
      try {
        await axios.put(`http://localhost:8800/stocks/${editingStock.id}`, {
          item: { id: itemId },
          quantity,
        });
        fetchStocks();
      } catch (error) {
        console.error('Error updating stock:', error);
      }
    } else {
      try {
        await axios.post('http://localhost:8800/stocks', {
          item: { id: itemId },
          quantity,
        });
        fetchStocks();
      } catch (error) {
        console.error('Error creating stock:', error);
      }
    }
    setEditingStock(null);
    setItemId('');
    setQuantity('');
  };

  return (
    <div>
      <h1>Stocks</h1>
      <Button variant="primary" onClick={() => setShowForm(true)}>
        Add Stock
      </Button>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Last Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.id}>
              <td>{stock.id}</td>
              <td>{stock.item.itemName}</td>
              <td>{stock.quantity}</td>
              <td>{stock.lastUpdated}</td>
              <td>
                <Button variant="secondary" onClick={() => handleEdit(stock)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(stock.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={showForm} onHide={() => setShowForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingStock ? 'Edit Stock' : 'Add Stock'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group controlId="formItemId">
              <Form.Label>Item</Form.Label>
              <Form.Control
                as="select"
                value={itemId}
                onChange={(e) => setItemId(e.target.value)}
              >
                <option value="">Select Item</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.itemName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formQuantity">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Stockspage;
