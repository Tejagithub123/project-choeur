import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  MDBContainer,
  MDBInput,
  MDBCheckbox,
  MDBBtn,
  MDBIcon,
} from "mdb-react-ui-kit";

const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/api/login", {
        login,
        password,
      });
      const { token } = response.data;
      localStorage.setItem("token", token);
      console.log(token);
      setIsLoading(false);

      // Rediriger vers une autre page en cas de succès
      navigate("/");
    } catch (error) {
      setIsLoading(false);
      if (error.response && error.response.status === 401) {
        setErrorMessage("Login ou mot de passe incorrect");
      } else {
        setErrorMessage("Une erreur s'est produite lors de la connexion.");
      }
    }
  };

  return (
    <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
      <h2>Connexion</h2>
      <form onSubmit={handleLogin}>
        <MDBInput
          wrapperClass="mb-4"
          label="Login"
          id="login"
          type="text"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
        />
        <MDBInput
          wrapperClass="mb-4"
          label="Mot de passe"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? "Chargement..." : "Se connecter"}
        </button>
        {errorMessage && <div>{errorMessage}</div>}
      </form>
    </MDBContainer>
  );
};

export default Login;
