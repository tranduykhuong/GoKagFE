import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faFileCircleQuestion, faTable, faPlus, faSquarePollVertical } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';
import { faCompass } from '@fortawesome/free-regular-svg-icons';
import classes from './Sidebar.module.scss';
import logo from '../../assets/imgs/GOKag.png';

const navs = [
  { title: 'Home', path: '/', icon: faCompass },
  { title: 'Datasets', path: '/datasets', icon: faTable },
  { title: 'Surveys', path: '/surveys', icon: faFileCircleQuestion },
];
const Sidebar = ({ isSidebarActive, setIsSidebarActive, isSidebarMobile, handleClickMobile }) => {
  const path = useLocation();
  const divRef = useRef();
  const [isHover, setIsHover] = useState(false);
  const [isCreateOptions, setIsCreateOptions] = useState(false);

  const handleClickMore = () => {
    if (isSidebarMobile) {
      handleClickMobile(false);
      setIsHover(false);
    } else {
      setIsSidebarActive((prev) => !prev);
    }
  };

  useEffect(() => {
    setIsHover(isSidebarMobile);
  }, [isSidebarMobile]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setIsCreateOptions(false);
      }
    };

    document.addEventListener('click', handleClickOutside, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return (
    <>
      {isCreateOptions && (
        <div className={classes['sidebar__createBtn-options']} ref={divRef}>
          <div className={classes['sidebar__createBtn-options-content']} onClick={() => setIsCreateOptions(false)}>
            <Link to="/datasets?new=true">
              <FontAwesomeIcon icon={faTable} fontSize={18} />
              <span>New Dataset</span>
            </Link>
            <Link to="/surveys?new=true">
              <FontAwesomeIcon icon={faSquarePollVertical} fontSize={19} />
              <span>New Survey</span>
            </Link>
          </div>
        </div>
      )}

      <div className={`${classes.sidebar} ${isSidebarActive || isHover ? classes['sidebar--active'] : undefined}`}>
        <div className={classes.sidebar__logo}>
          <div>
            <div className={classes['sidebar__logo-more']} onClick={handleClickMore}>
              <FontAwesomeIcon icon={faBars} fontSize={18} />
            </div>
            <img src={logo} alt="" />
          </div>
        </div>

        <div
          className={classes.sidebar__createBtn}
          onFocus={() => setIsHover(true)}
          onMouseOver={() => setIsHover(true)}
          onBlur={() => setIsHover(false)}
          onMouseOut={() => setIsHover(false)}
          onClick={() => setIsCreateOptions((prev) => !prev)}
        >
          <div className={classes['sidebar__createBtn-btn']}>
            <button>
              <FontAwesomeIcon icon={faPlus} fontSize={26} color="#20BEFF" style={{ flexShrink: 0, padding: '6px' }} />
              <span>Create</span>
            </button>
          </div>
        </div>

        <div
          style={{ flex: 1 }}
          onFocus={() => setIsHover(true)}
          onMouseOver={() => setIsHover(true)}
          onBlur={() => setIsHover(false)}
          onMouseOut={() => setIsHover(false)}
        >
          <ul className={classes.sidebar__list}>
            {navs.map((item, idx) => (
              <li
                className={`${classes.sidebar__item} ${
                  item.path !== '/' && path.pathname.includes(item.path) ? classes['sidebar__item--active'] : undefined
                }`}
                key={+idx}
              >
                <Link to={item.path}>
                  <FontAwesomeIcon icon={item.icon} fontSize={18} />
                  <p>{item.title}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
