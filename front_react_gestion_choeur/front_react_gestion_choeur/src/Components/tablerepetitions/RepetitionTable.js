import React, { useState, useEffect } from "react";
import axios from "axios";
import AppHeader from "../../Components/AppHeader";
import SideMenu from "../../Components/SideMenu";
import QRCode from "react-qr-code";
import { Link } from "react-router-dom";
import "./RepetitionTable.css";
import { toPng } from "html-to-image";

function RepetitionTable() {
  const [repetitions, setRepetitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [itemsPerPage] = useState(10); // Number of items per page
  const [choristes, setChoristes] = useState([]); // State to store choristes data

  useEffect(() => {
    fetchData();
    fetchChoristes();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3000/api/repetition/get/AllRepetitions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Filter repetitions for today
      const todayRepetitions = response.data.repetitions.filter(
        (repetition) => {
          const repetitionDate = new Date(repetition.date);
          const today = new Date();
          return (
            repetitionDate.getFullYear() === today.getFullYear() &&
            repetitionDate.getMonth() === today.getMonth() &&
            repetitionDate.getDate() === today.getDate()
          );
        }
      );

      setRepetitions(todayRepetitions);
    } catch (error) {
      console.error("Error fetching repetitions:", error);
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
      setChoristes(response.data.choristes);
      console.log("choristesle tout ", response.data.choristes);
    } catch (error) {
      console.error("Error fetching choristes:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = repetitions.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  // Function to download QR code
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
            <h2>Les Répétitions du jour</h2>
          </div>
          {repetitions.length === 0 ? (
            <div className="no-repetition-message">
              Pas de répétition prévues pour ce jour
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
                    QR répétition
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((repetition) => (
                  <tr key={repetition._id}>
                    <td className="column-size">{repetition.lieu}</td>
                    <td className="column-size">
                      {new Date().toISOString().split("T")[0]}
                    </td>
                    <td className="column-size">
                      {repetition.participants.map((participant) => {
                        // Find the corresponding choriste
                        const choriste = choristes.find(
                          (choriste) => choriste._id === participant._id
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
                    <td className="column-size1">
                      <div id="qrCodeContainer">
                        <QRCode
                          value={`http://localhost:3001/repetition/${repetition._id}/confirmation`}
                        />
                      </div>
                      <input
                        type="button"
                        className="download-btn btn btn-primary"
                        value="Download"
                        onClick={downloadQRCode}
                      />
                      <br></br>
                      <br></br>
                      <Link
                        to={`/repetition/${repetition._id}/confirmation`}
                        className="btn btn-primary scan-bt"
                        style={{ width: "40%" }}
                      >
                        Scan
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {/* Pagination */}
          <nav>
            <ul className="pagination">
              {Array.from(
                { length: Math.ceil(repetitions.length / itemsPerPage) },
                (_, i) => (
                  <li
                    key={i}
                    className={`page-item ${
                      currentPage === i + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      onClick={() => paginate(i + 1)}
                      className="page-link "
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

export default RepetitionTable;
