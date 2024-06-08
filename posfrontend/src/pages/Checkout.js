import React from 'react';
import { useLocation } from 'react-router-dom';
import { Card, Table, Button, Row, Col, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const CheckoutPage = () => {
  const location = useLocation();
  const { cart, totalAmount, invoiceId } = location.state || { cart: [], totalAmount: 0, invoiceId: '' };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Container className="my-5">
      <Card className="p-4 shadow-sm">
        <Row className="mb-4">
          <Col>
            <h1 className="text-center">Checkout Complete</h1>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col className="text-center">
            <h4>Invoice ID: <span className="text-primary">{invoiceId}</span></h4>
          </Col>
        </Row>
        <Row>
          <Col>
            <h2 className="mb-3">Order Details</h2>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Item Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.itemName}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>{item.quantity}</td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col className="text-end">
            <h3>Total Price: <span className="text-success">${totalAmount.toFixed(2)}</span></h3>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col className="text-center">
            <Button variant="primary" onClick={handlePrint}>Print</Button>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default CheckoutPage;
