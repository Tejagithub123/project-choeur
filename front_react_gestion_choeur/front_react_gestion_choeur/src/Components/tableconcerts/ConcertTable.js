import React, { useState, useEffect } from "react";
import axios from "axios";
import AppHeader from "../../Components/AppHeader";
import SideMenu from "../../Components/SideMenu";
import QRCode from "react-qr-code";
import { Link } from "react-router-dom";
import "./ConcertTable.css";
import { toPng } from "html-to-image";
function ConcertTable() {
  const [concerts, setConcerts] = useState([]);
  const [choristes, setChoristes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchData();
    fetchChoristes();
  }, []);
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3000/concerts/getallconcerts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Filter concerts for today
      const today = new Date().toISOString().split("T")[0];
      const filteredConcerts = response.data.model.filter(
        (concert) =>
          new Date(concert.date).toISOString().split("T")[0] === today
      );

      setConcerts(filteredConcerts);
      console.log("concerts", filteredConcerts);
      filteredConcerts.forEach((concert) => {
        console.log("Concert participants:", concert.participants);
      });
    } catch (error) {
      console.error("Error fetching concerts:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  const fetchChoristes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3000/api/utilisateur/getchoristesall",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setChoristes(response.data.choristes); // Update to set choristes as an array
      console.log("choristesData", response.data.choristes);
    } catch (error) {
      console.error("Error fetching choristes:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = concerts.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const downloadQRCode = () => {
    // Select the div containing the QR code
    const qrCodeContainer = document.getElementById("qrCodeContainer");

    // Use html-to-image to capture the element and convert it to an image
    toPng(qrCodeContainer)
      .then(function (dataUrl) {
        // Create a temporary link element
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "QR_Code.png";

        // Trigger the download
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
      })
      .catch(function (error) {
        console.error("Error generating QR code image:", error);
      });
  };

  return (
    <div className="App1">
      <AppHeader />
      <div className="SideMenuAndPageContent">
        <SideMenu />
        <div className="container-fluid px-1 py-5 mx-auto">
          <div className="text-center">
            <h2>Les concerts du jour</h2>
          </div>
          {concerts.length === 0 ? (
            <div className="no-concert-message">
              Pas de concerts prévus pour aujourd'hui
            </div>
          ) : (
            <table className="table table-striped table-bordered table-responsive-lg">
              <thead className="thead-dark">
                <tr>
                  <th scope="col" className="bg-primary text-white">
                    Lieu
                  </th>
                  <th scope="col" className="bg-primary text-white">
                    Date
                  </th>
                  <th scope="col" className="bg-primary text-white">
                    Participants
                  </th>
                  <th scope="col" className="bg-primary text-white">
                    QR Code
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((concert) => (
                  <tr key={concert._id}>
                    <td>{concert.lieu}</td>
                    <td>
                      {new Date(concert.date).toISOString().split("T")[0]}
                    </td>
                    <td>
                      {concert.participants.map((participant) => {
                        // Find the corresponding choriste
                        const choriste = choristes.find(
                          (choriste) => choriste._id === participant.choriste
                        );
                        // If choriste is found, display their name, otherwise display "Unknown Choriste"
                        return (
                          <div key={participant._id}>
                            {choriste
                              ? `${choriste.nom} ${choriste.prenom}`
                              : "Unknown Choriste"}
                          </div>
                        );
                      })}
                    </td>
                    <td>
                      <div className="confirmation-container">
                        <div id="qrCodeContainer">
                          <QRCode
                            value={`http://localhost:3001/concert/${concert._id}/confirmation`}
                          />
                        </div>

                        <input
                          type="button"
                          className="download-btn btn btn-primary"
                          value="Download"
                          onClick={downloadQRCode}
                        />
                        <br></br>

                        <Link
                          to={`/concert/${concert._id}/confirmation`}
                          className="btn btn-primary scan-bt"
                        >
                          Scan
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <nav>
            <ul className="pagination">
              {Array.from(
                { length: Math.ceil(concerts.length / itemsPerPage) },
                (_, i) => (
                  <li
                    key={i}
                    className={`page-item ${
                      currentPage === i + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      onClick={() => paginate(i + 1)}
                      className="page-link"
                    >
                      {i + 1}
                    </button>
                  </li>
                )
              )}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default ConcertTable;
