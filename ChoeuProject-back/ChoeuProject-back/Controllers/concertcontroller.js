const Concert = require("../Models/concert");
const Oeuvre = require("../Models/oeuvre");
const Arrangeur = require("../Models/arrangeur");
const Compositeur = require("../Models/compositeur");
const Repetition = require("../Models/Repetition");
const multer = require("multer");
const xlsx = require("xlsx");

const Utilisateur = require("../Models/Utilisateur");

const mongoose = require("mongoose");
const absence = require("../Models/absences");
exports.StatistiqueAbsenceConcert = async (req, res, next) => {
  try {
    const concerts = await Concert.find();
    const statistiquesConcerts = [];
    for (const concert of concerts) {
      const totalParticipants = concert.participants.length;
      const totalPresence = concert.presences.filter(
        (p) => p.present === true
      ).length;

      const totalAbsence = concert.presences.filter(
        (p) => p.present === false
      ).length;
      const percentagePresence =
        (totalPresence / totalParticipants) * 100 + "%";

      statistiquesConcerts.push({
        concert: {
          _id: concert._id,
          date: concert.date,
          lieu: concert.lieu,
        },
        totalPresence,
        totalAbsence,
        percentagePresence,
      });
    }

    console.log("Statistiques pour chaque concert:", statistiquesConcerts);

    res.json(statistiquesConcerts);

    return statistiquesConcerts;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des statistiques de concert:",
      error
    );
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

/*exports.countAbsencesPresences = async (req, res, next) => {

  try {
    const { oeuvreId } = req.params;
  
    const concerts = await Concert.find({ oeuvre: oeuvreId.toString() });
    const statistiquesConcerts = [];

    for (const concert of concerts) {
      const totalParticipants_A_Concert = concert.participants.length;
      const totalPresence_Concert = concert.presences.filter((p) => p.present === true).length;
      const totalAbsence_Concert = concert.presences.filter((p) => p.present === false).length;
      const percentagePresence_A_Concert = ((totalPresence_Concert / totalParticipants_A_Concert) * 100).toFixed(2) + '%';


      // Récupérer les absences liées à l'œuvre
      const absences = await absence.find({  });
      const repetitions = await Repetition.find({ oeuvre: oeuvreId.toString() });

      const statistics = {}; // Initialiser l'objet de statistiques à l'intérieur de la boucle du concert

      repetitions.forEach((repetition) => {
        const repetitionId = repetition._id.toString();

        if (!statistics[repetitionId]) {
          statistics[repetitionId] = {
            repetition: repetitionId,
            nbPresence_A_Repitition: 0,
            nbAbsence_A_Repitition: 0,
            totalParticipants_A_Repitition: repetition.participants.length,
          };
        }

        // Compter les présences et absences pour chaque répétition
        absences.forEach((absence) => {
          if (absence.repetitions.toString() === repetitionId.toString()) {
            if (absence.Presence === true) {
              statistics[repetitionId].nbPresence_A_Repitition += 1;
            } else {
              statistics[repetitionId].nbAbsence_A_Repitition += 1;
            }
          }
        });

        // Calculer le pourcentage de choristes présents
        statistics[repetitionId].percentagePresence_A_Repitition = (
          (statistics[repetitionId].nbPresence_A_Repitition / statistics[repetitionId].totalParticipants_A_Repitition) * 100
        ).toFixed(2) + '%';
      });

      statistiquesConcerts.push({
        concert: {
          _id: concert._id,
          date: concert.date,
          lieu: concert.lieu,
          oeuvre: concert.oeuvre,
          totalPresence_Concert,
          totalAbsence_Concert,
          percentagePresence_A_Concert,
        },
        repetitions: statistics, // Ajouter les statistiques de répétition au tableau
      });
    }

    console.log('Statistiques pour chaque concert:', statistiquesConcerts);
    res.json(statistiquesConcerts);

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques de concert:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }

};


};*/

exports.addConcert = async (req, res, next) => {
  try {
    const concert = new Concert(req.body);
    await concert.save();

    res.status(201).json({
      model: concert,
      message: "Objet créé avec succès",
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Données invalides",
    });
  }
};

exports.getConcerts = (req, res, next) => {
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
};

exports.updateConcert = (req, res, next) => {
  Concert.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
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

exports.getConcert = (req, res, next) => {
  Concert.findOne({ _id: req.params.id })
    .then((concert) => {
      if (!concert) {
        res.status(404).json({
          message: "Objet non trouvé",
        });
      } else {
        res.status(200).json({
          model: concert,
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

exports.deleteConcert = (req, res, next) => {
  Concert.findOneAndDelete({ _id: req.params.id })
    .then((concert) => {
      if (!concert) {
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

//ajouter programme concerts oeuvres
exports.addConcertExcel = async (req, res, next) => {
  try {
    const concertId = req.params.concertId;
    const excelFile = req.file;

    const workbook = xlsx.read(excelFile.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    const concert = await Concert.findById(concertId);

    if (!concert) {
      return res.status(404).json({ error: "Concert not found" });
    }

    const promises = data.slice(1).map(async (row) => {
      const oeuvreName = row[0];
      const besoinChoeur = row[1] === "true";

      let oeuvre = await Oeuvre.findOne({ titre: oeuvreName });

      if (!oeuvre) {
        oeuvre = new Oeuvre({ titre: oeuvreName });
        await oeuvre.save();
      }

      const existingProgramEntry = concert.programme.find((entry) =>
        entry.oeuvre.equals(oeuvre._id)
      );

      if (!existingProgramEntry) {
        concert.programme.push({
          oeuvre: oeuvre._id,
          besoin_choeur: besoinChoeur,
        });
      }
    });

    await Promise.all(promises);

    await concert.save();

    const updatedConcert = await Concert.findById(concertId).populate(
      "programme.oeuvre"
    );

    res
      .status(201)
      .json({
        message: "Program added to the concert successfully.",
        concert: updatedConcert,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

//teja
exports.setseuilsconcerts = async (req, res, next) => {
  try {
    const { seuilNomination, seuilElimination } = req.body;

    Concert.seuilNomination = seuilNomination;
    Concert.seuilElimination = seuilElimination;

    res.status(200).json({
      seuilNomination: Concert.seuilNomination,
      seuilElimination: Concert.seuilElimination,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur de mise à jour des seuils" });
  }
};

// tache 29 asma  placement sur scene
exports.ajoutplacement = async (req, res) => {
  try {
    let condidat = [];
    let dispo = [];
    const existe_Concert = await Concert.findById(req.params.id);
    const choris = existe_Concert.disponible;
    choris.map((elem) => {
      if (elem.diponiblitee == true) {
        dispo.push(elem);
      }
    });
    console.log(choris);
    for (let i = 0; i < dispo.length; i++) {
      console.log(dispo[i]);
      const existe_choriste = await Utilisateur.findById({
        _id: dispo[i].choriste,
      });
      condidat.push({
        nom: existe_choriste.nom,
        prenom: existe_choriste.prenom,
        tessitureVocale: existe_choriste.tessitureVocale,
        taille: existe_choriste.taille,
      });
    }
    console.log(condidat);

    // const existe_choriste=await Utilisateur.find({role:"choriste"})

    condidat.sort((candidat1, candidat2) => {
      if (candidat1.taille !== candidat2.taille) {
        return candidat1.taille - candidat2.taille;
      } else {
        const voixOrder = { basse: 1, tenor: 2, alto: 3, soprano: 4 };

        return (
          voixOrder[candidat1.tessitureVocale] -
          voixOrder[candidat2.tessitureVocale]
        );
      }
    });
    const pyramidHeight = 5;
    let matrix = [];
    let counter = 0;

    for (let i = 1; i <= pyramidHeight; i++) {
      let row = [];
      for (let j = 1; j <= i; j++) {
        if (counter < condidat.length) {
          row.push(condidat[counter]);
          counter++;
        }
      }
      matrix.push(row);
    }
    matrix.forEach((row) => {
      let rowData = "";
      row.forEach((candidat) => {
        rowData += `${candidat.nom} ${candidat.prenom} (${candidat.taille}, ${candidat.tessitureVocale})\t`;
      });
      console.log(rowData);
    });

    res.status(200).json({ reponse: matrix, message: "succes retour" });
  } catch (error) {
    console.log(error);
    res.status(400).json("faild");
  }
};

// tache 29 asma  placement sur scene
/*exports.ajoutplacement = async (req, res) => {
  try {
    let candidats = [];
    let dispos = [];

    const existeConcert = await Concert.findById(req.params.id);
    const choristes = existeConcert.disponible;

    choristes.forEach(elem => {
      if (elem.diponiblitee === true) {
        dispos.push(elem);
      }
    });

    for (let i = 0; i < dispos.length; i++) {
      const existeChoriste = await Utilisateur.findById({
        _id: dispos[i].choriste,
      });
      candidats.push({
        nom: existeChoriste.nom,
        prenom: existeChoriste.prenom,
        tessitureVocale: existeChoriste.tessitureVocale,
        taille: existeChoriste.taille,
      });
    }

    candidats.sort((candidat1, candidat2) => {
      if (candidat1.taille !== candidat2.taille) {
        return candidat1.taille - candidat2.taille;
      } else {
        const voixOrder = { basse: 1, tenor: 2, alto: 3, soprano: 4 };
        return (
          voixOrder[candidat1.tessitureVocale] -
          voixOrder[candidat2.tessitureVocale]
        );
      }
    });

    const pyramidHeight = 5;
    let matrix = [];
    let counter = 0;

    for (let i = 1; i <= pyramidHeight; i++) {
      let row = [];
      for (let j = 1; j <= i; j++) {
        if (counter < candidats.length) {
          row.push(candidats[counter]);
          counter++;
        }
      }
      matrix.push(row);
    }

    // Inverser l'ordre des lignes pour avoir la pyramide dans le bon sens
    matrix.reverse();

    matrix.forEach(row => {
      let rowData = "";
      row.forEach(candidat => {
        rowData += `${candidat.nom} ${candidat.prenom} (${candidat.taille}, ${candidat.tessitureVocale})\t`;
      });
      console.log(rowData);
    });

    res.status(200).json({ reponse: matrix, message: "Succès de retour" });
  } catch (error) {
    console.log(error);
    res.status(400).json("Échec");
  }
};*/

module.exports.updateSoeuilConcert = (req, res, next) => {
  // Obtenez la nouvelle valeur du seuil depuis les paramètres de la requête

  // Mise à jour du champ seuilpresence avec la nouvelle valeur
  const { seuilpresence } = req.body;

  Concert.findOneAndUpdate(
    { _id: req.params.id },
    { seuilpresence },
    { new: true }
  )
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
