import { BrowserRouter, Route, Routes } from "react-router-dom";
import Customers from "../../Pages/Customers";
import Dashboard from "../../Pages/Dashbaord";
import Inventory from "../../Pages/Inventory";
import Orders from "../../Pages/Orders";
import AjoutClient from"../../Pages/AjoutClient";
import AjoutEcrivain from "../../Pages/AjoutEcrivain";
import Dash from "../../dash";
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />}></Route>
      <Route path="/inventory" element={<Inventory />}></Route>
      <Route path="/orders" element={<Orders />}></Route>
      <Route path="/customers" element={<Customers />}></Route>
      <Route path="/AjoutC" element={<AjoutClient />}></Route>
      <Route path="/AjoutE" element={<AjoutEcrivain/>}></Route>
      <Route path="/dashboard" element={<Dash/>}></Route>
    </Routes>
  );
}
export default AppRoutes;
