import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import FormDevis from "./pages/FormDevis";
import Review from "./pages/Review";
import PreviewDevis from "./pages/PreviewDevis";

function App() {
  return (
    <BrowserRouter>
      <Routes>
       <Route path="/" element={<Home />} />
       <Route path="/form" element={<FormDevis />} />
       <Route path="/review" element={<Review />} />
       <Route path="/preview" element={<PreviewDevis />} />
     </Routes>
    </BrowserRouter>
  );
}

export default App;