import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <img src={logo} alt="logo" className="logo" />

      <h1>Event Quote</h1>
      <p>
        Nous créons des devis personnalisés pour vos événements :
        mariages, anniversaires, conférences et plus encore.
      </p>

      <button onClick={() => navigate("/form")}>
        Demander un devis
      </button>
    </div>
  );
}

export default Home;