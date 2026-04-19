import { useNavigate, useLocation } from "react-router-dom";

function Review() {
  const navigate = useNavigate();
  const location = useLocation();

  const data = location.state;

  if (!data) {
    return <p>Aucune donnée</p>;
  }

  return (
     <div className="card">
         <h2>Vérification</h2>

         <h3>Client</h3>
         <p>{data.firstName} {data.lastName}</p>
         <p>{data.email}</p>
         <p>{data.phone}</p>

         <h3>Événement</h3>
         <p>{data.eventType}</p>
         <p>{data.eventDate}</p>
         <p>{data.eventLocation}</p>
         <p>{data.guestCount} invités</p>

         <button onClick={() => navigate("/form")}>
           Modifier
         </button>

         <button onClick={() => navigate("/preview", { state: data })}>
           Générer le devis
         </button>
       </div>
    );
}

export default Review;