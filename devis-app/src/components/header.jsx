import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  return (
    <header className="header">
      <img
        src={logo}
        alt="logo"
        className="header-logo"
        onClick={() => navigate("/")}
      />

      <h2 onClick={() => navigate("/")}>Event Quote</h2>
    </header>
  );
}

export default Header;