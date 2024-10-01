const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Utlisateur = require("./Models/Utilisateur");

const mongoConnection = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://choeurgroupe:5UeykcVF0yDmlEZ5@cluster0.hsm1e6z.mongodb.net/test?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connection to MongoDB successful");
  } catch (error) {
    console.error("Connection to MongoDB failed", error);
  }
};

const addAdminUser = async () => {
  let admin = await Utlisateur.findOne({ role: "admin" });

  if (!admin) {
    let password = "admin";
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    let new_admin = new Utlisateur({
      nom: "triki",
      prenom: "asma",
      email: "admin@gmail.com",
      password: hashed,
      role: "admin",
    });

    await new_admin.save();
    console.log(`Admin account has been added: ${new_admin}`);
  } else {
    console.log(
      `Admin account already exists \n Admin Adresse: ${admin.email}`
    );
  }
};

const addManagerChoeurUser = async () => {
  let manager = await Utlisateur.findOne({ role: "ManagerChoeur" });

  if (!manager) {
    // Ajoutez ici le code pour ajouter un utilisateur avec le rôle "ManagerChoeur"
    // Utilisez la même logique que dans la fonction addAdminUser
    let password = "manager";
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    let new_manager = new Utlisateur({
      nom: "omar",
      prenom: "triki",
      email: "manager@gmail.com",
      password: hashed,
      role: "ManagerChoeur",
    });

    await new_manager.save();
    console.log(`ManagerChoeur account has been added: ${new_manager}`);
  } else {
    console.log(
      `ManagerChoeur account already exists \n ManagerChoeur Adresse: ${manager.email}`
    );
  }
};

module.exports = mongoConnection;
