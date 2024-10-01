const Repetition = require("../Models/Repetition");
const Utilisateur = require("../Models/Utilisateur");
// @ts-ignore
const absence = require("../Models/absences");

const Candidat = require("../Models/condidat");
const moment = require("moment-timezone");

const AddCandidat = async (req, res) => {
  const candidat = new Candidat(req.body);

  candidat.audition = req.body.audition;

  candidat.createdAt = moment().tz("Africa/Tunis").format();

  candidat
    .save()
    .then(() => {
      // Traitement supplémentaire si nécessaire

      res.status(200).json({
        message: "Candidat ajouté avec succès",
        candidat: candidat,
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error.message,
        message: "Données invalides",
      });
    });
};

const AbsenceStatistiqueRépetition = async (req, res) => {
  try {
    const absences = await absence.find();
    const repetitions = await Repetition.find();

    const statistics = {};
    console.log(absences);
    repetitions.forEach((repetition) => {
      const repetitionId = repetition._id;

      if (!statistics[repetitionId]) {
        statistics[repetitionId] = {
          repetition: repetitionId,
          nbPresence: 0,
          nbAbsence: 0,
          totalParticipants: repetition.participants.length,
        };
      }

      // Counting presence and absence for each repetition
      absences.forEach((absence) => {
        if (absence.repetitions === repetitionId) {
          if (absence.Presence === true) {
            statistics[repetitionId].nbPresence += 1;
          } else {
            statistics[repetitionId].nbAbsence += 1;
          }
        }
      });

      // Calculating percentage of choristers present
      statistics[repetitionId].percentagePresence =
        (statistics[repetitionId].nbPresence /
          statistics[repetitionId].totalParticipants) *
          100 +
        "%";
    });

    const statisticsArray = Object.values(statistics);

    res.json(statisticsArray);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des statistiques d'absence:",
      error
    );
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

// tache 19 asma

ajouter_abs_unseul = async (req, res) => {
  const { etat, raison_absence, date_absence, concert, repetitions, choriste } =
    req.body;
  const choristeId = req.params.choristeId; // Utilisez une seule déclaration ici

  try {
    // Vérifiez si toutes les informations nécessaires sont fournies
    if (!raison_absence || !date_absence) {
      throw new Error(
        "Veuillez fournir toutes les informations nécessaires pour ajouter une absence."
      );
    }

    // Créez une instance d'Absence avec les données fournies
    const Absence = new absence({
      raison_absence,
      // date_absence,
      concert,
      repetitions,
      choriste: choristeId, // Utilisez la variable ici
      etat,
    });

    // Enregistrez l'absence dans la base de données
    const resultat = await Absence.save();

    // Incrémentez le nombre d'absences pour les répétitions ou les concerts en fonction de la situation
    const user = await Utilisateur.findById(choristeId);

    if (user) {
      user.absence.push(resultat._id);

      // Incrémentez le nombre d'absences pour les répétitions
      if (repetitions) {
        user.nombreAbsenceRep = (user.nombreAbsenceRep || 0) + 1;
      }

      // Incrémentez le nombre d'absences pour les concerts
      if (concert) {
        user.nombreAbsenceConcert = (user.nombreAbsenceConcert || 0) + 1;
      }

      await user.save();
    } else {
      throw new Error("Choriste introuvable.");
    }

    res.status(201).json({
      model: resultat,
      message: "L'absence a été créée avec succès.",
    });
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
};

//hathi l métode

/*
ajouter_absences = async (req, res) => {
    const { etat, raison_absence, dates_absence, concert, repetitions, choriste } = req.body;
    const choristeId = req.params.choristeId;

    try {
        // Vérifiez si toutes les informations nécessaires sont fournies
        if (!raison_absence || !dates_absence || !dates_absence.length) {
            throw new Error("Veuillez fournir toutes les informations nécessaires pour ajouter une absence.");
        }

        // Créez une instance d'Absence avec toutes les dates fournies
        const absenceData = {
            raison_absence,
            dates_absence,
            concert,
            repetitions,
            choriste: choristeId,
            etat
        };

        // Enregistrez l'absence dans la base de données
        const resultat = await absence.create(absenceData);

        // Récupérez le choriste
        const user = await Utilisateur.findById(choristeId);

        if (user) {
            // Ajoutez l'ID de la nouvelle absence à la liste d'absences du choriste
            user.absence.push(resultat._id);

            // Incrémentez le nombre total d'absences
            user.nombreAbsenceTot = (user.nombreAbsenceTot || 0) + dates_absence.length;

            // Incrémentez le nombre d'absences pour les répétitions
            if (repetitions) {
                user.nombreAbsenceRep = (user.nombreAbsenceRep || 0) + dates_absence.length;
            }

            // Incrémentez le nombre d'absences pour les concerts
            if (concert) {
                user.nombreAbsenceConcert = (user.nombreAbsenceConcert || 0) + dates_absence.length;
            }

            await user.save();
        } else {
            throw new Error("Choriste introuvable.");
        }

        res.status(201).json({
            model: resultat,
            message: "L'absence a été créée avec succès."
        });
    } catch (err) {
        res.status(400).json({ err: err.message });
    }
};

*/
ajouter_absences = async (req, res) => {
  const { etat, raison_absence, dates_absence, concert, repetitions } =
    req.body;

  try {
    const choristeId = req.auth.userId; // Utilisez l'ID du choriste extrait du token

    // Vérifiez si toutes les informations nécessaires sont fournies
    if (!raison_absence || !dates_absence || !dates_absence.length) {
      throw new Error(
        "Veuillez fournir toutes les informations nécessaires pour ajouter une absence."
      );
    }

    // Créez une instance d'Absence avec toutes les dates fournies
    const absenceData = {
      raison_absence,
      dates_absence,
      concert,
      repetitions,
      choriste: choristeId,
      etat,
    };

    // Enregistrez l'absence dans la base de données
    const resultat = await absence.create(absenceData);

    // Récupérez le choriste
    const user = await Utilisateur.findById(choristeId);

    if (user) {
      // Ajoutez l'ID de la nouvelle absence à la liste d'absences du choriste
      user.absence.push(resultat._id);

      // Incrémentez le nombre total d'absences
      user.nombreAbsenceTot =
        (user.nombreAbsenceTot || 0) + dates_absence.length;

      // Incrémentez le nombre d'absences pour les répétitions
      if (repetitions) {
        user.nombreAbsenceRep =
          (user.nombreAbsenceRep || 0) + dates_absence.length;
      }

      // Incrémentez le nombre d'absences pour les concerts
      if (concert) {
        user.nombreAbsenceConcert =
          (user.nombreAbsenceConcert || 0) + dates_absence.length;
      }

      await user.save();
    } else {
      throw new Error("Choriste introuvable.");
    }
    const absenceAvecDetails = await absence
      .findById(resultat._id)
      .populate("choriste");
    res.status(201).json({
      model: absenceAvecDetails,
      message: "L'absence a été créée avec succès.",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err.message });
  }
};

const select_absences_id = (req, res) => {
  absence.findOne({ _id: req.params.id }).then((abs) => {
    if (!abs) {
      res.status(404).json({
        message: "objet non trouvé",
      });
      return;
    }
    res.status(200).json({
      model: abs,
      message: "Objet trouvé",
    });
  });
};

//aziz
//select absence selon  critére
const select_absences_selon_critères = async (req, res) => {
  try {
    // Selon programme
    if (req.query.programme) {
      try {
        const absences = await absence.find({ Presence: false });

        const rep = await Repetition.find({
          programme: req.query.programme,
        }).populate({
          path: "absence",
        });

        const choristerAbsences = [];

        for (const rept of rep) {
          const matchingAbsence = absences.filter(
            (absence) => absence.repetitions.toString() === rept._id.toString()
          );

          if (matchingAbsence.length > 0) {
            const populatedAbsences = await Promise.all(
              matchingAbsence.map(async (ma) => {
                const populatedAbsence = await absence
                  .findById(ma._id)
                  .populate({
                    path: "choriste",
                    select: "-login -password -concert -absence",
                  })
                  .populate({
                    path: "repetitions",
                    select: "-absence",
                  });
                return populatedAbsence;
              })
            );

            choristerAbsences.push(...populatedAbsences);
            console.log("bbbb" + choristerAbsences);
          }
        }

        console.log("mama" + choristerAbsences);
        res.json(choristerAbsences);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    }

    //selon saison
    else if (req.query.saison) {
      try {
        const absences = await absence.find({ Presence: false });

        const rep = await Repetition.find({
          saisonActuel: req.query.saison,
        }).populate({
          path: "absence",
        });

        const choristerAbsences = [];

        for (const rept of rep) {
          console.log(rept._id.toString());
          const b = rept._id.toString();
          const matchingAbsence = absences.filter(
            (absence) => absence.repetitions.toString === rept._id.toString
          );

          if (matchingAbsence.length > 0) {
            const populatedAbsences = await Promise.all(
              matchingAbsence.map(async (ma) => {
                const populatedAbsence = await absence
                  .findById(ma._id)
                  .populate({
                    path: "choriste",
                    select: "-login -password -concert -absence",
                  })
                  .populate({
                    path: "repetitions",
                    select: "-absence",
                  });
                return populatedAbsence;
              })
            );

            choristerAbsences.push(...populatedAbsences);
          }
        }

        res.json(choristerAbsences);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    }

    //selon pupitre
    else if (req.query.pupitre) {
      try {
        const absences = await absence.find({ Presence: false });

        const choristers = await Utilisateur.find({
          groupe_Pupitre: req.query.pupitre,
        })
          .populate({
            path: "absence",
            match: { Presence: false },
            populate: {
              path: "repetitions",
            },
          })
          .select("-concert");

        const choristerAbsences = [];

        for (const chorister of choristers) {
          console.log(chorister);
          const matchingAbsence = absences.filter(
            (absencee) =>
              absencee.choriste.toString() === chorister._id.toString()
          );

          console.log("mm" + matchingAbsence);
          if (matchingAbsence) {
            const populatedAbsences = await Promise.all(
              matchingAbsence.map(async (ma) => {
                console.log(ma);
                const populatedAbsence = await absence
                  .findById(ma._id)
                  .populate({
                    path: "choriste",
                    select: "-login -password -concert -absence",
                  })
                  .populate({
                    path: "repetitions",
                    select: " -absence",
                  });
                return populatedAbsence;
              })
            );

            choristerAbsences.push(...populatedAbsences);
          }
        }

        res.json(choristerAbsences);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    } else {
      //selon date absence
      let filter = { Presence: false };
      if (req.query.dateAbsence) {
        filter["dates_absence"] = req.query.dateAbsence;
      }
      //selon choriste
      if (req.query.choriste) {
        filter["choriste"] = req.query.choriste;
      }
      // console.log(filter);
      const absences = await absence
        .find()
        .populate({ path: "repetitions", select: "-absence" })
        .populate({
          path: "choriste",
          select: "-login -password ",
        });
      res.json(absences);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

module.exports = {
  ajouter_absences: ajouter_absences,
  select_absences_id: select_absences_id,

  ajouter_abs_unseul: ajouter_abs_unseul,

  select_absences_selon_critères,

  AbsenceStat: AbsenceStatistiqueRépetition,
  AddCandidat,
};
