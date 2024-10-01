const mongoose = require("mongoose");

const CondidatSchema = mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },

  email: { type: String, required: true },
  nomJeuneFille: { type: String },
  sexe: { type: String },
  dateNaissance: { type: Date },
  nationalite: { type: String },
  taille: { type: Number },
  telephone: { type: String },
  cin: { type: String },
  nom_parrain: { type: String },
  passeport: { type: String },
  situationProfessionnelle: { type: String },
  connaissancesMusicales: { type: Boolean },
  descriptionConnaissances: { type: String },
  parraine: { type: Boolean },
  nomParrain: { type: String },
  actifDansAutreChoeur: { type: Boolean },
  ConfirmedEmail: { type: Boolean, default: false },
  nomAutreChoeur: { type: String },
  motivationAmateur: { type: String },
  audition: { type: mongoose.Schema.Types.ObjectId, ref: "Audition" },

  createdAt: Date,
  auditions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Audition",
    },
  ],
});

module.exports =
  mongoose.models.Condidat || mongoose.model("Condidat", CondidatSchema);
