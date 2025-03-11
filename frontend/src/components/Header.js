import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/components/Header.css";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo" onClick={(e) => {
          if (isAuthenticated) {
            e.preventDefault();
            navigate('/home'); // ✅ Reload home without redirecting to login
          }
        }}>
          🏏 Cricket Betting
        </Link>
        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/" onClick={(e) => {
                if (isAuthenticated) {
                  e.preventDefault();
                  navigate('/home'); // ✅ Handle refresh if logged in
                }
              }}>
                Home
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/profile">👤 {user?.username}</Link>
                </li>
                <li>
                  <button className="logout-btn" onClick={logout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
