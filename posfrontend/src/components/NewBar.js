import React from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from './NavigationBar';

const NavBarWrapper = () => {
  const location = useLocation();
  const hideNavBarPaths = ['/', '/signup'];
  const shouldHideNavBar = hideNavBarPaths.includes(location.pathname);

  return !shouldHideNavBar && <NavBar />;
};

export default NavBarWrapper;
