import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode properly
function Tache30() {
  const [cronExpression, setCronExpression] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [storedToken, setStoredToken] = useState("");
  const [userId, setUserId] = useState("");
  const [notifTimer, setNotifTimer] = useState("");

  const handleInputChange = (event) => {
    const timeValue = event.target.value;
    const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
    setCronExpression(`${currentDate}T${timeValue}`);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent page reload
    try {
      const storedTokenValue = localStorage.getItem("token");
      if (storedTokenValue && storedTokenValue !== "null") {
        const decodedToken = jwtDecode(storedTokenValue);
        const currentUserId = decodedToken.userId || userId;

        // Send the cron expression to the backend
        const response = await axios.patch(
          "http://localhost:3000/api/utilisateur/updateSchedule",
          {
            schedulNotif: cronExpression,
            userId: currentUserId,
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

  useEffect(() => {
    const storedTokenValue = localStorage.getItem("token");
    if (storedTokenValue && storedTokenValue !== "null") {
      setStoredToken(storedTokenValue);
      const decodedToken = jwtDecode(storedTokenValue);
      const currentUserId = decodedToken.userId;
      setUserId(currentUserId);

      const fetchData = async () => {
        try {
          const response = await axios.get(
            "http://localhost:3000/api/utilisateur/getuser",
            {
              params: {
                userId: currentUserId,
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
      }, 30000); // Fetch data every 30 seconds
      return () => {
        clearInterval(interval);
      };
    }
  }, [userId]);

  return (
    <div>
      <h2>Configure date de rappel répétition</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="cronExpression">Date de rappel:</label>
        <input
          type="time"
          id="cronExpression"
          value={cronExpression.split("T")[1] || ""} // Only show time part
          onChange={handleInputChange}
        />

        <button type="submit">Submit</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
}

export default Tache30;
