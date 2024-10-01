const Audition = require('../Models/audition');

exports.addAudition = async (req, res, next) => {
  try {
    const audition = new Audition(req.body);
    await audition.save();

    res.status(201).json({
      model: audition,
      message: "Objet créé avec succès",
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Données invalides",
    });
  }
};

exports.getAuditions = (req, res, next) => {
  Audition.find()
    .then((auditions) => {
      res.status(200).json({
        model: auditions,
        message: "Success",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error.message,
        message: "Problème d'affichage",
      });
    });
};

exports.updateAudition = (req, res, next) => {
  Audition.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    .then((audition) => {
      if (!audition) {
        res.status(404).json({
          message: "Objet non trouvé",
        });
      } else {
        res.status(200).json({
          model: audition,
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

exports.getAudition = (req, res, next) => {
  Audition.findOne({ _id: req.params.id })
    .then((audition) => {
      if (!audition) {
        res.status(404).json({
          message: "Objet non trouvé",
        });
      } else {
        res.status(200).json({
          model: audition,
          message: "Objet trouvé",
        });
      }
    })
    .catch((error) => {
      res.status(400).json({
        error: error.message,
        message: "Problème d'affichage",
      });
    });
};

exports.deleteAudition = (req, res, next) => {
  Audition.findOneAndDelete({ _id: req.params.id })
    .then((audition) => {
      if (!audition) {
        res.status(404).json({
          message: "Objet non trouvé",
        });
      } else {
        res.status(200).json({
          message: "Objet supprimé avec succès",
        });
      }
    })
    .catch((error) => {
      res.status(400).json({
        error: error.message,
        message: "Problème de suppression de l'objet",
      });
    });
}; 

