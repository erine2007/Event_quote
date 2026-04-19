import { useLocation, useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import logo from "../assets/logo.png";
import stamp from "../assets/stamp.png";
import { useState } from "react";



function Preview() {

  const [showPopup, setShowPopup] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state;


  if (!data) {
    return <p>Aucune donnée</p>;
  }

  // 🔹 Calcul simple (temporaire)
  const pricePerGuest = 50;
  const total = data.guestCount * pricePerGuest;

  // 🔹 PDF
  const generatePDF = () => {
    const element = document.getElementById("devis");

    html2pdf()
    .from(element)
    .save()
    .then(() => {
     setShowPopup(true);
    });
  };

  return (
   <div className="card">
     <h2>Aperçu du devis</h2>

     <div id="devis" className="devis-card">
       <div id="devis" className="devis-container">

         {/* HEADER */}
        <div className="devis-header">
         <img src={logo} alt="logo" className="logo-devis" />

         <div>
           <h1>DEVIS</h1>
           <p>N° AE-{Date.now()}</p>
           <p>Date : {new Date().toLocaleDateString()}</p>
         </div>
       </div>

        {/* CLIENT */}
       <div className="devis-section">
         <h2>Client</h2>
         <p>{data.firstName} {data.lastName}</p>
         <p>{data.email}</p>
         <p>{data.phone}</p>
        </div>

        {/* EVENT */}
       <div className="devis-section">
         <h2>Événement</h2>
         <p>Type : {data.eventType}</p>
         <p>Date : {data.eventDate}</p>
         <p>Lieu : {data.eventLocation}</p>
         <p>Invités : {data.guestCount}</p>
       </div>

       {/* TABLEAU */}
       <table className="devis-table">
         <thead>
           <tr>
             <th>Prestation</th>
             <th>Quantité</th>
             <th>Prix unitaire</th>
             <th>Total</th>
           </tr>
         </thead>
         <tbody>
           <tr>
             <td>Organisation événement</td>
             <td>{data.guestCount}</td>
             <td>{pricePerGuest}€</td>
             <td>{total}€</td>
           </tr>
         </tbody>
       </table>

        {/* TOTAL */}
       <div className="devis-total">
         <h2>Total : {total}€</h2>
       </div>

       {/* FOOTER */}
      <div className="devis-footer">
      <div>
        <p>Signature :</p>
      </div>

      <div>
        <img src={stamp} alt="tampon" className="stamp-devis" />
      </div>
    </div>

   </div>
    </div>

     <button onClick={() => navigate("/review", { state: data })}>
       Retour
     </button>

     <button onClick={generatePDF}>
       Télécharger le devis
     </button>
   

     {showPopup && (
       <div className="popup">
         <div className="popup-content">
           <h3>✅ Devis généré !</h3>
           <p>Votre devis a été téléchargé avec succès.</p>

           <button onClick={() => setShowPopup(false)}>
             Fermer
           </button>
         </div>
       </div>
     )}
    </div>
  );
}

export default Preview;