import { useForm } from "react-hook-form";
import AppHeader from "../../Components/AppHeader";
import SideMenu from "../../Components/SideMenu";
import React, { useEffect, useState } from "react";
import swal from "sweetalert";
import img from "../../assets/ecrvain.png";

<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
/>;

function AjoutEcrivain() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [prenom, setPrenom] = useState("");
  const [Num_tel, setNum_tel] = useState("");
  const regEx = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g;

  const [error, setError] = useState(false);
  const [errorss, setErrors] = useState(false);
  async function Add() {
    if (
      !email ||
      !password ||
      password.length < 6 ||
      Num_tel < 8 ||
      !nom ||
      !prenom ||
      !regEx.test(email) ||
      Num_tel < 0
    ) {
      setError(true);
      setErrors(false);
      return false;
    }

    let item = { nom, email, prenom, Num_tel, password };
    console.warn(item);

    let result = await fetch("http://localhost:3001/api/ajoutEcrivain", {
      method: "POST",
      body: JSON.stringify(item),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    result = await result.json();
    console.warn(result);
    if (result) {
      swal.fire("Good job!", "You clicked the button!", "success");
    } else {
      swal({
        title: "Echec d'ajout' ",

        icon: "warning",
        buttons: true,
        dangerMode: true,
      });
    }
  }

  return (
    <section>
      <div className="App1">
        <AppHeader></AppHeader>
        <div className="SideMenuAndPageContent">
          <SideMenu></SideMenu>
          <div className="registers">
            <div className="col-11">
              <form id="forms" className="flex flex-col" action="#">
                <input
                  type="text"
                  placeholder="Nom"
                  onChange={(e) => setNom(e.target.value)}
                />
                {error && !nom && (
                  <span className="eroor">
                    {" "}
                    &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                    <b>champ obligatoire*</b>
                  </span>
                )}

                <input
                  type="text"
                  placeholder="Prenom"
                  className="i1"
                  onChange={(e) => setPrenom(e.target.value)}
                ></input>
                {error && !prenom && (
                  <span className="eroor">
                    {" "}
                    &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                    <b>champ obligatoire*</b>
                  </span>
                )}

                <input
                  type="text"
                  placeholder="Numéro du téléphone"
                  onChange={(e) => setNum_tel(e.target.value)}
                />

                {error && Num_tel.length < 8 && (
                  <span className="eroor">
                    <b>Numéro du téléphone doit contenir 8 chiffres</b>
                  </span>
                )}
                {error && Num_tel < 0 && (
                  <span className="eroor">
                    {" "}
                    &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                    <b>Numéro du téléphone doit étre posistive </b>
                  </span>
                )}

                <input
                  type="text"
                  placeholder="Email"
                  className="i1"
                  onChange={(e) => setEmail(e.target.value)}
                ></input>
                {error && !email && (
                  <span className="eroor">
                    {" "}
                    &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                    <b>champ obligatoire*</b>
                  </span>
                )}
                {error && !regEx.test(email) && (
                  <span className="eroor">
                    {" "}
                    &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                    <b>email invalide</b>
                  </span>
                )}

                <input
                  type="text"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />

                {error && password.length < 6 && (
                  <span className="eroor">
                    <b>Mot de passe doit contenir minimum 6 caractéres </b>
                  </span>
                )}

                <button className="btn" onClick={() => Add()}>
                  Ajouter
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default AjoutEcrivain;
