import React from 'react';
import { useLocation } from 'react-router-dom';
import { Card, Table, Button } from 'react-bootstrap';

const CheckoutPage = () => {
  const location = useLocation();
  const { cart, totalAmount, invoiceId } = location.state || { cart: [], totalAmount: 0, invoiceId: '' };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <h1>Checkout Complete</h1>
      <Card className="my-4 p-4">
        <h2>Order Details</h2>
        <Table striped bordered hover className="mt-3">
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
                <td>{item.price}</td>
                <td>{item.quantity}</td>
                <td>${item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <h3>Total Price: ${totalAmount.toFixed(2)}</h3>
        <h4>Invoice ID: {invoiceId}</h4>
        <Button variant="primary" onClick={handlePrint}>Print</Button>
      </Card>
    </div>
  );
};

export default CheckoutPage;
