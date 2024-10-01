import React, { useState } from "react";
import AppHeader from "../AppHeader";
import SideMenu from "../SideMenu";
import "./Nominations.css";
const Nominations = () => {
  const [seuilNominationRepetition, setSeuilNominationRepetition] =
    useState("");
  const [seuilNominationConcert, setSeuilNominationConcert] = useState("");
  const [nominations, setNominations] = useState([]);
  const [selectedNomineesDetails, setSelectedNomineesDetails] = useState([]);
  const [showNominations, setShowNominations] = useState(false);
  const handleSeuilSubmit = async (e) => {
    e.preventDefault();
    try {
      // Set seuil for repetition
      await fetch("http://localhost:3000/api/repetition/seuils", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          seuilNomination: parseFloat(seuilNominationRepetition),
        }),
      });

      // Set seuil for concert
      await fetch("http://localhost:3000/concerts/seuils", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          seuilNomination: parseFloat(seuilNominationConcert),
        }),
      });

      // Fetch nominations
      fetchNominations();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchNominations = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/nomines/show", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch nominations");
      }
      const data = await response.json();
      setNominations(data.nominations);
      setShowNominations(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheckboxChange = (index) => {
    setNominations((prevNominations) => {
      const updatedNominations = [...prevNominations];
      updatedNominations[index] = {
        ...updatedNominations[index],
        isChecked: !updatedNominations[index].isChecked,
      };
      return updatedNominations;
    });
  };

  const handleSelectNominees = async () => {
    try {
      const selectedNominees = nominations
        .filter((nominee) => nominee.isChecked)
        .map((nominee) => nominee._id);
      console.log(selectedNominees);
      // Call the API to update the state of selected nominees
      const response = await fetch(
        "http://localhost:3000/api/utilisateur/selectNominees",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ selectedNominees }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to select nominees");
      }

      console.log("Nominees successfully selected");
      const nomineesDetailsResponse = await response.json();
      setSelectedNomineesDetails(nomineesDetailsResponse.nomineesDetails);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App1">
      <AppHeader />
      <div className="SideMenuAndPageContent">
        <SideMenu />
        <div className="container-fluid px-1 py-5 mx-auto">
          <div className="text-center">
            <h2>Nominations</h2>

            <div className="row mb-2">
              <form onSubmit={handleSeuilSubmit} className="row g-3">
                <div className="col-sm-6">
                  <label className="form-label">Seuil Repetitions</label>
                  <input
                    type="number"
                    className="form-control"
                    value={seuilNominationRepetition}
                    onChange={(e) =>
                      setSeuilNominationRepetition(e.target.value)
                    }
                  />
                </div>
                <div className="col-sm-6">
                  <label className="form-label">Seuil Concerts</label>
                  <input
                    type="number"
                    className="form-control"
                    value={seuilNominationConcert}
                    onChange={(e) => setSeuilNominationConcert(e.target.value)}
                  />
                </div>
                <div className="col-sm-12 text-center">
                  <button type="submit" className="bouton btn btn-primary">
                    Générer nominés selon seuils
                  </button>
                </div>
              </form>
            </div>

            {showNominations && (
              <div>
                <table className="table table-striped table-bordered table-responsive-lg">
                  <thead className="thead-dark">
                    <tr>
                      <th className="bg-primary text-white">Nom</th>
                      <th className="bg-primary text-white">Email</th>
                      <th className="bg-primary text-white">
                        Absence Repetition(%)
                      </th>
                      <th className="bg-primary text-white">
                        Absence Concert(%)
                      </th>
                      <th className="bg-primary text-white">
                        Nominés Repetition
                      </th>
                      <th className="bg-primary text-white">Nominés Concert</th>
                      <th className="bg-primary text-white">Choisir</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nominations.map((choriste, index) => (
                      <tr key={index}>
                        <td>{choriste.name}</td>
                        <td>{choriste.email}</td>
                        <td>{choriste.repetitionAbsencePercentage}</td>
                        <td>{choriste.concertAbsencePercentage}</td>
                        <td>{choriste.isNominatedForRepetition.toString()}</td>
                        <td>{choriste.isNominatedForConcert.toString()}</td>
                        <td>
                          {choriste.isNominatedForRepetition ||
                          choriste.isNominatedForConcert ? (
                            <input
                              type="checkbox"
                              onChange={() => handleCheckboxChange(index)}
                              checked={choriste.isChecked || false}
                            />
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  className="btn btn-primary btn-block"
                  onClick={handleSelectNominees}
                >
                  Nominer les choristes sélectionnés
                </button>
                {selectedNomineesDetails.length > 0 && (
                  <div>
                    <h2>Liste des nominés</h2>
                    <table className="table table-striped table-bordered table-responsive-lg">
                      <thead className="thead-dark">
                        <tr>
                          <th className="bg-primary text-white">Nom</th>
                          <th className="bg-primary text-white">Prénom</th>
                          <th className="bg-primary text-white">Email</th>
                          <th className="bg-primary text-white">Etat</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedNomineesDetails.map((nominee, index) => (
                          <tr key={index}>
                            <td>{nominee.nom}</td>
                            <td>{nominee.prenom}</td>
                            <td>{nominee.email}</td>
                            <td>{nominee.etat}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nominations;
