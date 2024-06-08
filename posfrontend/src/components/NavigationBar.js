import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../utils/AuthContext';

function NavBar() {
    const { isAuthenticated, logout } = useAuth();

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
            <Container>
                <Navbar.Brand href="/">POS System</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <LinkContainer to="/category">
                            <Nav.Link>Categories</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/items">
                            <Nav.Link>Items</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/stocks">
                            <Nav.Link>Stocks</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/pos">
                            <Nav.Link>POS</Nav.Link>
                        </LinkContainer>
                    </Nav>
                    <Nav>
                        {isAuthenticated ? (
                            <Button variant="outline-light" onClick={logout}>Logout</Button>
                        ) : (
                            <LinkContainer to="/login">
                                <Button variant="outline-light">Login</Button>
                            </LinkContainer>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavBar;
