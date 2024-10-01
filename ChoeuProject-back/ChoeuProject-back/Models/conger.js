const mongoose = require('mongoose');

const CongeeSchema = new mongoose.Schema({
    enConge: {
        type: Boolean,
        default: false,
    },
    dateDebutConge: {
        type: Date,
        default: null,
    },
    dateFinConge: {
        type: Date,
        default: null,
    },
    demande: { type: String, enum: ['accepter', 'en attente'] },
    
    Choriste: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});

// Définir le modèle Congee uniquement si ce n'est pas déjà défini
const Congee = mongoose.models.Congee || mongoose.model('Congee', CongeeSchema);

module.exports = Congee;
