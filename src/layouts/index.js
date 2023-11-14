import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import Sidebar from './Sidebar/Sidebar';

const Layout = () => {
  const path = useLocation();
  const [isSidebar, setIsSidebar] = useState(path.pathname !== '/');
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [isSidebarMobile, setIsSidebarMobile] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      // behavior: 'smooth',
    });
  };

  const handleClickMobile = (flag) => {
    setIsSidebar(flag);
    setIsSidebarMobile(flag);
  };

  useEffect(() => {
    setIsSidebar(path.pathname !== '/');
    setIsSidebarActive(path.pathname === '/');
    scrollToTop();

    if (isSidebarMobile) {
      handleClickMobile(false);
    }
  }, [path]);

  useEffect(() => {
    if (!isSidebar) {
      setIsSidebar(isSidebarMobile);
    }
  }, [isSidebarMobile]);

  useEffect(() => {
    if (window.innerWidth < 739) {
      setIsSidebarMobile(false);
      setIsSidebar(false);
    }
  }, [path]);

  return (
    <div className="">
      {isSidebar && (
        <Sidebar
          isSidebarActive={isSidebarActive}
          setIsSidebarActive={setIsSidebarActive}
          isSidebarMobile={isSidebarMobile}
          handleClickMobile={handleClickMobile}
        />
      )}
      <div
        style={{
          marginLeft: `${isSidebar && !isSidebarMobile ? 68 : 0}px`,
          paddingLeft: `${isSidebar && isSidebarActive && !isSidebarMobile ? 182 : 0}px`,
          transition: 'padding 0.2s 0.3s ease-in-out',
        }}
      >
        <Header isSidebar={isSidebar} handleClickMobile={handleClickMobile} isSidebarMobile={isSidebarMobile} />
        <Outlet />
        {!path.pathname.includes('/surveys/edit') && <Footer />}
      </div>
    </div>
  );
};

export default Layout;
