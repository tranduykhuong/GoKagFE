import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import classes from './AuthFrame.module.scss';
import logo from '../../assets/imgs/GOKag.png';
import bannerAuth from '../../assets/imgs/bennerAuth.png';

const AuthFrame = () => {
  const path = useLocation();
  const [pathname, setPathname] = useState();

  useEffect(() => {
    const tmp = path.pathname.split('/');
    tmp.pop();
    setPathname(tmp.join('/'));
  }, []);

  return (
    <div className={classes.authFrame__wrapper}>
      <div className={classes.authFrame}>
        <div className={classes.authFrame__heading}>
          <Link to="/">
            <img src={logo} alt="" width={90} />
          </Link>
          <h2>Welcome!</h2>
          <div className={classes['authFrame__heading-nav']}>
            <Link
              to={`${pathname}/login`}
              state={path.state}
              className={`${classes['authFrame__heading-nav--item']} ${
                path.pathname.includes('/login') ? classes['authFrame__heading-nav--active'] : undefined
              }`}
            >
              Sign In
            </Link>
            <Link
              to={`${pathname}/register`}
              state={path.state}
              className={`${classes['authFrame__heading-nav--item']} ${
                path.pathname.includes('/register') ? classes['authFrame__heading-nav--active'] : undefined
              }`}
            >
              Register
            </Link>
          </div>
        </div>
        <div className={classes.authFrame__form}>
          <Outlet />
        </div>
        <img className={classes.authFrame__banner} src={bannerAuth} alt="" />
      </div>
    </div>
  );
};

export default AuthFrame;
