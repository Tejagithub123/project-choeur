const mongoose = require("mongoose");

const AbsencesSchema = mongoose.Schema({
  raison_absence: {
    type: String,
  },

  dates_absence: [
    {
      type: Date,
      default: null,
    },
  ],
  /*  date_absence:{
      type: Date,
      default: null,
    },*/
  nb_prensence: {
    type: Number,
  },

  etat: {
    type: String,
  },
  Presence: {
    type: Boolean,

    default: false, //vérifier
  },

  concert: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Concert",
  },

  raisonAjoutManuellement: String,
  QRCodeRep: String,

  repetitions: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Repetition",
  },

  choriste: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Absence = mongoose.model("Absence", AbsencesSchema);

module.exports = Absence;
