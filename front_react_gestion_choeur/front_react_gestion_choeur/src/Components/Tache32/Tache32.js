import React, { useState, useEffect } from "react";
import { Table, Form, Container, Row, Col } from "react-bootstrap";
import AppHeader from "../../Components/AppHeader";
import SideMenu from "../../Components/SideMenu";
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function Tache32() {
  const [choristes, setChoristes] = useState([]);
  const [filterNom, setFilterNom] = useState("");
  const [filterPrenom, setFilterPrenom] = useState("");

  useEffect(() => {
    fetchChoristes();
  }, []);

  const fetchChoristes = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch(
        "http://localhost:3000/api/utilisateur/getallchoristes/s",
        config
      );

      if (!response.ok) {
        throw new Error("Failed to fetch choristes");
      }
      const data = await response.json();
      console.log("response", data);

      setChoristes(data);
    } catch (error) {
      console.error("Error fetching choristes:", error);
    }
  };
  console.log("choristes+");
  console.log(choristes);
  const filteredChoristes = choristes.filter(
    (choriste) =>
      choriste.nom.toLowerCase().includes(filterNom.toLowerCase()) &&
      choriste.prenom.toLowerCase().includes(filterPrenom.toLowerCase())
  );

  return (
    <div className="App1">
      <AppHeader />
      <div className="SideMenuAndPageContent">
        <SideMenu />
        <Container>
          <h2>Liste des Absences des Choristes</h2>
          <Row>
            <Col>
              <Form>
                <Form.Group controlId="filterNom">
                  <Form.Label>Filtre sur Nom:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Entrez le nom à filtrer"
                    value={filterNom}
                    onChange={(e) => setFilterNom(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="filterPrenom">
                  <Form.Label>Filtre sur Prénom:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Entrez le prénom à filtrer"
                    value={filterPrenom}
                    onChange={(e) => setFilterPrenom(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col>
              <Table striped bordered hover style={{ width: "18cm" }}>
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Absences</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredChoristes.map(
                    (choriste) =>
                      // Check if the choriste has any absence and if there's at least one with a reason
                      choriste.absence.length !== 0 &&
                      choriste.absence.some(
                        (absence) => absence.raison_absence
                      ) && (
                        <tr key={choriste._id}>
                          <td>{choriste.nom}</td>
                          <td>{choriste.prenom}</td>
                          <td>
                            <ul>
                              {choriste.absence.map(
                                (absence, index) =>
                                  // Render the absence only if there is a raison_absence
                                  absence.raison_absence && (
                                    <li
                                      key={index}
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                      }}
                                    >
                                      <div>
                                        Raison: {absence.raison_absence}
                                      </div>
                                      <div style={{ marginLeft: "1.5cm" }}>
                                        Dates absence:
                                        <ul>
                                          {absence.dates_absence.map(
                                            (date, dateIndex) => (
                                              <li key={dateIndex}>
                                                {formatDate(date)}
                                              </li>
                                            )
                                          )}
                                        </ul>
                                      </div>
                                    </li>
                                  )
                              )}
                            </ul>
                          </td>
                        </tr>
                      )
                  )}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default Tache32;
