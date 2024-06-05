// src/components/NavBarTabs.js
import React from 'react';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';

function NavBar() {
    return (
        <Nav variant="tabs" defaultActiveKey="/">
            <Nav.Item>
                <LinkContainer to="/">
                    <Nav.Link>Login</Nav.Link>
                </LinkContainer>
            </Nav.Item>
            <Nav.Item>
                <LinkContainer to="/signup">
                    <Nav.Link>Signup</Nav.Link>
                </LinkContainer>
            </Nav.Item>
            <Nav.Item>
                <LinkContainer to="/category">
                    <Nav.Link>Categories</Nav.Link>
                </LinkContainer>
            </Nav.Item>
            <Nav.Item>
                <LinkContainer to="/items">
                    <Nav.Link>Items</Nav.Link>
                </LinkContainer>
            </Nav.Item>
            <Nav.Item>
                <LinkContainer to="/stocks">
                    <Nav.Link>Stocks</Nav.Link>
                </LinkContainer>
            </Nav.Item>
            <Nav.Item>
                <LinkContainer to="/pos">
                    <Nav.Link>POS</Nav.Link>
                </LinkContainer>
            </Nav.Item>
        </Nav>
    );
}

export default NavBar;
