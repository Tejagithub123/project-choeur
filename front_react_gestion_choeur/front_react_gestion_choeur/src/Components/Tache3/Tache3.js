import Table from "react-bootstrap/Table";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AppHeader from "../../Components/AppHeader";
import SideMenu from "../../Components/SideMenu";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const Tache3 = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [candidatsIds, setcandidatsIds] = useState(new Set());
  const [dateDebutauditions, setdateDebutauditions] = useState(new Date());
  const [heureDebutauditions, setheureDebutauditions] = useState("00");
  const [jourFin, setjourFin] = useState(new Date());
  const [nbHeures, setnbHeures] = useState("00");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);

  const pageSize = 7;

  const fetchData = async () => {
    setLoading(true);
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        `http://localhost:3000/api/Condidat/getAll`,
        config
      );
      const { model } = response.data;
      console.log("this is model", model);
      // Filter out candidates with decision: "attente"
      const unconfirmedCandidates = model.filter(
        (candidate) =>
          candidate.auditions.length != 0 &&
          candidate.auditions[0].décision === "En attente" &&
          new Date(candidate.auditions[0].date) < today - 1 // Filter by auditions date before today
      );
      console.log(unconfirmedCandidates);
      // Sort candidates by auditions date
      unconfirmedCandidates.sort((a, b) => {
        const dateA = new Date(a.auditions[0].date);
        const dateB = new Date(b.auditions[0].date);

        if (dateA.getTime() === dateB.getTime()) {
          // If dates are equal, sort by heure
          return a.auditions[0].heure.localeCompare(b.auditions[0].heure);
        }
        return dateA - dateB;
      });

      console.log("Unconfirmed Candidates:", unconfirmedCandidates);
      setData(unconfirmedCandidates);
      setSearchResults(unconfirmedCandidates); // Update search results as well
    } catch (error) {
      console.error("Error fetching unconfirmed candidates:", error.message);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCheckboxChange = (id) => {
    const updatedIds = new Set(candidatsIds);

    if (updatedIds.has(id)) {
      updatedIds.delete(id);
    } else {
      updatedIds.add(id);
    }

    setcandidatsIds(updatedIds);
    console.log("List of candidate IDs:", Array.from(updatedIds));
  };

  const handleDateChange = (date) => {
    setdateDebutauditions(date);
  };
  const handleDateChangeF = (date) => {
    setjourFin(date);
  };

  const handleHourChange = (hour) => {
    setheureDebutauditions(hour);
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const handleSubmit = async () => {
    try {
      if (nbHeures === "00") {
        alert("Nombre de séance should be greater than 0");
        return;
      }
      if (dateDebutauditions > jourFin) {
        alert("Date Début should be lower than the date Fin");
        return;
      }

      if (candidatsIds.size === 0) {
        alert("Select condidat SVP");
        return;
      }
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(
        "http://localhost:3000/api/updateauditions",
        {
          candidatsIds: Array.from(candidatsIds),
          dateDebutAudition: formatDate(dateDebutauditions),
          jourFin: formatDate(jourFin),
          heureDebutAudition: heureDebutauditions,
          nbHeures: nbHeures,
        },
        config
      );

      const { message } = response.data;
      // Display the success message to the user
      alert(message);
      // console.log("PUT Request Response:", response.data);
      // After successful submission, reload the data
      fetchData();
      setcandidatsIds(new Set()); // Reset the selected candidates
      setSearchEmail("");
    } catch (error) {
      console.error("PUT Request Error:", error);
      // Display the error message to the user
      alert(
        error.response.data.message ||
          "An error occurred while processing your request."
      );
    }
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const results = data.filter((item) =>
      item.email.toLowerCase().includes(searchValue)
    );
    setSearchEmail(searchValue);
    setSearchResults(results);
  };

  const handlePrevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const handleNextPage = () => {
    if (searchResults.length > pageSize * pageNumber) {
      setPageNumber(pageNumber + 1);
    }
  };

  console.log("Selected Date:", formatDate(dateDebutauditions));
  console.log("Selected Hour:", heureDebutauditions);
  console.log("Selected DateFin:", formatDate(jourFin));
  console.log("Selected Nbre Séance:", nbHeures);

  return (
    <div className="App1">
      <AppHeader />
      <div className="SideMenuAndPageContent">
        <SideMenu />
        <div className="w-full " style={{ marginLeft: "5%", marginTop: "2%" }}>
          <div className="container">
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="form-outline">
                  <label htmlFor="date">Select Date Début:</label>
                  <input
                    type="date"
                    id="date"
                    value={dateDebutauditions.toISOString().split("T")[0]}
                    onChange={(e) => handleDateChange(new Date(e.target.value))}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-outline">
                  <label htmlFor="hour">Select Hour:</label>
                  <Form.Select
                    aria-label="Default select example"
                    id="hour"
                    value={heureDebutauditions}
                    onChange={(e) => setheureDebutauditions(e.target.value)}
                  >
                    {[...Array(24).keys()].map((hour) => (
                      <option
                        key={hour}
                        value={hour.toString().padStart(2, "0")}
                      >
                        {hour.toString().padStart(2, "0")}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-outline">
                  <label htmlFor="date">Select Date Fin:</label>
                  <input
                    type="date"
                    id="jourFin"
                    value={jourFin.toISOString().split("T")[0]}
                    onChange={(e) =>
                      handleDateChangeF(new Date(e.target.value))
                    }
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-md-6" style={{ marginBottom: 10 }}>
                <div className="form-outline">
                  <label htmlFor="hour">Select Nbre Séance:</label>
                  <Form.Select
                    aria-label="Default select example"
                    id="nbHeures"
                    value={nbHeures}
                    onChange={(e) => setnbHeures(e.target.value)}
                  >
                    {[...Array(24).keys()].map((hour) => (
                      <option
                        key={hour}
                        value={hour.toString().padStart(2, "0")}
                      >
                        {hour.toString().padStart(2, "0")}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </div>
              <div>
                <Button variant="primary" onClick={handleSubmit}>
                  {" "}
                  Submit
                </Button>{" "}
              </div>

              <br />
              <div
                class="form-outline"
                data-mdb-input-init
                style={{ marginTop: 12 }}
              >
                <label htmlFor="searchEmail">Search by Email:</label>
                <input
                  type="text"
                  id="searchEmail"
                  class="form-control"
                  placeholder="Type Email"
                  value={searchEmail}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>
          <Table striped style={{ margin: 0 }}>
            <thead>
              <tr>
                <th> Nom </th>
                <th> Prenom </th>
                <th> Email </th>
                <th> Decision </th>
                <th> date</th>
                <th> heure </th>
                <th> Actions </th>
              </tr>
            </thead>
            <tbody>
              {(searchResults.length > 0
                ? searchResults.slice(
                    (pageNumber - 1) * pageSize,
                    pageNumber * pageSize
                  )
                : data.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
              ).map((item) => (
                <tr>
                  <td> {item.nom} </td>
                  <td> {item.prenom} </td>
                  <td> {item.email} </td>
                  <td> {item.auditions[0].décision} </td>
                  <td>
                    {item.auditions[0]
                      ? formatDate(new Date(item.auditions[0].date))
                      : ""}
                  </td>

                  <td> {item.auditions[0].heure} </td>
                  <td>
                    <center>
                      <input
                        type="checkbox"
                        checked={candidatsIds.has(item._id)}
                        onChange={() => handleCheckboxChange(item._id)}
                      />
                    </center>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <center>
            <div style={{ marginTop: 5 }}>
              <button onClick={handlePrevPage} disabled={pageNumber === 1}>
                Prev
              </button>
              <span> Page {pageNumber}</span>
              <button
                onClick={handleNextPage}
                disabled={searchResults.length <= pageSize * pageNumber}
              >
                Next
              </button>
            </div>
          </center>
        </div>
      </div>
    </div>
  );
};

export default Tache3;
