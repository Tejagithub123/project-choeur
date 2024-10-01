import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AppHeader from "../../Components/AppHeader";
import SideMenu from "../../Components/SideMenu";
import imgs from "../../../src/images/choir1.jpg";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardImage,
} from "mdb-react-ui-kit";

const ConfirmationPageConcert = () => {
  const navigate = useNavigate();
  const { concertId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [concertInfo, setConcertInfo] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [choristeInfo, setChoristeInfo] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const confirmPresence = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const apiUrl = `http://localhost:3000/api/presenceConcert/${concertId}`;
      const response = await axios.post(apiUrl, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setConfirmationMessage(response.data.message);
      setConcertInfo(response.data.presence);

      // Récupérer les informations sur le choriste depuis la réponse
      const choristeInfoFromResponse = response.data.choriste;
      setChoristeInfo(choristeInfoFromResponse);
      setIsConfirmed(true);
    } catch (error) {
      console.error("Error confirming presence:", error);
      setError(error.response.data.error);
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
                  {loading && <Spinner animation="border" role="status" />}
                  {error && <Alert variant="danger">Error: {error}</Alert>}
                  <MDBCardTitle className="confirmation-title text-success">
                    Page de confirmation de présence du concert
                  </MDBCardTitle>

                  {confirmationMessage && (
                    <div className="mt-4">
                      <h2 className="text-primary">
                        Confirmation de présence pour le choriste au concert :
                      </h2>

                      {choristeInfo && (
                        <div>
                          <h4>Informations sur le choriste :</h4>
                          <p>
                            <strong>Nom :</strong> {choristeInfo.nom}
                          </p>
                          <p>
                            <strong>Prénom :</strong> {choristeInfo.prenom}
                          </p>
                          <p>
                            <strong>Email :</strong> {choristeInfo.email}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="mt-4">
                    <Button
                      onClick={confirmPresence}
                      variant="primary"
                      disabled={isConfirmed} // Désactiver le bouton si la présence est confirmée
                    >
                      {isConfirmed
                        ? "Présence confirmée"
                        : "Confirmer la présence"}
                    </Button>
                    <Button
                      onClick={handleBackToHome}
                      variant="danger"
                      style={{ marginLeft: "10px" }} // Ajouter un espace entre les boutons
                    >
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

export default ConfirmationPageConcert;
