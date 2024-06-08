import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button, Table, Form, Card, Modal, Row, Col, Spinner, ToastContainer, Toast } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/CSS/POS.css';

const POSPage = () => {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [user, setUser] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsResponse, userResponse] = await Promise.all([
          axios.get('http://localhost:8800/items'),
          axios.get('http://localhost:8800/users/1'),
        ]);
        setItems(itemsResponse.data);
        setUser(userResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrorMessage('Error fetching data. Please try again.');
        setShowErrorModal(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const generateInvoiceId = async () => {
    try {
      const response = await axios.get('http://localhost:8800/invoices/max-id');
      const maxInvoiceId = response.data;
      return `INV-${String(maxInvoiceId + 1).padStart(3, '0')}`;
    } catch (error) {
      console.error('Error generating invoice ID:', error);
      return null;
    }
  };

  const handleAddToCart = useCallback(() => {
    if (!selectedItem || quantity <= 0) return;

    const item = items.find((item) => item.id === parseInt(selectedItem));
    if (item) {
      const existingItem = cart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        existingItem.quantity += quantity;
        setCart([...cart]);
      } else {
        setCart([...cart, { ...item, quantity }]);
      }
      setToastMessage(`${item.itemName} added to cart`);
      setShowToast(true);
    }
  }, [selectedItem, quantity, items, cart]);

  const handleRemoveFromCart = useCallback((itemToRemove) => {
    setCart(cart.filter((item) => item.id !== itemToRemove.id));
    setToastMessage(`${itemToRemove.itemName} removed from cart`);
    setShowToast(true);
  }, [cart]);

  const totalAmount = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const handleCheckout = useCallback(async () => {
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
      const invoiceData = {
        invoiceId: newInvoiceId,
        createdAt: new Date().toISOString(),
        totalAmount: parseFloat(totalAmount),
        userId: user.id,
      };
      const invoiceResponse = await axios.post('http://localhost:8800/invoices', invoiceData);

      for (const cartItem of cart) {
        const updatedStockQuantity = cartItem.stockQuantity - cartItem.quantity;
        await axios.put(`http://localhost:8800/items/${cartItem.id}`, {
          ...cartItem,
          stockQuantity: updatedStockQuantity,
        });

        const invoiceItemData = {
          invoice: {
            id: invoiceResponse.data.id,
          },
          item: {
            id: cartItem.id,
          },
          quantity: cartItem.quantity,
        };
        await axios.post('http://localhost:8800/invoiceitems', invoiceItemData);
      }

      navigate('/checkout', {
        state: { cart, totalAmount, invoiceId: newInvoiceId },
      });

      setCart([]);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error creating invoice:', error);
      setErrorMessage('Error creating invoice. Please try again.');
      setShowErrorModal(true);
    }
  }, [cart, totalAmount, user, navigate]);

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

  const handleCloseToast = () => {
    setShowToast(false);
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="text-center my-4">Point of Sale System</h1>

      <Card className="my-4 p-4">
        <h2>Add to Cart</h2>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group controlId="formItem">
                <Form.Label>Select Item</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedItem}
                  onChange={(e) => setSelectedItem(e.target.value)}
                >
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
                <Form.Control
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </Form.Group>
            </Col>
          </Row>
          <Button variant="primary" onClick={handleAddToCart} className="mt-3">
            Add to Cart
          </Button>
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
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.itemName}</td>
                <td>${item.price}</td>
                <td>{item.quantity}</td>
                <td>${(item.price * item.quantity)}</td>
                <td>
                  <Button variant="danger" onClick={() => handleRemoveFromCart(item)}>
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <div className="checkout-container text-center">
        <h3>Total Price: ${totalAmount}</h3>
        <Button variant="success" onClick={handleShowConfirmationModal}>
          Checkout
        </Button>
      </div>

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


      <ToastContainer position="top-end" className="p-3">
        <Toast onClose={handleCloseToast} show={showToast} delay={3000} autohide>
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default POSPage;
