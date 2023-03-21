import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftCircleFill,
  ArrowRightCircleFill,
  MenuButton,
  List,
  ListCheck,
} from 'react-bootstrap-icons';
import './top-navigation.css';
import { useApp } from '../../hooks/useApp';

export default function TopNavigation({}) {
  const context = useApp();
  console.log('context', context);
  const {
    state: { topNavButtons },
  } = context;
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
      <div className="container-fluid">
        <ToggleSidebarButton />
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mt-2 mt-lg-0">
            {topNavButtons?.length > 0 &&
              topNavButtons.map((Component, index) => {
                console.log('component', Component);
                return React.cloneElement(Component, { key: `nav-button-${index}` });
              })}
            {/* <li className="nav-item active">
              <a className="nav-link" href="#!">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#!">
                Link
              </a>
            </li> */}
            {/* <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                id="navbarDropdown"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Dropdown
              </a>
              <div className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <a className="dropdown-item" href="#!">
                  Action
                </a>
                <a className="dropdown-item" href="#!">
                  Another action
                </a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" href="#!">
                  Something else here
                </a>
              </div>
            </li> */}
          </ul>
        </div>
      </div>
    </nav>
  );
}

const ToggleSidebarButton = () => {
  const [toggle, setToggle] = useState(true);

  const toggleSideBar = (event) => {
    document.body.classList.toggle('sb-sidenav-toggled');
    localStorage.setItem(
      'sb|sidebar-toggle',
      document.body.classList.contains('sb-sidenav-toggled')
    );
    setToggle(!toggle);
  };

  const handleWindowResize = (event) => {
    // // const match = window.matchMedia('(max-width:768px)').matches;
    // const match = document.body.classList.contains('sb-sidenav-toggled');
    // console.log('match', match);
    // if (match) {
    //   setToggle(true);
    // } else {
    //   setToggle(false);
    // }
  };
  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);
  return (
    <button className="icon-button" id="sidebarToggle" onClick={toggleSideBar}>
      {toggle ? (
        <List />
      ) : (
        // <ArrowLeftCircleFill />
        <List />
      )}
    </button>
  );
};
