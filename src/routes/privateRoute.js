import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PrivateRoute = ({ isAllowed, redirectPath, children }) => {
  const location = useLocation();
  return isAllowed ? children || <Outlet /> : <Navigate to={redirectPath} state={location.pathname} replace />;
};

PrivateRoute.propTypes = {
  isAllowed: PropTypes.bool,
  redirectPath: PropTypes.string,
  children: PropTypes.element,
};

PrivateRoute.defaultProps = {
  isAllowed: false,
  redirectPath: '/login',
  children: null,
};

export default PrivateRoute;
