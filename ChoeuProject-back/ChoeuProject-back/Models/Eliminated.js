const mongoose = require('mongoose');
const EliminatedChoristeSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utilisateur',
    required: true,
  },

  nom: {
    type: String,
    required: true
  },
  prenom: {
    type: String,
    required: true
  },
  email: {
    type: String,
  },

  disciplinaryReason: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['choriste'],
    default: 'choriste',
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
 
});

module.exports = mongoose.models.EliminatedChoriste || mongoose.model('Eliminated', EliminatedChoristeSchema);