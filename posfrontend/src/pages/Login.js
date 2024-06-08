import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import TextInput from '../components/TextInput';
import '../assets/CSS/Login.css'; 

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.get('http://localhost:8800/users');
      const users = response.data;
      const user = users.find(user => user.username === username && user.password === password);

      if (user) {
        navigate('/pos'); 
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('An error occurred while logging in. Please try again later.');
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100">
        <Col xs={12} md={6} lg={5} className="mx-auto">
          <Card className="shadow-sm p-4 border-0 rounded-3 bg-light-custom">
            <Card.Body>
              <Card.Title className="text-center mb-4">Login</Card.Title>
              <Form onSubmit={handleSubmit}>
                <TextInput
                  controlId="formBasicUsername"
                  label="Username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <TextInput
                  controlId="formBasicPassword"
                  label="Password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {error && <Alert variant="danger" className="text-center">{error}</Alert>}

                <Button variant="primary" type="submit" className="w-100">
                  Login
                </Button>
              </Form>
              <div className="mt-3 text-center">
                <span>Don't have an account? </span>
                <Link to="/signup">Sign Up</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
