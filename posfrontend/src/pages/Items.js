import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Modal, Form, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/CSS/TablePage.CSS'; 

function ItemsPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [itemId, setItemId] = useState('');
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [itemCategoryId, setItemCategoryId] = useState('');

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:8800/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8800/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8800/items/${id}`);
        fetchItems();
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
    setItemId(item.itemId);
    setItemName(item.itemName);
    setPrice(item.price);
    setStockQuantity(item.stockQuantity);
    setItemCategoryId(item.itemCategory.id);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setShowForm(true);
    setItemId('');
    setItemName('');
    setPrice('');
    setStockQuantity('');
    setItemCategoryId('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setShowForm(false);
    if (editingItem) {
      try {
        await axios.put(`http://localhost:8800/items/${editingItem.id}`, {
          itemId,
          itemName,
          price,
          stockQuantity,
          itemCategory: { id: itemCategoryId }
        });
        fetchItems();
      } catch (error) {
        console.error('Error updating item:', error);
      }
    } else {
      try {
        await axios.post('http://localhost:8800/items', {
          itemId,
          itemName,
          price,
          stockQuantity,
          itemCategory: { id: itemCategoryId }
        });
        fetchItems();
      } catch (error) {
        console.error('Error creating item:', error);
      }
    }
    resetForm();
  };

  const resetForm = () => {
    setEditingItem(null);
    setItemId('');
    setItemName('');
    setPrice('');
    setStockQuantity('');
    setItemCategoryId('');
  };

  const handleClose = () => {
    setShowForm(false);
    resetForm();
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Items</h1>
      <Button variant="primary" className="mb-3" onClick={handleAdd}>
        Add Item
      </Button>
      <Table striped bordered hover responsive className="table-custom">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Item ID</th>
            <th>Item Name</th>
            <th>Price</th>
            <th>Stock Quantity</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.itemId}</td>
              <td>{item.itemName}</td>
              <td>{item.price}</td>
              <td>{item.stockQuantity}</td>
              <td>{item.itemCategory.categoryName}</td>
              <td>
                <Button variant="secondary" className="me-2" onClick={() => handleEdit(item)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(item.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={showForm} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingItem ? 'Edit Item' : 'Add Item'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group controlId="formItemId" className="mb-3">
              <Form.Label>Item ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter item ID"
                value={itemId}
                onChange={(e) => setItemId(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formItemName" className="mb-3">
              <Form.Label>Item Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter item name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPrice" className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formStockQuantity" className="mb-3">
              <Form.Label>Stock Quantity</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter stock quantity"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formItemCategoryId" className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                value={itemCategoryId}
                onChange={(e) => setItemCategoryId(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.categoryName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 mt-3">
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default ItemsPage;
