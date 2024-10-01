const oeuvre = require ("../Models/oeuvre")

const arrangeur = require ("../Models/arrangeur")
const compositeur = require ("../Models/compositeur")


const fetchoeuvre =(req,res)=> {
    // Utilisation de la méthode "find" pour rechercher des tâches dans une source de données
    oeuvre.find()
    .populate('arrangeur compositeur')
    .exec()
    // Si la recherche est réussie, retournez les tâches trouvées en tant que réponse JSON
    .then((oeuvres)=>{
        res.status(200).json({
            model : oeuvres,
            message :"success"
        });
    }
    )
    // En cas d'erreur, renvoyez une réponse d'erreur avec le message d'erreur
    .catch ((error) => {
        res.status(404).json({
            error : error.message,
            message: "pas de données "
        });
    });
}


const postoeuvre = (req, res) => {
    const newoeuv = new oeuvre(req.body);
    const arrangeurId = req.body.arrangeur;
    const compositeurId = req.body.compositeur;
  
    // Vérifie si l'auteur avec l'ID donné existe
    arrangeur.findOne({ _id: arrangeurId })
      .then((foundarrangeur) => {
        if (!foundarrangeur) {
          return res.status(404).json({
            message: "arrangeur non trouvé",
          });
        }
  
        // Vérifie la validité des IDs de catégories
        compositeur.findOne({ _id: compositeurId })
          .then((foundCompo) => {
            if (!foundCompo) {
              return res.status(400).json({
                message: "ID de compositeur non valides",
              });
            }
  
            // Si l'auteur existe et les catégories sont valides, enregistrez le nouveau livre
            newoeuv
              .save()
              .then(() => {
                res.status(200).json({
                  model: newoeuv,
                  message: "Oeuvre créé avec succès",
                });
              })
              .catch((error) => {
                res.status(400).json({
                  error: error.message,
                  message: "Problème lors de l'ajout du oeuvre",
                });
              });
          })
          .catch((error) => {
            res.status(500).json({
              error: error.message,
              message: "Erreur lors de la recherche de compositeur",
            });
          });
      })
      .catch((error) => {
        res.status(500).json({
          error: error.message,
          message: "Erreur lors de la recherche d'arrangeur",
        });
      });
  };
  
  const deleteoeuvre =(req,res) => {
    oeuvre.deleteOne({_id : req.params.id}).then (()=> {
        res.status(200).json({
            message : "suppremé avec succes"
        });
    })
    .catch((error) => {
        res.status(400).json({
        error:error.message,
        message : "erreur de suppression"
    })
    })
    
}
const updateoeuv = (req, res) => {
    oeuvre.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        .then((oeuv) => {
            if (!oeuv) {
                return res.status(404).json({
                    message: "Object non trouvé",
                });
            }
            res.status(200).json({
                model: oeuv,
                message: "Object modifié",
            });
        })
        .catch((error) => {
            res.status(400).json({
                message: "Données invalides",
            });
        });
};

const fetchById =(req,res)=> {
    oeuvre.findOne({_id:req.params.id})
   .then((OneBook) => {
    if(!OneBook){
        res.status(404).json({
            message: "objet non trouvé",})
            return}  
    res.status(200).json({
        model:OneBook,
        message:"object trouvé"
    });
   })
   
}

  module.exports={
    postoeuvre:postoeuvre,
    fetchoeuvre:fetchoeuvre ,
    fetchById:fetchById,
    updateoeuv:updateoeuv,
    deleteoeuvre:deleteoeuvre
}
