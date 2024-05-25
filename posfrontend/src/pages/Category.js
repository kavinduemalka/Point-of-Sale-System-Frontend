import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Modal, Form } from 'react-bootstrap';

function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8800/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleDelete = async (id) => {
    // Display confirmation dialog before deleting
    const confirmDelete = window.confirm('Are you sure you want to delete this category?');
    
    if (confirmDelete) {
        try {
            await axios.delete(`http://localhost:8800/category/${id}`);
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    }
};
  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);
    setCategoryId(category.categoryId);
    setCategoryName(category.categoryName);
    setDescription(category.description);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setShowForm(false);
    if (editingCategory) {
      try {
        await axios.put(`http://localhost:8800/category/${editingCategory.id}`, {
          categoryId,
          categoryName,
          description,
        });
        fetchCategories();
      } catch (error) {
        console.error('Error updating category:', error);
      }
    } else {
      try {
        await axios.post('http://localhost:8800/categories', {
          categoryId,
          categoryName,
          description,
        });
        fetchCategories();
      } catch (error) {
        console.error('Error creating category:', error);
      }
    }
    setEditingCategory(null);
    setCategoryId('');
    setCategoryName('');
    setDescription('');
  };

  return (
    <div>
      <h1>Categories</h1>
      <Button variant="primary" onClick={() => setShowForm(true)}>
        Add Category
      </Button>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Category ID</th>
            <th>Category Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.categoryId}</td>
              <td>{category.categoryName}</td>
              <td>{category.description}</td>
              <td>
                <Button variant="secondary" onClick={() => handleEdit(category)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(category.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={showForm} onHide={() => setShowForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingCategory ? 'Edit Category' : 'Add Category'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group controlId="formCategoryId">
              <Form.Label>Category ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category ID"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formCategoryName">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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

export default CategoryPage;
