import { useState } from "react";
import PreviewDevis from "./PreviewDevis";
import { useNavigate } from "react-router-dom";



import html2pdf from "html2pdf.js";

function FormDevis() {

  const navigate = useNavigate();

  // 🔹 CLIENT
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // 🔹 DEVIS
  const [eventType, setEventType] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [guestCount, setGuestCount] = useState("");

  // 🔹 IMAGES
  const [logo, setLogo] = useState(null);
  const [stamp, setStamp] = useState(null);

  const handleSubmit = (e) => {
  e.preventDefault();

    const formData = {
      firstName,
      lastName,
      email,
      phone,
      eventType,
      eventDate,
      eventLocation,
      guestCount,
    };

    navigate("/review", { state: formData });
  };

  const generatePDF = () => {
    const element = document.getElementById("preview");
    html2pdf().from(element).save();
  };

  return (
   <div className="card">
     <h2>Créer un devis</h2>

     <form onSubmit={handleSubmit}>
       <h3>Client</h3>

       <input placeholder="Prénom" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
       <input placeholder="Nom" value={lastName} onChange={(e) => setLastName(e.target.value)} />
       <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
       <input placeholder="Téléphone" value={phone} onChange={(e) => setPhone(e.target.value)} />

       <h3>Événement</h3>

       <input placeholder="Type d'événement" value={eventType} onChange={(e) => setEventType(e.target.value)} />
       <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
       <input placeholder="Lieu" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} />
       <input type="number" placeholder="Invités" value={guestCount} onChange={(e) => setGuestCount(e.target.value)} />

       <button type="submit">Continuer</button>
     </form>
   </div>
 );
}

export default FormDevis;