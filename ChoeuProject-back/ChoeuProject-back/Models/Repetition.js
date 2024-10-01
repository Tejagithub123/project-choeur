const mongoose = require('mongoose');

const RepetitionSchema = mongoose.Schema({
    lieu: {
        type: String,
       
    },
    date: {
        type: String,
        required: true
    },
    heureDebut: {
        type: String,
      
    },
    heureFin: {
        type: String,
     
    },
    programme: {
        type: String,
       
    },
    saisonActuel:{
        typeof:String
    },


    choriste: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    concert: { type: mongoose.Schema.Types.ObjectId, ref: 'Concert' },

    urlQR:String,

    

    participants:[{
        choriste:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        pupitre:String,
        
    }],



    absence: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Absence' }],




    oeuvre:{
        
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Oeuvre'

   
    
},

});

const repetition = mongoose.model('Repetition', RepetitionSchema);


RepetitionSchema.statics.seuilNomination = 50; //50%
RepetitionSchema.statics.seuilElimination = 100; //100% 365j





//module.exports = Repetition; // hathi asma mte3i


module.exports = repetition;


