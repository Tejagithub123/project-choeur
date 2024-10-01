import Dash from "./dash";
import Inventory from "./Pages/Inventory";

import AjoutAdu from "./Pages/audition";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Form from "./inscription";
import Customers from "./Pages/Customers";
import Nominations from "./Components/Nominations/Nominations";
import PlanificationAuditions from "./Components/3bplanning/planningAud";
import Login from "./Components/logtest/Login";
import ConsultPlanningAuditions from "./Components/3cplanning/ConsultPlanningAuditions";
import RepetitionTable from "./Components/tablerepetitions/RepetitionTable";
import ConfirmationPage from "../src/Components/tablerepetitions/ConfirmationPage";
import ConcertTable from "./Components/tableconcerts/ConcertTable";
import ConfirmationPageConcert from "./Components/tableconcerts/ConfirmationPageConcert";
import Tache3 from "./Components/Tache3/Tache3";
import Tache32 from "./Components/Tache32/Tache32";
import Tache33 from "./Components/Tache33/Tache33";
import Tache22 from "./Components/Tache22/Tache22";
import Tache30 from "./Components/Tache30/Tache30";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Dash />} />

      <Route
        path="/RepetitionsQR"
        element={<RepetitionTable></RepetitionTable>}
      />
      <Route path="/ConcertsQR" element={<ConcertTable></ConcertTable>} />

      <Route
        path="/PlanificationAuditions"
        element={<PlanificationAuditions></PlanificationAuditions>}
      />
      <Route
        path="/ConsultPlanificationAuditions"
        element={<ConsultPlanningAuditions></ConsultPlanningAuditions>}
      />

      <Route path="/Login" element={<Login />} />

      <Route path="/home" element={<Dash />} />
      <Route path="/inventory" element={<Inventory />} />

      <Route path="/AjoutE" element={<AjoutAdu />} />
      <Route path="/customers" element={<Customers />} />
      <Route path="/register" element={<Form />} />
      <Route path="/Nominations" element={<Nominations />} />

      <Route
        path="/repetition/:repetitionId/confirmation"
        element={<ConfirmationPage />}
      />
      <Route
        path="/concert/:concertId/confirmation"
        element={<ConfirmationPageConcert />}
      />

      <Route path="/tache3" element={<Tache3 />} />

      <Route path="/tache32" element={<Tache32 />} />

      <Route path="/tache33" element={<Tache33 />} />

      <Route path="/tache22" element={<Tache22 />} />
      <Route path="/tache30" element={<Tache30 />} />
    </Routes>
  );
}
export default App;
