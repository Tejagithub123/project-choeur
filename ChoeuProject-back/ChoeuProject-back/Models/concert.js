const mongoose = require("mongoose");

const concertSchema = new mongoose.Schema({
  titre: String,
  date: { type: Date },
  lieu: { type: String },
  affiche: { type: String },
  heuredébut: { type: Date },
  heurefin: { type: Date },
  confirmationLink: String,
  disponible: [
    {
      choriste: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      diponiblitee: { type: Boolean, default: false },
    },
  ],
  seuilpresence: { type: Number, default: 0 },
  urlQR: String,
  presences: [
    {
      choriste: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      present: { type: Boolean },
      QRCodeConcert: String,
      raisonAjoutManuellement: String,
    },
  ],
  Absences: [
    {
      choriste: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      absent: { type: Boolean },
    },
  ],

  programme: [
    {
      oeuvre: { type: mongoose.Schema.Types.ObjectId, ref: "Oeuvre" },
      besoin_choeur: Boolean,
    },
  ],
  participants: [
    {
      choriste: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      pupitre: String,
    },
  ],
  oeuvre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Oeuvre",
  },
});

concertSchema.statics.seuilNomination = 50; //50%
concertSchema.statics.seuilElimination = 100; //100% 365j

const Concert = mongoose.model("Concert", concertSchema);
module.exports = Concert;
