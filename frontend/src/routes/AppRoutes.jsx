import { Routes, Route } from "react-router-dom";

import Home from "../componets/Home";
import AIChatDashboard from "../componets/AIChatDashboard";
import BookingFlow from "../componets/BookingFlow";
import CategoriesPage from "../pages/CategoriesPage";
import PaymentPage from "../componets/PaymentPage";
import Sidebar from "../componets/Sidebar";
import NotFound from "../componets/NotFound";
import ServAISplashUI from "../componets/ServAISplashUI";


function AppRoutes() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/" element={<ServAISplashUI />} />
      <Route path="/chatbot" element={<AIChatDashboard />} />
      <Route path="/booking" element={<BookingFlow />} />
      <Route path="/catogories" element={<CategoriesPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/sidebar" element={<Sidebar />} />

      {/* 404 Page */}
      <Route path="*" element={<NotFound/>} />
    </Routes>
  );
}

export default AppRoutes;