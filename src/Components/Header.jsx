import { Link, NavLink } from 'react-router-dom';

import logo from './images/logo.svg';

const Header = () => {
  return (
    <header>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <a href="https://www.digitalfutures.com" className="navbar-brand" target="_blank" rel="noreferrer">
            <img src={logo} alt="Digital Futures" width="100" />
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <Link to="/" className="navbar-brand">Todo App</Link>
          <div className="collapse navbar-collapse">
            <div className="navbar-nav">
              <NavLink to="/" className={(({ isActive }) => isActive ? `nav-link active` : `nav-link`)}>
                All Todos
              </NavLink>
              <NavLink to="/add" className={(({ isActive }) => isActive ? `nav-link active` : `nav-link`)}>
                Add Todo
              </NavLink>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
