const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  nom: { type: String },
  prenom: { type: String },
  email: { type: String, required: true, unique: "true" },
  login: { type: String },
  password: { type: String },
  role: {
    type: String,
    enum: ["admin", "choriste", "chefPupitre", "ManagerChoeur", "chefChoeur"],
  },
  etat: {
    type: String,
    enum: ["Actif", "Inactif", "Nominé", "Eliminé", "EnConge"],
  },
  pupitre: {
    type: String,
    enum: ["Soprano", "Alto", "Tenor", "Basse"],
  },
  archived: { type: Boolean, default: false },

  tessitureVocale: {
    type: String,
    enum: ["Soprano", "Alto", "Tenor", "Basse"],
  },
  date_choeur: { type: Date },
  groupe_Pupitre: { type: String },
  besoin_pupitre_choriste: { type: Number },
  nombreAbsenceRep: {
    type: Number,
  },
  nb_prensenceRep: {
    type: Number,
  },
  nombreAbsenceConcert: {
    type: Number,
  },
  nb_prensenceConcert: {
    type: Number,
  },
  Saison: { type: Date },
  taille: { type: Number },
  Conges: [
    {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Congee",
    },
  ],

  demandeConge: {
    type: String,
    default: null,
  },

  concert: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Concert",
    },
  ],

  historiqueActivite: [
    {
      Saison: "String",

      status: {
        type: String,
        enum: ["Inactif", "Junior", "Senior", "Veteran"],
      },
    },
  ],
  //aziz
  notifications: [{ notification: String, read: Boolean }],
  schedulNotif: { type: Date, default: new Date("2024-01-01T10:00:00") },
  /////

  absence: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Absence", default: null },
  ],
});

UserSchema.pre("save", function (next) {
  if (this.role === "ManagerChoeur") {
    this.Conges = undefined;
    this.concert = undefined;
    this.historiqueActivite = undefined;
  }
  next();
});

UserSchema.pre("save", function (next) {
  if (this.role === "ManagerChoeur" || this.role === "admin") {
    this.Conges = undefined;
    this.concert = undefined;
    this.historiqueActivite = undefined;
  }
  next();
});

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
