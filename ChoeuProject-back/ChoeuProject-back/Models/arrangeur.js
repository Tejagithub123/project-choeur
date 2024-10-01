const mongoose = require("mongoose")

const arrangeurSchema = new mongoose.Schema({
    nom: String,
    prenom: String
});


module.exports = mongoose.model("Arrangeur",arrangeurSchema)