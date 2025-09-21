import logo from "../assets/logo.png";
import "./Header.css";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <div className="header">
      <div className="header-logo-title">
        <Link to="/">
          <img src={logo} alt="Photo" />
        </Link>
        <Link
          to="/"
          className="header-title"
          style={{ textDecoration: "none" }}
        >
          FARBARI
        </Link>
      </div>
      <ul>
        <li>About us</li>
        <li>Adopt</li>
        <li>Donate</li>
        <li>Events</li>
        <li>Contact Us</li>
        <li>Resources</li>
      </ul>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div className="dropdown">
          <button className="dropbtn">Pets ▼</button>
          <div className="dropdown-content">
            <a href="#dogs">Dogs</a>
            <a href="#cats">Cats</a>
            <a href="#others">Others</a>
          </div>
        </div>
        <Link to="/signin" style={{ marginLeft: "16px" }}>
          <button>Sign in</button>
        </Link>
      </div>
    </div>
  );
}
