import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import routes from "../../constants/routesConstants";
import SimpleBar from "simplebar";
import "simplebar/dist/simplebar.min.css";

const Sidebar = () => {
  const [visibleMenus, setVisibleMenus] = useState({});

  const toggleMenu = (menu) => {
    setVisibleMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const sidebarRef = useRef(null);

  useEffect(() => {
    if (sidebarRef.current) {
      new SimpleBar(sidebarRef.current, { autoHide: true });
    }
  }, []);

  return (
    <div className="app-sidebar sticky" id="sidebar">
      {/* Sidebar image present in upper side */}
      <div className="main-sidebar-header">
        <Link to={routes.Dashboard} className="header-logo">
          <img
            src="/assets/images/matis_home.png"
            alt="logo"
            className="desktop-logo h-50 w-50 mx-auto"
          />
          <img
            src="/assets/images/matis_home.png"
            alt="logo"
            className="toggle-logo h-100 w-100 mx-auto"
          />
          <img
            src="/assets/images/matis_home.png"
            alt="logo"
            className="desktop-dark h-50 w-50 mx-auto"
          />
          <img
            src="/assets/images/matis_home.png"
            alt="logo"
            className="toggle-dark h-100 w-100 mx-auto"
          />
          <img
            src="/assets/images/matis_home.png"
            alt="logo"
            className="desktop-white h-50 w-50 mx-auto"
          />
          <img
            src="/assets/images/matis_home.png"
            alt="logo"
            className="toggle-white h-100 w-100 mx-auto"
          />
        </Link>
      </div>

      {/* Sidebar list */}
      <div className="main-sidebar h-100">
        <div
          id="sidebar-scroll"
          className="h-100 overflow-auto"
          ref={sidebarRef}
        >
          <nav className="main-menu-container nav nav-pills flex-column sub-open overflow-y-auto">
            {/* Sidebar List */}
            <ul className="main-menu">
              {/* Main */}
              <li className="slide__category">
                <span className="category-name">Main</span>
              </li>

              {/* Dashboard */}
              <li className="slide">
                <Link to={routes.Dashboard} className="side-menu__item">
                  <i className="bx bx-home side-menu__icon" />
                  <span className="side-menu__label">Dashboard</span>
                </Link>
              </li>

              {/* Management */}
              <li className="slide__category">
                <span className="category-name">Management</span>
              </li>

              {/* Administration */}
              <li className="slide has-sub">
                <a
                  href="#"
                  className="side-menu__item"
                  onClick={() => toggleMenu("administration")}
                >
                  <i className="ri-admin-fill fs-18 me-2 op-7"></i>
                  <span className="side-menu__label">Administration</span>
                  <i
                    className={`fe fe-chevron-${
                      visibleMenus.administration ? "down" : "right"
                    } side-menu__angle`}
                  ></i>
                </a>

                {/* Nested List */}
                <ul
                  className={`slide-menu child1 mega-menu ${
                    visibleMenus.administration ? "d-block" : "d-none"
                  }`}
                >
                  {/* Specialities*/}
                  <li className="slide">
                    <Link to={routes.Clients} className="side-menu__item">
                      <i className="ri-sparkling-2-fill fs-18 me-2 op-7"></i>
                      Clients
                    </Link>
                  </li>

                  {/* Doctors */}
                  <li className="slide">
                    <Link to={routes.Companies} className="side-menu__item">
                      <i className="ri-nurse-fill fs-18 me-2 op-7"></i>
                      Compnies
                    </Link>
                  </li>

                  {/* Services Group */}
                  <li className="slide">
                    <Link to={routes.Subscriptions} className="side-menu__item">
                      <i className="bx bx-category fs-18 me-2 op-7"></i>
                      Subscriptions
                    </Link>
                  </li>

                  {/* Services*/}
                  <li className="slide">
                    <Link to={routes.Service} className="side-menu__item">
                      <i className="ri-service-fill fs-18 me-2 op-7"></i>
                      Documnets
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
