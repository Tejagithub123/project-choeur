import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { set } from "react-hook-form";
import AppHeader from "../../Components/AppHeader";
import SideMenu from "../../Components/SideMenu";
const Tache33 = () => {
  const [email, setEmail] = useState("");
  const [choristes, setChoristes] = useState([]);
  const [emailExists, setEmailExists] = useState(true);
  const [disciplinaryReason, setDisciplinaryReason] = useState("");
  const [requestSent, setRequestSent] = useState(false); // New state variable
  const [errorMsg, setErrorMsg] = useState("");
  const [errorMsgEmail, setErrorMsgEmail] = useState("");
  // Function to check if email exists in choristes list
  const checkEmailExists = async () => {
    try {
      if (email.length == 0) {
        setRequestSent(false);
        setErrorMsgEmail("You should write an Email");
        return null;
      } else if (disciplinaryReason.length == 0) {
        setRequestSent(false);
        setErrorMsg("You should write a raison");
        return null;
      }
      setErrorMsgEmail("");
      setErrorMsg("");
      setEmail("");
      setDisciplinaryReason("");
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch(
        "http://localhost:3000/api/utilisateur/getchoristes",
        config
      );
      const data = await response.json();
      setChoristes(data);

      const exists = data.choristes.find(
        (choriste) => choriste.email === email
      );
      setEmailExists(exists);
      if (exists) {
        const config = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            disciplinaryReason: disciplinaryReason,
          }),
        };
        const response = await fetch(
          `http://localhost:3000/api/utilisateur/eliminerchoriste/${exists._id}`,
          config
        );

        if (response.ok) {
          setRequestSent(true); // Set request sent state to true
        } else {
          setRequestSent(false);
        }
      }
    } catch (error) {
      console.error("Error checking email:", error);
    }
  };

  return (
    <div className="App1">
      <AppHeader />
      <div className="SideMenuAndPageContent">
        <SideMenu />
        <div className="container">
          <div className="mb-3">
            <label htmlFor="emailInput" className="form-label">
              Enter Email:
            </label>
            <input
              type="email"
              className="form-control"
              id="emailInput"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {errorMsgEmail && <p className="error-message">{errorMsgEmail}</p>}
          {!emailExists && <p>Email doesn't exist in the list!</p>}

          {/* New conditional rendering */}
          <div className="mb-3">
            <label htmlFor="disciplinaryReasonInput" className="form-label">
              Disciplinary Reason:
            </label>
            <input
              type="text"
              className="form-control"
              id="disciplinaryReasonInput"
              value={disciplinaryReason}
              onChange={(e) => setDisciplinaryReason(e.target.value)}
            />
            {errorMsg && <p className="error-message">{errorMsg}</p>}
            {requestSent && <p>Request sent with success!</p>}{" "}
            <button className="btn btn-primary" onClick={checkEmailExists}>
              Send Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tache33;
