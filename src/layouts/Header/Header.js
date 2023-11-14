import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faClose, faMagnifyingGlass, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';
import classes from './Header.module.scss';
import logo from '../../assets/imgs/GOKag.png';
import ButtonCT from '../../components/button/ButtonCT';
import useWindowEvent from '../../hook/useWindowEvent';
import Author from '../../components/author/Author';
import auth from '../../utils/auth';

const Header = ({ isSidebar, handleClickMobile, isSidebarMobile }) => {
  const path = useLocation();
  const navigate = useNavigate();
  const [textSearch, setTextSearch] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const [focusSearch, setFocusSearch] = useState(false);
  const [isOpenOptions, setIsOpenOptions] = useState(false);
  const [isHidden, setIsHidden] = useState(path.pathname !== '/');

  const handleLogout = () => {
    auth.logout();
    window.location.reload();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setTextSearch('');
    setFocusSearch(false);
    navigate(`/datasets?key=${textSearch}`);
  };

  const handleClickYourProfile = () => {
    navigate(`/${auth.getUser().slug}`);
    setIsOpenOptions(false);
  };

  const handleScroll = () => {
    if (window.scrollY === 0) setScrollY(0);
    if (scrollY === 0) setScrollY(window.scrollY);
    setIsHidden(path.pathname !== '/' && window.scrollY >= 20);
  };

  useWindowEvent('scroll', handleScroll);

  useEffect(() => {
    setIsHidden(path.pathname !== '/' && scrollY);
  }, [path]);

  useEffect(() => {
    if (isOpenOptions) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpenOptions]);

  return (
    <div
      className={`${classes.header} ${scrollY ? classes['header--shadow'] : undefined} ${
        isHidden ? classes['header--hidden'] : undefined
      }`}
    >
      <div className={classes.header__wrap}>
        {(!isSidebar || isSidebarMobile) && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <FontAwesomeIcon
                className={classes['header__more-mobile']}
                icon={faBars}
                fontSize={20}
                onClick={() => handleClickMobile(true)}
              />
              <img src={logo} alt="logo-GoKag" height={26} />
            </div>
            <ul className={classes.header__nav}>
              <li>
                <Link to="/surveys" className={classes['header__nav-link']}>
                  Surveys
                </Link>
              </li>
              <li>
                <Link to="/datasets" className={classes['header__nav-link']}>
                  Datasets
                </Link>
              </li>
              {/* <li>
                <Link to="/" className={classes['header__nav-link']}>
                  Courses
                </Link>
              </li> */}
            </ul>
          </>
        )}

        <form
          onSubmit={handleSearch}
          className={classes.header__search}
          style={{ border: `${focusSearch ? 'solid 1px #333' : 'solid 1px #dadce0'}` }}
        >
          <FontAwesomeIcon className={classes['header__search-icon']} icon={faMagnifyingGlass} />
          <input
            type="text"
            placeholder="Search"
            value={textSearch}
            onFocus={() => setFocusSearch(true)}
            onBlur={() => setFocusSearch(false)}
            onChange={(e) => setTextSearch(e.target.value)}
          />
        </form>

        <div className={classes.header__btn}>
          {auth.getAccessToken() ? (
            <div style={{ cursor: 'pointer' }} onClick={() => setIsOpenOptions((prev) => !prev)}>
              <Author size={36} rank={2} img={auth.getUser().avatar} />
            </div>
          ) : (
            <>
              <ButtonCT
                opacityBtn
                medium
                borderRadius
                onClick={() => navigate('/auth/login', { state: path.pathname })}
              >
                <strong>Sign In</strong>
              </ButtonCT>
              <ButtonCT
                primary
                medium
                borderRadius
                onClick={() => navigate('/auth/register', { state: path.pathname })}
              >
                <strong>Register</strong>
              </ButtonCT>
            </>
          )}
        </div>
      </div>
      <div className={`${classes.header__options} ${isOpenOptions ? classes['header__options--show'] : undefined}`}>
        <div
          className={`${classes['header__options-content']} ${
            isOpenOptions ? classes['header__options-content--show'] : undefined
          }`}
        >
          <div className={classes['header__options-content-heading']}>
            <div>
              <Author size={24} rank={2} img={auth.getUser().avatar} />
              <h4>{`${auth.getUser().first_name} ${auth.getUser().last_name}`}</h4>
            </div>
            <div className={classes['header__options-content-heading--btn']} onClick={() => setIsOpenOptions(false)}>
              <FontAwesomeIcon icon={faClose} />
            </div>
          </div>
          <div className={classes['header__options-content-body']}>
            <div className={classes['header__options-content-body--item']} onClick={handleClickYourProfile}>
              <FontAwesomeIcon icon={faUserCircle} fontSize={20} />
              <p>Your profile</p>
            </div>
            <div className={classes['header__options-content-body--item']} onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOut} fontSize={20} />
              <p>Log out</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
