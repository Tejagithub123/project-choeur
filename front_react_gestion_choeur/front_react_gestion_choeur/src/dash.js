import { Space } from "antd";
import "./App.css";
import AppFooter from "./Components/AppFooter";
import AppHeader from "./Components/AppHeader";

import SideMenu from "./Components/SideMenu";
import bgImg from "./assets/home.jpg";
function Dash() {
  return (
    <div className="ommm">
      <div className="App1">
        <AppHeader />
        <div className="SideMenuAndPageContent">
          <SideMenu></SideMenu>
        </div>
      </div>
    </div>
  );
}
export default Dash;
