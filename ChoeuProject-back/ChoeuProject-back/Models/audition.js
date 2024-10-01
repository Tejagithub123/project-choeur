const mongoose = require('mongoose');


const schema =  mongoose.Schema
const auditionSchema = new schema ({
  numeroOrdre: Number,
  
  appreciation: {
    type: String,
    enum: ['A', 'B', 'C'],
  },
  extraitChante: String,
  remarques: String,
  
  date: String,
  heure: String,
  décision: {
    type:String,

    enum:["retenu","refuser", "En attente", "devient_choriste"],
    default:"En attente"
  }
  ,
  Candidat:{
    type: mongoose.Schema.Types.ObjectId, ref: 'Condidat'
  },

  saison: { type: Number }, //saison actuelle ,
  ConfirmedEmail: { type: String  ,enum:['confirmer','infirmer'], default:'infirmer'  },

  condidat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Condidat',
},
tessitureVocale:
  {type:String,
   enum: ['Soprano', 'Alto', 'Tenor', 'Basse']},

   
user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
}, 


// hathi jdida
envoi_email: {
  type: Boolean,
  default: false
}


});

module.exports = mongoose.model('Audition', auditionSchema);




