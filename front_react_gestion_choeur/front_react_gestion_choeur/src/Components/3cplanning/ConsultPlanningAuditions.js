import React, { useState, useEffect } from "react";
import axios from "axios";
import AppHeader from "../AppHeader";
import SideMenu from "../SideMenu";

const ITEMS_PER_PAGE = 10;

const ConsultPlanningAuditions = () => {
  const [formData, setFormData] = useState({
    dateDebut: "",
    dateFin: "",
    heureDebut: "",
    heureFin: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nouvellesAuditions, setNouvellesAuditions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [filterClicked, setFilterClicked] = useState(false);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePlanification = async () => {
    try {
      if (
        !formData.dateDebut ||
        !formData.dateFin ||
        !formData.heureDebut ||
        !formData.heureFin
      ) {
        setError("Tous les champs sont requis.");
        return;
      }
      const heureDebut = parseInt(formData.heureDebut);
      const heureFin = parseInt(formData.heureFin);
      const dateDebut = new Date(formData.dateDebut);
      const dateFin = new Date(formData.dateFin);
      if (heureDebut < 8 || heureDebut > 18 || heureFin < 8 || heureFin > 18) {
        setError("Les heures doivent être comprises entre 8h et 18h.");
        return;
      }
      if (heureDebut >= heureFin) {
        setError("L'heure de fin doit être supérieure à l'heure de début.");
        return;
      }
      if (dateDebut > dateFin) {
        setError("La date de fin doit être supérieure à la date de début.");
        return;
      }

      setLoading(true);
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        `http://localhost:3000/api/planningAudition?datedebut=${formData.dateDebut}&datefin=${formData.dateFin}&heuredebut=${formData.heureDebut}&heurefin=${formData.heureFin}`,
        config
      );

      console.log("Response:", response.data);

      if (response.data.auditions.length === 0) {
        setError("Aucune audition trouvée pour cette période.");
        setNouvellesAuditions(response.data.auditions);
      } else {
        setCurrentPage(1);
        setNouvellesAuditions(response.data.auditions);
        setError(null);
      }

      setLoading(false);
      setFilterClicked(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
      setError(
        "Une erreur s'est produite lors de la récupération des données."
      );
    }
  };

  useEffect(() => {
    fetchAllCandidates();
    setCurrentPage(1);
  }, []);
  const fetchAllCandidates = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        `http://localhost:3000/api/getallAuditionsCandidats`,
        config
      );
      const sortedAuditions = response.data.auditions.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        if (dateA.getTime() === dateB.getTime()) {
          return a.heure.localeCompare(b.heure);
        }

        return dateB - dateA;
      });

      // Update state with sorted auditions
      setNouvellesAuditions(sortedAuditions);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate the starting and ending indices for the current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(
    startIndex + ITEMS_PER_PAGE,
    nouvellesAuditions.length
  );

  // Get the auditions for the current page
  const paginatedAuditions = nouvellesAuditions.slice(startIndex, endIndex);

  // Calculate total pages
  const totalPages = Math.ceil(nouvellesAuditions.length / ITEMS_PER_PAGE);
  const handleReset = async () => {
    try {
      setFormData({
        dateDebut: "",
        dateFin: "",
        heureDebut: "",
        heureFin: "",
      });
      setError(null);
      setLoading(true); // Set loading state while fetching candidates
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        `http://localhost:3000/api/getallAuditionsCandidats`,
        config
      );
      const sortedAuditions = response.data.auditions.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        if (dateA.getTime() === dateB.getTime()) {
          return a.heure.localeCompare(b.heure);
        }

        return dateB - dateA;
      });

      setNouvellesAuditions(sortedAuditions);
      setCurrentPage(1);
      setLoading(false); // Reset loading state
      setFilterClicked(false);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setLoading(false); // Reset loading state
      setError(
        "Une erreur s'est produite lors de la récupération des candidats."
      );
    }
  };
  return (
    <div className="App1">
      <AppHeader />
      <div className="SideMenuAndPageContent">
        <SideMenu />

        <div class="container-fluid px-1 py-5 mx-auto">
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="form-outline">
                <label className="form-label" htmlFor="dateDebut">
                  Date Début :
                </label>
                <input
                  type="date"
                  id="dateDebut"
                  name="dateDebut"
                  value={formData.dateDebut}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-outline">
                <label className="form-label" htmlFor="dateFin">
                  Date Fin :
                </label>
                <input
                  type="date"
                  id="dateFin"
                  name="dateFin"
                  value={formData.dateFin}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="form-outline">
                <label className="form-label" htmlFor="heureDebut">
                  Heure Début :
                </label>
                <input
                  type="number"
                  id="heureDebut"
                  name="heureDebut"
                  value={formData.heureDebut}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-outline">
                <label className="form-label" htmlFor="heureFin">
                  Heure Fin :
                </label>
                <input
                  type="number"
                  id="heureFin"
                  name="heureFin"
                  value={formData.heureFin}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-md-12 justify-content-center">
              <br />
              <div class="text-center">
                <button
                  type="button"
                  onClick={handlePlanification}
                  className="btn btn-primary btn-block"
                >
                  {loading ? "Chargement..." : "Filtrer Planning des audition"}
                </button>
                {filterClicked && (
                  <button
                    onClick={handleReset}
                    className="btn btn-danger btn-block"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>
          {error && <p className="text-danger">Erreur: {error}</p>}
          {/* Pagination logic */}
          <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-center">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Précédent
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i}
                  className={`page-item ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Suivant
                </button>
              </li>
            </ul>
          </nav>

          <div className="col-md-9 mx-auto">
            <table className="table table-striped table-bordered table-responsive-lg">
              <thead className="thead-dark">
                <tr>
                  <th scope="col" className="bg-primary text-white">
                    Nom
                  </th>
                  <th scope="col" className="bg-primary text-white">
                    Prenom
                  </th>
                  <th scope="col" className="bg-primary text-white">
                    Email
                  </th>
                  <th scope="col" className="bg-primary text-white">
                    Jour
                  </th>
                  <th scope="col" className="bg-primary text-white">
                    Heure
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedAuditions.map((audition, index) => (
                  <tr key={index}>
                    <td>{audition.Candidat?.nom}</td>
                    <td>{audition.Candidat?.prenom}</td>
                    <td>{audition.Candidat?.email || "N/A"}</td>
                    <td>{audition.date}</td>
                    <td>{audition.heure}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultPlanningAuditions;
