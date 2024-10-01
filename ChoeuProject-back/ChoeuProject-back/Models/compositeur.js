const mongoose = require("mongoose")

const compositeurSchema = new mongoose.Schema({
    nom: String,
    prenom: String
});


module.exports = mongoose.model("Compositeur",compositeurSchema)