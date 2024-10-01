import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode properly
import SideMenu from "../SideMenu";
import AppHeader from "../AppHeader";
function Tache22() {
  const [cronExpression, setCronExpression] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [storedToken, setStoredToken] = useState("");
  const [userId, setUserId] = useState("");

  const handleInputChange = (event) => {
    setCronExpression(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent page reload
    try {
      const storedTokenValue = localStorage.getItem("token");
      if (storedTokenValue && storedTokenValue !== "null") {
        const decodedToken = jwtDecode(storedTokenValue);
        setUserId(decodedToken.userId);

        // Send the cron expression to the backend
        const response = await axios.patch(
          "http://localhost:3000/api/utilisateur/updateSchedule",
          {
            schedulNotif: cronExpression,
            userId: userId,
          }
        );
        setNotifTimer(cronExpression);
        setResponseMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error submitting cron expression:", error);
      setResponseMessage("Error: Unable to submit cron expression");
    }
  };
  ///////////////////////////////////

  // const executeCronTask = async () => {
  //   try {
  //     const decodedToken = jwtDecode(storedToken);
  //     await axios.get(
  //       "http://localhost:3000/api/utilisateur/rappelrepetition",
  //       {
  //         params: {
  //           userId: decodedToken.userId,
  //         },
  //       }
  //     );
  //     console.log("Cron task executed successfully");
  //   } catch (error) {
  //     console.error("Error executing cron task:", error);
  //   }
  // };
  // useEffect(() => {
  //   // Cleanup interval on component unmount
  // });

  ///////////////////////////////////////////////
  const [notifTimer, setNotifTimer] = useState("");
  useEffect(() => {
    const storedTokenValue = localStorage.getItem("token");
    if (storedTokenValue && storedTokenValue !== "null") {
      setStoredToken(storedTokenValue);
      const decodedToken = jwtDecode(storedTokenValue);
      setUserId(decodedToken.userId);

      const fetchData = async () => {
        try {
          const response = await axios.get(
            "http://localhost:3000/api/utilisateur/getuser/user",
            {
              params: {
                userId: decodedToken.userId,
              },
            }
          );
          setNotifTimer(response.data[0].schedulNotif);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      const interval = setInterval(() => {
        fetchData();
      }, 3000); // Fetch data every 30 seconds
      return () => {
        clearInterval(interval);
      };
    }
  }, [userId, notifTimer]);

  return (
    <div className="App1">
      <AppHeader />
      <div className="SideMenuAndPageContent">
        <SideMenu />
        <h2>Configure date de rappel répétition</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="cronExpression">Date de rappel:</label>
          <input
            type="datetime-local"
            id="cronExpression"
            value={cronExpression}
            onChange={handleInputChange}
          />
          <button type="submit">Submit</button>
        </form>
        {responseMessage && <p>{responseMessage}</p>}
      </div>
    </div>
  );
}

export default Tache22;
