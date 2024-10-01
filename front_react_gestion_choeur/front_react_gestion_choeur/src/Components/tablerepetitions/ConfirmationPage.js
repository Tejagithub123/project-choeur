import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./ConfirmationPage.css"; // Import custom CSS file for additional styling
import AppHeader from "../../Components/AppHeader";
import SideMenu from "../../Components/SideMenu";
import imgs from "../../../src/images/choir1.jpg";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardImage,
  MDBBtn,
} from "mdb-react-ui-kit";
const ConfirmationPage = () => {
  const navigate = useNavigate();
  const { repetitionId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [choristeInfo, setChoristeInfo] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  const confirmPresence = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const apiUrl = `http://localhost:3000/api/generateUrl/${repetitionId}/`;
      const response = await axios.post(apiUrl, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setConfirmationMessage(response.data.message);
      setChoristeInfo(response.data.choriste);
      setIsConfirmed(true);
    } catch (error) {
      setError(error.response.data.error);

      console.log("erors", error.response.data.error);
      console.log("error from back to print in alert", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="App1">
      <AppHeader />
      <div className="SideMenuAndPageContent">
        <SideMenu />
        <div className="container-fluid px-1 py-5 mx-auto">
          <div className="confirmation-page text-center">
            <Container className="confirmation-container">
              <MDBCard>
                <MDBCardImage src={imgs} position="top" alt="..." />
                <MDBCardBody>
                  <MDBCardTitle>Présence</MDBCardTitle>
                  <MDBCardTitle className="confirmation-title text-success">
                    Page de confirmation de présence pour la répétition.
                  </MDBCardTitle>

                  {loading && (
                    <Spinner
                      animation="border"
                      role="status"
                      className="spinner"
                    />
                  )}
                  {error && (
                    <Alert variant="danger" className="error-message">
                      Error: {error}
                    </Alert>
                  )}
                  {confirmationMessage && (
                    <div className="confirmation-info mt-4">
                      <h4 className="text-primary">
                        Confirmation de présence pour le choriste à la
                        répétition :
                      </h4>
                      <p>Informations du choriste présent:</p>
                      <p>
                        <strong>Choriste :</strong> {choristeInfo.nom}{" "}
                        {choristeInfo.prenom}
                      </p>
                      <p>
                        <strong>Email Choriste :</strong> {choristeInfo.email}
                      </p>
                    </div>
                  )}
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button
                      onClick={confirmPresence}
                      variant="primary"
                      disabled={isConfirmed} // Désactiver le bouton si la présence est confirmée
                    >
                      {isConfirmed
                        ? "Présence confirmée"
                        : "Confirmer la présence"}
                    </Button>
                    <Button onClick={handleBackToHome} variant="danger">
                      Quitter
                    </Button>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </Container>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
