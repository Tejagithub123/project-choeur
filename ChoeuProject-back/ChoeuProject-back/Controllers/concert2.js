
const Concert = require('../Models/concert');


const getConcerts =(req,res)=> {
    // Utilisation de la méthode "find" pour rechercher des tâches dans une source de données
    Concert.find()
    .then((concerts) => {
      res.status(200).json({
        model: concerts,
        message: "Success",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error.message,
        message: "Problème d'affichage",
      });
    });
}

const updateSoeuilConcert = (req, res, next) => {
    // Obtenez la nouvelle valeur du seuil depuis les paramètres de la requête
   
  
    // Mise à jour du champ seuilpresence avec la nouvelle valeur
    const { seuilpresence } = req.body;

  
    Concert.findOneAndUpdate({ _id: req.params.id }, { seuilpresence }, { new: true })
      .then((concert) => {
        if (!concert) {
          res.status(404).json({
            message: "Objet non trouvé",
          });
        } else {
          res.status(200).json({
            model: concert,
            message: "Objet modifié",
          });
        }
      })
      .catch((error) => {
        res.status(400).json({
          error: error.message,
          message: "Problème de mise à jour",
        });
      });
  };
  

module.exports={
    getConcerts:getConcerts,
    updateSoeuilConcert:updateSoeuilConcert
}
