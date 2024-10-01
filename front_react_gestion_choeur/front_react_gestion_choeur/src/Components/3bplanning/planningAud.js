import React, { useState } from "react";
import axios from "axios";
import AppHeader from "../AppHeader";
import SideMenu from "../SideMenu";
import Table from "react-bootstrap/Table";
const PlanificationAuditions = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [nouvellesAuditions, setNouvellesAuditions] = useState([]);

  const [formData, setFormData] = useState({
    heureDebut: "",
    jourDebut: "",
    jourFin: "",
    nbHeures: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    let errorMessage = "";

    // Contrôle de saisie pour l'heure
    if (name === "heureDebut") {
      const isValidHour = /^(?:0?[8-9]|1[0-8])$/.test(value);
      if (!isValidHour) {
        errorMessage = "L'heure doit être un nombre entre 8H et 18H";
      }
    }
    // Contrôle de saisie pour nbheures
    if (name === "nbHeures") {
      const isValidHour = /^(?:[1-9]|10)$/.test(value);
      if (!isValidHour) {
        errorMessage = "Le nombre de sénace doit être un nombre entre 1 et 10";
      }
    }

    // Mettre à jour le state avec les nouvelles valeurs et le message d'erreur
    setFormData({ ...formData, [name]: value });
    setError(errorMessage);
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handlePlanification = async () => {
    try {
      // Vérifier si les champs sont vides ou s'il y a une erreur de validation
      if (
        !formData.heureDebut.trim() ||
        !formData.jourDebut.trim() ||
        !formData.jourFin.trim() ||
        !formData.nbHeures.trim() ||
        error
      ) {
        setError("Veuillez remplir tous les champs correctement.");
        return;
      }

      const dateDebut = new Date(formData.jourDebut);
      const dateFin = new Date(formData.jourFin);

      if (dateDebut > dateFin) {
        setError("La date de fin doit être supérieure à la date de début.");
        return;
      }

      // Vérifier si l'heure est au format valide
      const isValidHour = /^(?:[1-9]|10)$/.test(formData.nbHeures);
      if (!isValidHour) {
        setError("Le nombre de sénace doit être un nombre entre 1 et 10");
        return;
      }
      const isValidHours = /^(?:0?[8-9]|1[0-8])$/.test(formData.heureDebut);
      if (!isValidHours) {
        setError(
          "L'heure de début de séance doit être un nombre entre 8h et 18h"
        );
        return;
      }
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        "http://localhost:3000/api/planifier3",
        formData,
        config
      );

      if (response.status === 204) {
        setError("Aucun candidat sans audition trouvé.");
      } else {
        setError(null);
        setNouvellesAuditions((prevAuditions) => [
          ...prevAuditions,
          ...response.data,
        ]);
        setSuccess(true);
      }

      setLoading(false);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred while processing your request.");
      }

      setLoading(false);
    }
  };

  return (
    <div className="App1">
      <AppHeader></AppHeader>
      <div className="SideMenuAndPageContent">
        <SideMenu></SideMenu>

        <div class="container-fluid px-1 py-5 mx-auto">
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="form-outline">
                <label className="form-label" htmlFor="heureDebut">
                  Heure de début :
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
                <label className="form-label" htmlFor="jourDebut">
                  Jour de début :
                </label>
                <input
                  type="date"
                  id="jourDebut"
                  name="jourDebut"
                  value={formData.jourDebut}
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
                <label className="form-label" htmlFor="jourFin">
                  Jour de fin :
                </label>
                <input
                  type="date"
                  id="jourFin"
                  name="jourFin"
                  value={formData.jourFin}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-outline">
                <label className="form-label" htmlFor="nbHeures">
                  Nombre de séances:
                </label>
                <input
                  type="number"
                  id="nbHeures"
                  name="nbHeures"
                  value={formData.nbHeures}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-md-12 justify-content-center">
              <div class="text-center">
                <button
                  type="submit"
                  onClick={handlePlanification}
                  className="btn btn-primary btn-block"
                >
                  {loading
                    ? "Chargement..."
                    : success
                    ? "Planification les auditions"
                    : "Planification les auditions"}
                </button>
              </div>
            </div>
          </div>

          {error && <p className="text-danger">Erreur: {error}</p>}
          {success && (
            <div>
              {nouvellesAuditions.length > 0 ? (
                <div class="col-md-9 mx-auto">
                  {/* <p className="">Planification réussie!</p> */}
                  <table class="table table-striped table-bordered table-responsive-lg">
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
                      {nouvellesAuditions.map((audition, index) => (
                        <tr key={index}>
                          <td>{audition.nom}</td>
                          <td>{audition.prenom}</td>
                          <td>{audition.email}</td>
                          <td>{audition.jour}</td>
                          <td>{audition.heureDebut}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center alert alert-warning">
                  Pas de nouveaux candidats à planifier auditions
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default PlanificationAuditions;
