const Condidat = require ("../Models/condidat")


module.exports.checkEmailConfirmation = async (req, res, next) => {
    const email = req.params.email;
  
    try {
      const candidat = await Condidat.findOne({ email });
  
      if (!candidat) {
        return res.status(404).json({ error: 'Candidat non trouvé.' });
      }
  
      if (!candidat.ConfirmedEmail) {
        return res.status(403).json({ error: 'Veuillez confirmer votre email avant de remplir le formulaire.' });
      }
  
      // Ajoutez le candidat à la demande pour qu'il soit disponible dans la route suivante
      req.candidat = candidat;
      next();
    } catch (error) {
      console.error('Erreur lors de la vérification de la confirmation de l\'email :', error);
      res.status(500).json({ error: 'Erreur lors de la vérification de la confirmation de l\'email.' });
    }
  };
  