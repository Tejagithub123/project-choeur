const mongoose = require("mongoose")
const oeuvreSchema = new mongoose.Schema({
    titre: String,
    anneeComposition: Number,
    genre: String,
    paroles: String,
    partition: String,
    parties: [{
        titrePartie: String,
        chœur: Boolean,
        pupitres: [String] // Liste des pupitres intervenants
    }],
    arrangeur: { type: mongoose.Schema.Types.ObjectId, ref: 'Arrangeur' },
    compositeur: { type: mongoose.Schema.Types.ObjectId, ref: 'Compositeur' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    saison: { type: Number }, //saison actuelle 


    repetitions:[ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Repetition'
    }],
    concerts:[ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Concert'
    }],

});


module.exports = mongoose.model("Oeuvre",oeuvreSchema)