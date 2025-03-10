import { Link } from 'react-router-dom';
import '../styles/components/Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">🏏 Cricket Betting</Link>
        <nav>
          <ul className="nav-links">
            <li><Link to="/matches">Matches</Link></li>
            <li><Link to="/bets">My Bets</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
