import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Card, Modal, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/CSS/POS.css'

function POSPage() {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalPrice] = useState(0);
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [user, setUser] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchItems();
    fetchUser();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:8800/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get('http://localhost:8800/users/1');
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const generateInvoiceId = async () => {
    try {
      const response = await axios.get('http://localhost:8800/invoices/max-id');
      const maxInvoiceId = response.data;
      const newInvoiceId = `INV-${String(maxInvoiceId + 1).padStart(3, '0')}`;
      return newInvoiceId;
    } catch (error) {
      console.error('Error generating invoice ID:', error);
      return null;
    }
  };

  const handleAddToCart = () => {
    const item = items.find((item) => item.id === parseInt(selectedItem));
    if (item) {
      const itemToAdd = { ...item, quantity };
      setCart([...cart, itemToAdd]);
      setTotalPrice(totalAmount + itemToAdd.price * quantity);
    }
  };

  const handleRemoveFromCart = (itemToRemove) => {
    const newCart = cart.filter((item) => item.id !== itemToRemove.id);
    setCart(newCart);
    setTotalPrice(totalAmount - itemToRemove.price * itemToRemove.quantity);
  };

  const handleCheckout = async () => {
    const newInvoiceId = await generateInvoiceId();
    if (!newInvoiceId) {
      setErrorMessage('Error generating invoice ID');
      setShowErrorModal(true);
      return;
    }

    if (!user) {
      setErrorMessage('User not found');
      setShowErrorModal(true);
      return;
    }

    try {
      // Create invoice
      const invoiceData = {
        invoiceId: newInvoiceId,
        createdAt: new Date().toISOString(),
        totalAmount: totalAmount,
        userId: user.id
      };
      const invoiceResponse = await axios.post('http://localhost:8800/invoices', invoiceData);
      console.log('Invoice created:', invoiceResponse.data);

      // Reduce stock and create invoice items
      for (const cartItem of cart) {
        // Update stock quantity
        const updatedStockQuantity = cartItem.stockQuantity - cartItem.quantity;
        await axios.put(`http://localhost:8800/items/${cartItem.id}`, {
          ...cartItem,
          stockQuantity: updatedStockQuantity
        });

        // Create invoice item
        const invoiceItemData = {
          invoice: {
            id: invoiceResponse.data.id
          },
          item: {
            id: cartItem.id
          },
          quantity: cartItem.quantity
        };
        await axios.post('http://localhost:8800/invoiceitems', invoiceItemData);
      }

      // Set state and show confirmation modal
      navigate('/checkout', {
        state: { cart, totalAmount, invoiceId: newInvoiceId }
      });

      setCart([]);
      setTotalPrice(0);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error creating invoice:', error);
      setErrorMessage('Error creating invoice. Please try again.');
      setShowErrorModal(true);
    }
  };

  const handleShowConfirmationModal = () => {
    setShowConfirmationModal(true);
  };

  const handleConfirmCheckout = () => {
    setShowConfirmationModal(false);
    handleCheckout();
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  return (
    <div>
      <h1>Point of Sale (POS)</h1>

      <Card className="my-4 p-4">
        <h2>Add to Cart</h2>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group controlId="formItem">
                <Form.Label>Select Item</Form.Label>
                <Form.Control as="select" value={selectedItem} onChange={(e) => setSelectedItem(e.target.value)}>
                  <option value="">Select Item</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.itemName} - ${item.price}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formQuantity">
                <Form.Label>Quantity</Form.Label>
                <Form.Control type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              </Form.Group>
            </Col>
          </Row>
          <div className="mb-3"></div>
          <Button variant="primary" onClick={handleAddToCart}>Add to Cart</Button>
        </Form>
      </Card>

      <Card className="my-4 p-4">
        <h2>Shopping Cart</h2>
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Item Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Remove from Cart</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.itemName}</td>
                <td>{item.price}</td>
                <td>{item.quantity}</td>
                <td>${item.price * item.quantity}</td>
                <td>
                  <Button variant="danger" onClick={() => handleRemoveFromCart(item)}>Remove</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <div className="checkout-container">
        <h3>Total Price: ${totalAmount.toFixed(2)}</h3>
        <Button variant="success" onClick={handleShowConfirmationModal}>Checkout</Button>
      </div>

      {/* Confirmation Modal */}
      <Modal show={showConfirmationModal} onHide={handleCloseConfirmationModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Checkout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to proceed with the checkout?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmationModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmCheckout}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>Invoice created successfully!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSuccessModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Error Modal */}
      <Modal show={showErrorModal} onHide={handleCloseErrorModal}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseErrorModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default POSPage;
