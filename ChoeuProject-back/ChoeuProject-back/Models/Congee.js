
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
  
    Choriste: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    
    state : { 
        type:String,
        enum: ['enattente', 'approuver',]
    }


});

// Définir le modèle Congee uniquement si ce n'est pas déjà défini
const Congee = mongoose.models.Congee || mongoose.model('Congee', CongeeSchema);

module.exports = Congee;



