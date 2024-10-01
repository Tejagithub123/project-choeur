const Utilisateur = require("../Models/Utilisateur");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const schedule = require("node-schedule");

const moment = require("moment-timezone");
// @ts-ignore

const repetition = require("../Models/Repetition");
const nodemailer2 = require("../utils/nodemailer");
const Concert = require("../Models/concert");
const qr = require("qrcode");

const audition = require("../Models/audition");

const Repetition = require("../Models/Repetition");

const net = require("net");
// @ts-ignore
const congee = require("../Models/conger");

const Absence = require("../Models/absences");
const cron = require("node-cron");

const nodemailer = require("nodemailer");
const Eliminated = require("../Models/Eliminated");

ajouter_utlisateur = (req, res) => {
  const utilisateur = new Utilisateur(req.body);
  utilisateur
    .save()
    .then((resultat) => {
      res.status(201).json({
        model: resultat,
        message: " le choriste est bien crée",
      });
    })
    .catch((err) => {
      res.status(400).json({ err: err.message });
    });
};

// tache testture vocale  asma

modifier_utlisateur = async (req, res) => {
  try {
    const idUtilisateur = req.params.id;
    const nouvelleTessiture = req.body.tessitureVocale; // Supposons que vous recevez la nouvelle tessiture depuis le corps de la requête

    // Trouver l'utilisateur par son ID
    const utilisateur = await Utilisateur.findById(idUtilisateur);

    if (!utilisateur) {
      return res
        .status(404)
        .json({ success: false, message: "Utilisateur non trouvé." });
    }

    // Vérifier si l'utilisateur a le rôle de choriste
    if (utilisateur.role !== "choriste") {
      return res.status(403).json({
        success: false,
        message: "L'utilisateur n'a pas le rôle de choriste.",
      });
    }

    // Mettre à jour la tessiture vocale
    utilisateur.tessitureVocale = nouvelleTessiture;
    await utilisateur.save();

    return res.status(200).json({
      success: true,
      message: "Utilisateur mis à jour avec succès.",
      utilisateur,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// supprimer comptes  dernier tache asma
supprimer_utilisateur = async (req, res) => {
  try {
    const idUtilisateur = req.params.id;

    // Utiliser findOneAndDelete pour trouver et supprimer l'utilisateur par son ID
    const resultat = await Utilisateur.findOneAndDelete({ _id: idUtilisateur });

    if (!resultat) {
      return res
        .status(404)
        .json({ success: false, message: "Utilisateur non trouvé." });
    }

    return res
      .status(200)
      .json({ success: true, message: "Utilisateur supprimé avec succès." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// selectionner_choristes dernier tache aziz refaite
const selectionner_choristes = async (req, res) => {
  try {
    // Utiliser la méthode find pour sélectionner tous les choristes
    const choristes = await Utilisateur.find({ role: "choriste" });

    // Exclure la propriété demandeConge de chaque choriste
    const choristesSansDemandeConge = choristes.map((choriste) => {
      const { demandeConge, ...choristeSansDemandeConge } = choriste._doc;
      return choristeSansDemandeConge;
    });

    return res.status(200).json({ choristes: choristesSansDemandeConge });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// selectionner_chefPupitre asma dernier tache
const selectionner_chefPupitre = async (req, res) => {
  try {
    // Utiliser la méthode find pour sélectionner tous les choristes
    const chefsPupitre = await Utilisateur.find({ role: "chefPupitre" });

    // Exclure la propriété demandeConge de chaque chef de pupitre
    const chefsPupitreSansDemandeConge = chefsPupitre.map((chefPupitre) => {
      const { demandeConge, ...chefPupitreSansDemandeConge } = chefPupitre._doc;
      return chefPupitreSansDemandeConge;
    });

    return res
      .status(200)
      .json({ success: true, chefsPupitre: chefsPupitreSansDemandeConge });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// get by id  asma dernier tache
const selectionner_id = async (req, res) => {
  try {
    const idUtilisateur = req.params.id;

    // Utiliser la méthode findById pour obtenir un utilisateur par son ID
    const utilisateur = await Utilisateur.findById(idUtilisateur);

    if (!utilisateur) {
      return res
        .status(404)
        .json({ success: false, message: "Utilisateur non trouvé." });
    }

    // Exclure le mot de passe et l'attribut demandeConge de la réponse
    const { demandeConge, ...utilisateurSansInfosSensibles } = utilisateur._doc;

    return res
      .status(200)
      .json({ success: true, utilisateur: utilisateurSansInfosSensibles });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// get tous les comptes   asma dernier tache
const selectionner = async (req, res) => {
  try {
    // Utiliser la méthode find pour obtenir tous les utilisateurs
    const utilisateurs = await Utilisateur.find();

    // Exclure la propriété demandeConge de chaque utilisateur
    const utilisateursSansDemandeConge = utilisateurs.map((utilisateur) => {
      const { demandeConge, ...utilisateurSansDemandeConge } = utilisateur._doc;
      return utilisateurSansDemandeConge;
    });

    return res
      .status(200)
      .json({ success: true, utilisateurs: utilisateursSansDemandeConge });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const AddChoriste = (req, res) => {
  try {
    // Hash the password before saving it
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
        const user = new Utilisateur({
          login: req.body.login,
          password: hash, // Store the hashed password
          historiqueActivite: [
            {
              Saison: 2023,
              status: "Inactif",
            },
          ],
          nom: req.body.nom,
          prenom: req.body.prenom,
          email: req.body.email,
          role: "choriste",
          etat: req.body.etat,
          tessitureVocale: req.body.tessitureVocale,
          groupe_Pupitre: req.body.groupe_Pupitre,
          nombreAbsenceRep: 0,
          nb_prensenceRep: 0,
          nb_prensenceConcert: 0,
          nombreAbsenceConcert: 0,
        });

        user
          .save()
          .then((response) => {
            const newUser = response.toObject();
            res.status(201).json({
              user: newUser,
              message: "Utilisateur créé",
            });
          })
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const statusUpdatesToday = [];
const updateStatus = async (req, res) => {
  const userId = req.params.userId;
  const { newStatus } = req.body;
  const { saisons } = req.body;
  try {
    if (!["Inactif", "Junior", "Senior", "Veteran"].includes(newStatus)) {
      return res.status(400).json({ error: "Statut invalide" });
    }

    const user = await Utilisateur.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    user.historiqueActivite.push({
      Saison: saisons,
      status: newStatus,
    });
    statusUpdatesToday.push({
      nom: user.nom,
      prenom: user.prenom,
      status: newStatus,
      pupitre: user.tessitureVocale,
    });

    await user.save();

    res.json({ message: "Statut mis à jour avec succès" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
const tessitureUpdatesToday = [];

const UpdateTessitureVocal = async (req, res) => {
  const choristeId = req.params.id;
  const { tessitureVocale } = req.body;

  try {
    const updatedCandidat = await Utilisateur.findByIdAndUpdate(
      choristeId,
      { tessitureVocale },
      { new: true }
    );

    if (!updatedCandidat) {
      return res.status(404).json({ error: "Candidat not found" });
    }

    tessitureUpdatesToday.push({
      nom: updatedCandidat.nom,
      prenom: updatedCandidat.prenom,
      nouveauTessiture: tessitureVocale,
      pupitre: updatedCandidat.tessitureVocale,
    });
    console.log(tessitureUpdatesToday);
    res.json(updatedCandidat);
  } catch (error) {
    console.error("Error updating tessitureVocale:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Tâche cron pour notifier à 22:00 PM que il ya un modification de tessiture vocal

//24.  Recevoir les notifications sur les modifications des tessiture des choristes

const recevoirNotifTessiture = async (req, res) => {
  const client = new net.Socket();
  client.connect(12345, "127.0.0.1", async () => {
    const message = `Mises à jour du tessiture vocal aujourd'hui  :\n${tessitureUpdatesToday
      .map(
        (update) =>
          `- Choriste: ${update.nom}   ${update.prenom} ,  Nouveau  tessiture vocal : ${update.nouveauTessiture}`
      )
      .join("\n")}`;
    client.write(message);
    client.end();
  });

  tessitureUpdatesToday = [];
};

cron.schedule("35 18 * * *", async () => {
  await recevoirNotifTessiture();
});

//24. Recevoir les notifications sur les modifications des statuts des choristes
const recevoitNotifStatus = async (req, res) => {
  const client = new net.Socket();
  client.connect(12345, "127.0.0.1", async () => {
    const message = `Mises à jour du Status  aujourd'hui  :\n${statusUpdatesToday
      .map(
        (update) =>
          `- Choriste: ${update.nom}   ${update.prenom} ,  Nouveau  status : ${update.status}`
      )
      .join("\n")}`;
    client.write(message);
    client.end();
  });

  statusUpdatesToday = [];
};

cron.schedule("35 18 * * *", async () => {
  await recevoitNotifStatus();
});

// 11. voir liste des choriste disponible à un concert
const getChoristeParConcert = async (req, res) => {
  try {
    const concertId = req.params.concertId;
    const concert = await Concert.findById(concertId);

    if (!concert) {
      return res.status(404).json({ error: "Concert not found" });
    }

    const choristesDisponibles = concert.disponible.filter(
      (dispo) => dispo.diponiblitee === true
    );

    const choristesResponse = await Promise.all(
      choristesDisponibles.map(async (dispo) => {
        const choriste = await Utilisateur.findById({ _id: dispo.choriste });
        return {
          _id: choriste._id,
          nom: choriste.nom,
          prenom: choriste.prenom,
          email: choriste.email,
          tessitureVocale: choriste.tessitureUpdatesToday,
        };
      })
    );

    res.status(200).json(choristesResponse);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

//10. indiquer disponibilité
const IndiquerDisponibilté = async (req, res) => {
  try {
    const concertId = req.params.id;
    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({ error: "token nexiste pas" });
    }
    if (!token.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Format de token invalide" });
    }

    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      "RANDOM_TOKEN_SECRET"
    );
    const choristeId = decoded.userId;

    const diponiblitee = req.body.diponiblitee;

    const choriste = await Utilisateur.findOne({ _id: choristeId });
    console.log(choriste);
    if (!choriste) {
      console.error("Utilisateur non trouvé.");
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    if (choriste.role !== "choriste") {
      return res.status(403).json({
        message:
          "Accès non autorisé seul le choriste peur indiquer sa disponibilité",
      });
    }

    const updatedConcert = await Concert.findByIdAndUpdate(
      concertId,
      {
        $push: {
          disponible: {
            choriste: choristeId,
            diponiblitee: diponiblitee,
          },
        },
      },
      { new: true }
    );

    choriste.concert.push(concertId);
    await choriste.save();

    res.status(200).json(updatedConcert);
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de la disponibilité" });
  }
};

// Fonction pour créer des jobs de notification
function planifierRappel(repetition, utilisateur) {
  // Rappel 2 jours avant la répétition
  const rappelDeuxJoursAvant = new Date(repetition.date);
  rappelDeuxJoursAvant.setDate(rappelDeuxJoursAvant.getDate() - 2);

  // Rappel la veille de la répétition (deux fois par jour)
  const rappelLaVeilleMatin = new Date(repetition.date);
  rappelLaVeilleMatin.setDate(rappelLaVeilleMatin.getDate() - 1);
  rappelLaVeilleMatin.setHours(9, 0, 0); // Heure du matin (9:00 AM)

  const rappelLaVeilleSoir = new Date(repetition.date);
  rappelLaVeilleSoir.setDate(rappelLaVeilleSoir.getDate() - 1);
  rappelLaVeilleSoir.setHours(18, 0, 0); // Heure du soir (6:00 PM)

  // Planification des rappels
  schedule.scheduleJob(
    `rappelDeuxJoursAvant_${repetition._id}`,
    rappelDeuxJoursAvant,
    () => {
      // Envoyer la notification ou effectuer l'action nécessaire
      console.log(
        `Rappel 2 jours avant la répétition pour ${utilisateur.nom} ${utilisateur.prenom}`
      );
    }
  );

  schedule.scheduleJob(
    `rappelLaVeilleMatin_${repetition._id}`,
    rappelLaVeilleMatin,
    () => {
      // Envoyer la notification ou effectuer l'action nécessaire (matin)
      console.log(
        `Rappel la veille (matin) de la répétition pour ${utilisateur.nom} ${utilisateur.prenom}`
      );
    }
  );

  schedule.scheduleJob(
    `rappelLaVeilleSoir_${repetition._id}`,
    rappelLaVeilleSoir,
    () => {
      // Envoyer la notification ou effectuer l'action nécessaire (soir)
      console.log(
        `Rappel la veille (soir) de la répétition pour ${utilisateur.nom} ${utilisateur.prenom}`
      );
    }
  );
}

function rappel_repetition_choristes_noncongé() {
  // Exemple d'utilisation
  repetition
    .find({
      /* Conditions pour sélectionner la répétition */
    })
    .then((repetitions) => {
      if (!repetitions || repetitions.length === 0) {
        console.log("Répétition non trouvée.");
        return;
      }

      // Remplacez le code ci-dessous par la recherche de tous les choristes non en congé
      Utilisateur.find({ role: "choriste", etat: { $ne: "EnConge" } })
        .then((choristes) => {
          if (choristes.length === 0) {
            console.log("Aucun choriste à rappeler.");
            return;
          }

          // Parcourez chaque répétition
          repetitions.forEach((rep) => {
            // Planifiez les rappels pour chaque choriste et cette répétition
            choristes.forEach((utilisateur) => {
              planifierRappel(rep, utilisateur);
            });
          });
        })
        .catch((err) => {
          console.error("Erreur lors de la recherche des choristes:", err);
        });
    })
    .catch((err) => {
      console.error("Erreur lors de la recherche de la répétition:", err);
    });
}

module.exports = { rappel_repetition_choristes_noncongé };

// Appelez la fonction pour planifier les rappels et envoyer les notifications
//rappel_repetition_choristes_noncongé();

//notification rappel la veille de repetition
const RappelRepetition2 = async () => {
  try {
    const aujourdHui = new Date();

    // Calculez la date de demain
    const demain = new Date();
    demain.setDate(aujourdHui.getDate() + 1);
    //console.log("demainnn",demain)
    const dateDemain = demain.toISOString().split("T")[0];

    // Vérifiez s'il y a une répétition demain

    const rehearsalsTomorrow = await repetition.find({ date: dateDemain });
    // console.log("affiche",rehearsalsTomorrow)
    if (rehearsalsTomorrow.length > 0) {
      // Si des répétitions sont prévues demain, envoyez un rappel à tous les utilisateurs non en congé
      const usersNotOnLeave = await Utilisateur.find({
        etat: { $ne: "EnConge" },
      });
      //console.log("affiche",usersNotOnLeave)
      if (usersNotOnLeave.length > 0) {
        const sendMessage = async (utilisateur) => {
          const client = new net.Socket();
          client.connect(12345, "127.0.0.1", async () => {
            const message = `Rappel: Répétition demain. Utilisateur non en congé: ${utilisateur.prenom} ${utilisateur.nom}`;
            client.write(message);
            client.end();
          });
        };
        // Set max listeners to a higher value
        process.setMaxListeners(15);
        for (const utilisateur of usersNotOnLeave) {
          await sendMessage(utilisateur);
        }
      } else {
        console.log("Aucun utilisateur non en congé pour envoyer un rappel");
      }
    } else {
      console.log("Aucune répétition prévue demain");
    }
    lastCronRun = aujourdHui;
  } catch (error) {
    console.error(
      "Erreur lors de la notification de les users :",
      error.message
    );
  }
};
module.exports = { RappelRepetition2 };

const RappelRepetition2javant = async () => {
  try {
    const aujourdHui = new Date();

    // Calculez la date d'après-demain
    const apresDemain = new Date();
    apresDemain.setDate(aujourdHui.getDate() + 2);
    const dateApresDemain = apresDemain.toISOString().split("T")[0];

    // Calculez la date de demain
    const demain = new Date();
    demain.setDate(aujourdHui.getDate() + 1);
    const dateDemain = demain.toISOString().split("T")[0];

    // Vérifiez s'il y a une répétition aujourd'hui
    const rehearsalsToday = await repetition.find({
      date: aujourdHui.toISOString().split("T")[0],
    });

    // Vérifiez s'il y a une répétition demain
    const rehearsalsTomorrow = await repetition.find({ date: dateDemain });

    // Vérifiez s'il y a une répétition après-demain
    const rehearsalsDayAfterTomorrow = await repetition.find({
      date: dateApresDemain,
    });

    if (
      rehearsalsToday.length > 0 ||
      rehearsalsTomorrow.length > 0 ||
      rehearsalsDayAfterTomorrow.length > 0
    ) {
      // Si des répétitions sont prévues aujourd'hui, demain ou après-demain, envoyez un rappel à tous les utilisateurs non en congé
      const usersNotOnLeave = await Utilisateur.find({
        etat: { $ne: "EnConge" },
        role: { $ne: "admin" },
      });

      if (usersNotOnLeave.length > 0) {
        const sendMessage = async (utilisateur, message) => {
          const client = new net.Socket();
          client.connect(12345, "127.0.0.1", async () => {
            client.write(message);
            client.end();
          });
        };

        // Set max listeners to a higher value
        process.setMaxListeners(15);

        // Envoyez un rappel 2 jours avant la répétition
        for (const utilisateur of usersNotOnLeave) {
          const message = `Rappel: Répétition dans 2 jours. Utilisateur non en congé: ${utilisateur.prenom} ${utilisateur.nom}`;
          await sendMessage(utilisateur, message);
        }

        // Envoyez un rappel la veille de la répétition
        for (const utilisateur of usersNotOnLeave) {
          const message = `Rappel: Répétition demain. Utilisateur non en congé: ${utilisateur.prenom} ${utilisateur.nom}`;
          await sendMessage(utilisateur, message);
        }
      } else {
        console.log("Aucun utilisateur non en congé pour envoyer un rappel");
      }
    } else {
      console.log(
        "Aucune répétition prévue aujourd'hui, demain ou après-demain"
      );
    }

    lastCronRun = aujourdHui;
  } catch (error) {
    console.error(
      "Erreur lors de la notification des utilisateurs :",
      error.message
    );
  }
};

cron.schedule("29 19 * * *", async () => {
  console.log("Exécution de la notification de rappel  quotidienne à 20:00...");
  await RappelRepetition2javant();
  console.log("Tâche cron exécutée à 20h");
});

cron.schedule("46 10 * * *", async () => {
  console.log("Exécution de la notification de rappel  quotidienne à 10:00...");
  await RappelRepetition2javant();
  console.log("Tâche cron exécutée à 10h");
});

//archive user
/*
const archiveUsersBySeason = async () => {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    // Mettre à jour les utilisateurs dont la saison est inférieure à l'année actuelle
    const updateResult = await Utilisateur.updateMany(
      {
        Saison: { $lt: new Date(currentYear, 0, 1) }, // Utilisez une date pour représenter le début de l'année actuelle
        archived: false, // Archiver uniquement ceux qui ne le sont pas déjà
      },
      { $set: { archived: true } }
    );

    console.log(`Archivage réussi pour ${updateResult.nModified} utilisateurs.`);
  } catch (error) {
    console.error('Erreur lors de l\'archivage des utilisateurs :', error);
  }
};*/

const archiveUsersBySeason = async () => {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    // Mettre à jour les utilisateurs dont la saison est inférieure à l'année actuelle
    const updateResult = await Utilisateur.updateMany(
      {
        saison: { $lt: currentYear }, // Assurez-vous que le champ saison est correctement représenté
        archived: false, // Archiver uniquement ceux qui ne le sont pas déjà
      },
      { $set: { archived: true } }
    );

    console.log(`Archivage réussi pour ${updateResult._id} utilisateurs.`);
  } catch (error) {
    console.error(
      "Erreur lors de l'archivage des utilisateurs :",
      error.message
    );
  }
};

//envoyer une notification d'information rapide :
/*const getChoristeByChefPupitre = (req, res) => {
  const pupitreId = req.params.id;

  // Récupérez le pupitre spécifié par l'identifiant
  Utilisateur.findById(pupitreId)
    .then((pupitre) => {
      if (!pupitre || pupitre.role !== 'chefPupitre') {
        throw new Error('Pupitre non trouvé ou n\'a pas le rôle "pupitre"');
      }

      // Récupérez tous les choristes avec le même pupitre
      return Utilisateur.find({ tessitureVocale: pupitre.tessitureVocale ,role: 'choriste'});
    })
    .then((choristes) => {
      // Filtrez les choristes ayant la même tessiture que le pupitre si nécessaire
      // const choristesAvecMemeTessiture = choristes.filter(choriste => choriste.tessitureVocale === pupitre.nom);
      choristes.forEach((choriste) => {
        nodemailer2.sendUpdateRepetitionEmail(
          choriste.nom,
          choriste.prenom,
          choriste.email,
          // savedUser.activationCode,
        );
      });
      res.status(200).json(choristes);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
};*/

const sendEmailToChoristesWithSameTessiture = async (req, res) => {
  //const repetitionId = req.params.repetitionId;
  const pupitreId = req.params.pupitreId;

  try {
    // Recherche du pupitre par ID
    const pupitre = await Utilisateur.findById(pupitreId);

    if (!pupitre || pupitre.role !== "chefPupitre") {
      throw new Error('Pupitre non trouvé ou n\'a pas le rôle "chefPupitre"');
    }
    // Récupération de la dernière mise à jour de répétition dans le tableau repetitionUpdatesToday
    const derniereMiseAJour =
      repetitionUpdatesToday[repetitionUpdatesToday.length - 1];
    console.log("rep1", repetitionUpdatesToday);
    console.log("rep2", derniereMiseAJour.id);
    const repetitionId = derniereMiseAJour.id;
    const lieu = derniereMiseAJour.lieu;
    console.log("lieu", lieu);
    // Récupération de la répétition avec le pupitre et ses participants
    const repetitionAvecParticipants = await repetition
      .findById(repetitionId)
      .populate({
        path: "participants.choriste",
        select: "nom prenom email tessitureVocale",
      });

    if (!repetitionAvecParticipants) {
      throw new Error("Répétition non trouvée");
    }

    // Filtrer les participants ayant la même tessiture que le pupitre
    const choristesAvecMemeTessiture =
      repetitionAvecParticipants.participants.filter(
        (participant) =>
          participant.choriste.tessitureVocale === pupitre.tessitureVocale
      );
    console.log("emal", choristesAvecMemeTessiture);
    // Envoyer un e-mail à chaque choriste
    for (const participant of choristesAvecMemeTessiture) {
      const { nom, prenom, email } = participant.choriste;
      console.log("emal", repetitionAvecParticipants);

      await nodemailer2.sendUpdateRepetitionEmail(nom, prenom, email, lieu);
    }

    res.status(200).json({
      message:
        "E-mails envoyés avec succès aux choristes ayant la même tessiture que le pupitre.",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

//envoyer une notification d'information rapide zyneb :
const repetitionUpdatesToday = [];
console.log("rep", repetitionUpdatesToday);

const Updaterepetition = async (req, res) => {
  const repetitionId = req.params.id;
  const { lieu } = req.body;

  try {
    const updatedRepetition = await repetition.findByIdAndUpdate(
      repetitionId,
      { lieu },
      { new: true }
    );

    if (!updatedRepetition) {
      return res.status(404).json({ error: "Candidat not found" });
    }

    repetitionUpdatesToday.push({
      lieu: updatedRepetition.lieu,
      date: updatedRepetition.date,
      id: updatedRepetition._id,
    });
    console.log(repetitionUpdatesToday);
    res.json(updatedRepetition);
  } catch (error) {
    console.error("Error updating date ou lieu :", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// voir liste finales des choriste disponible à un concert
const getChoristefinalParConcert = async (req, res) => {
  try {
    // console.log("nnnnnnnnnnnnnn"+tessitureUpdatesToday)
    const userId = req.params.id;
    const choristes = await Utilisateur.find({ concert: userId }).select(
      "-login -password -absence -concert"
    );

    const choristesAvecDispo = await Promise.all(
      choristes.map(async (choriste) => {
        const concert = await Concert.findById(userId);
        // console.log(concert);

        const dispo = concert.disponible.find(
          (dispo) =>
            dispo.choriste.toString() === choriste._id.toString() &&
            dispo.diponiblitee === true
        );
        return dispo && dispo.diponiblitee ? choriste : null;
      })
    );

    const choristesFiltres = choristesAvecDispo.filter(Boolean);

    res.status(200).json(choristesFiltres);
  } catch (error) {
    // console.error(error.message);
    res.status(500).json({
      error: "Erreur lors de la récupération des choristes de cette catégorie",
    });
  }
};

//Get etat

const getPresenceByChefPupitreAndPlanning = async (req, res) => {
  try {
    const chefPupitreId = req.params.chefPupitre;
    const repetitionId = req.params.repetitionId;

    // Récupérer le chef de pupitre
    const chefPupitre = await Utilisateur.findOne({
      _id: chefPupitreId,
      role: "chefPupitre",
    });

    if (!chefPupitre) {
      return res.status(404).json({ message: "Chef de pupitre non trouvé" });
    }

    // Récupérer les choristes du même type de pupitre que le chef de pupitre
    const choristes = await Utilisateur.find({
      pupitre: chefPupitre.pupitre,
      role: "choriste",
    });

    // Récupérer les absences des choristes dans la répétition
    const absences = await Absence.find({
      repetitions: repetitionId,
      choriste: { $in: choristes.map((choriste) => choriste._id) },
      Presence: true,
    }).populate("choriste");

    const choristesPresent = absences.map((absence) => ({
      choriste: absence.choriste,
      present: true,
    }));

    res.status(200).json(choristesPresent);
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération de la présence" });
  }
};
module.exports = { getPresenceByChefPupitreAndPlanning };

const user = "mariemmhiri82@gmail.com"; // hedhi t7ot feha l email
const pass = "izcm jpry ncke ifqn"; // houni lazmek ta3mel generation lel code hedha gmail apps

//10. indiquer disponibilité

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: user,
    pass: pass,
  },
});
const EmailTodisponiblechoriste = async (req, res) => {
  try {
    const concertId = req.body.concertId;
    const concert = await Concert.findById(concertId).populate(
      "disponible.choriste"
    );

    console.log(concert);
    const eligibleChoristers = concert.disponible.filter(
      (chorister) => chorister.diponiblitee === true
    );

    console.log(eligibleChoristers);
    const mailOptions = {
      from: "oumaimaakaichi00@gmail.com",
      subject: "Your Concert Participation Confirmation",
      text: "Your concert participation has been confirmed. Thank you for your commitment!",
    };

    for (const chorister of eligibleChoristers) {
      mailOptions.to = chorister.choriste.email;
      console.log(chorister.choriste.email);
      await transport.sendMail(mailOptions);
    }

    res.status(200).json({ message: "Confirmation emails sent successfully." });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error sending confirmation emails." });
  }
};

function generateRandomURL() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomURL = "https:";

  for (let i = 0; i < 10; i++) {
    randomURL += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  randomURL += ".com";

  return randomURL;
}

//16. retourner tous les détails du profil  (historique de l'activité): choriste et admin peuvent voir
const profil = async (req, res) => {
  const userId = req.params.id;

  try {
    const utilisateur = await Utilisateur.findById(userId)
      .populate({
        path: "concert",
        model: "Concert",
        select: "-disponible -participants -presences -absences",

        populate: {
          path: "disponible.choriste",
          model: "User",
          select: " -disponible",
        },
      })
      .populate({
        path: "absence",
        model: "Absence",
      })
      .select("-login -password -absence")
      .exec();

    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    if (utilisateur.role !== "admin" && utilisateur.role !== "choriste") {
      return res.status(403).json({
        message:
          "Accès non autorisé seul admin ou choriste peut voire son profil",
      });
    }

    const concertsWithAvailability = utilisateur.concert.map((concert) => {
      const filteredDisponibilites = concert.disponible
        ? concert.disponible.filter(
            (disponibilite) =>
              disponibilite.choriste &&
              disponibilite.choriste._id.toString() === userId
          )
        : [];

      return {
        ...concert.toObject(),
        disponible: filteredDisponibilites,
      };
    });

    res.status(200).json({
      profil: {
        ...utilisateur.toObject(),
        concert: concertsWithAvailability,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

function Le_meme_date(date1, date2) {
  const sameYear = date1.getFullYear() === date2.getFullYear();
  const sameMonth = date1.getMonth() === date2.getMonth();
  const sameDay = date1.getDate() === date2.getDate();

  return sameYear && sameMonth && sameDay;
}

function generateUrl(req, res) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomURL = "https:";

  for (let i = 0; i < 10; i++) {
    randomURL += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  randomURL += ".com";

  return randomURL;
}

//9:  marquer presence dans un Répetition
const marquerPresenceRepetition = async (req, res) => {
  try {
    const { id_repetition, urlQR } = req.params;
    let compteId = req.body.choriste;

    const repetition = await Repetition.findOne({ _id: id_repetition });

    if (!repetition) {
      return res.status(404).json({ error: "Repetetion non trouvée " });
    }

    if (repetition.urlQR !== urlQR) {
      return res.status(400).json({
        error: "L'URL QR ne correspond pas à la qrCode de  la repetetion",
      });
    }
    console.log("Request Body:", req.body.choriste);

    console.log("ID du compte:", compteId);

    if (!compteId) {
      return res.status(401).json({ error: "Token invalide ou expiré" });
    }

    const choriste = await Utilisateur.findById({ _id: compteId });

    console.log("Choriste trouvé:", choriste);

    if (!choriste) {
      return res.status(404).json({ error: "Choriste non trouvé" });
    }

    const dateInsertion = new Date();
    const dateRepetition = new Date(repetition.date);

    if (!Le_meme_date(dateInsertion, dateRepetition)) {
      return res.status(400).json({
        error: "La présence ne peut être creer que le jour de la répétition",
      });
    }

    const nouvelleAbsence = new Absence({
      Presence: true,
      choriste: compteId,
      repetitions: repetition._id,
      QRCodeRep: urlQR,
    });
    try {
      console.log("Before update:", choriste.nb_presence);
      await Utilisateur.updateOne(
        { _id: compteId },
        { nb_prensenceRep: choriste.nb_prensenceRep + 1 }
      );
      choriste.absence.push(nouvelleAbsence._id);
      await choriste.save();
      repetition.absence.push(nouvelleAbsence._id);
      await repetition.save();
      const absenceEnregistree = await nouvelleAbsence.save();

      res.status(201).json({
        absence: absenceEnregistree,
        message: "présence créée avec succès !",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//3:  login
const login = (req, res) => {
  try {
    Utilisateur.findOne({ login: req.body.login })
      .then((user) => {
        if (!user) {
          return res
            .status(401)
            .json({ message: "login ou mot de passe incorecte" });
        }
        bcrypt
          .compare(req.body.password, user.password)
          .then((valide) => {
            if (!valide) {
              return res
                .status(401)
                .json({ message: " mot de passe incorecte" });
            }

            res.status(200).json({
              token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
                expiresIn: "24h",
              }),
            });
          })
          .catch((error) => res.status(500).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//teja qr repetitons
//9:  marquer presence dans un Répetition
const marquerPresenceRepetitionss = async (req, res) => {
  try {
    const { id_repetition } = req.params;
    console.log("ID de la répétition :", id_repetition);

    // Vérification de la présence du jeton d'authentification dans l'en-tête
    const token = req.header("Authorization");
    if (!token) {
      console.log("Token manquant");
      return res.status(401).json({ error: "Token invalide ou expiré" });
    }
    console.log("Token trouvé :", token);

    // Extraction de l'identifiant de l'utilisateur à partir du jeton
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      "RANDOM_TOKEN_SECRET"
    );
    const compteId = decoded.userId;
    console.log("ID de l'utilisateur :", compteId);

    // Recherche de la répétition dans la base de données
    const repetition = await Repetition.findOne({ _id: id_repetition });
    if (!repetition) {
      console.log("Répétition non trouvée");
      return res.status(404).json({ error: "Répétition non trouvée" });
    }
    console.log("Répétition trouvée :", repetition);

    // Recherche de l'utilisateur dans la base de données
    const choriste = await Utilisateur.findById(compteId);
    if (!choriste) {
      console.log("Choriste non trouvé");
      return res.status(404).json({ error: "Choriste non trouvé" });
    }
    console.log("Choriste trouvé :", choriste);

    const choristeExistsInRehearsal = repetition.participants.some(
      (participant) => {
        return participant._id.toString() === compteId;
      }
    );

    if (!choristeExistsInRehearsal) {
      return res.status(404).json({
        error: "Le choriste n'est pas un participant de cette répétition",
      });
    }

    //  // Vérification si le choriste a déjà marqué sa présence pour cette répétition
    const absenceExistante = await Absence.findOne({
      choriste: compteId,
      repetitions: repetition._id,
    });
    if (absenceExistante) {
      return res.status(400).json({
        error: "Le choriste a déjà indiqué sa présence pour cette répétition",
      });
    }

    // Validation de la date de la répétition
    const dateInsertion = new Date();
    const dateRepetition = new Date(repetition.date);
    if (!Le_meme_date(dateInsertion, dateRepetition)) {
      console.log("La date ne correspond pas");
      return res.status(400).json({
        error: "La présence ne peut être créée que le jour de la répétition",
      });
    }
    console.log("Date de répétition valide :", dateRepetition);

    // Création de la présence
    const nouvelleAbsence = new Absence({
      Presence: true,
      choriste: compteId,
      repetitions: repetition._id,
    });
    console.log("Nouvelle absence :", nouvelleAbsence);

    // Mise à jour du nombre de présences de l'utilisateur
    await Utilisateur.updateOne(
      { _id: compteId },
      { nb_prensenceRep: choriste.nb_prensenceRep + 1 }
    );
    console.log("Nombre de présences de l'utilisateur mis à jour");

    // Enregistrement de l'absence et mise à jour de la répétition
    choriste.absence.push(nouvelleAbsence._id);
    repetition.absence.push(nouvelleAbsence._id);
    await Promise.all([
      choriste.save(),
      repetition.save(),
      nouvelleAbsence.save(),
    ]);
    console.log("Absence enregistrée et répétition mise à jour");

    // Réponse avec succès
    return res.status(201).json({
      message: "Présence créée avec succès !",
      choriste: {
        nom: choriste.nom,
        prenom: choriste.prenom,
        email: choriste.email,
      },
    });
  } catch (error) {
    // Gestion des erreurs
    console.error("Erreur :", error);
    return res.status(500).json({ error: error.message });
  }
};
//teja qr concerts
//9: marquer presence dans un concert
const marquerPresenceConcert = async (req, res) => {
  try {
    const { id_Concert } = req.params;

    // Check if Authorization header is present
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ error: "Token does not exist" });
    }
    if (!token.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      "RANDOM_TOKEN_SECRET"
    );
    const compteId = decoded.userId;
    console.log("Connected choriste present", compteId);

    const concert = await Concert.findOne({ _id: id_Concert });

    if (!concert) {
      return res.status(404).json({ error: "Concert not found" });
    }

    const choristeExistsInRehearsal = concert.participants.some(
      (participant) => participant.choriste.toString() === compteId
    );

    if (!choristeExistsInRehearsal) {
      return res.status(404).json({
        error: "Le choriste n'est pas un participant de ce concert",
      });
    }

    const dateInsertion = new Date();
    const dateConcert = new Date(concert.date);

    if (!Le_meme_date(dateInsertion, dateConcert)) {
      return res.status(400).json({
        error: "La présence ne peut être créée que le jour de la concert",
      });
    }

    console.log("Request Body:", req.body.choriste);
    console.log("ID du compte du choriste connecté:", compteId);

    if (!compteId) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const choriste = await Utilisateur.findById(compteId);

    console.log("Choriste trouvé:", choriste);

    if (!choriste) {
      return res.status(404).json({ error: "Choriste not found" });
    }
    // Check if the choriste has already marked his presence
    const choristeAlreadyPresent = concert.presences.some(
      (presence) => presence.choriste.toString() === compteId
    );
    if (choristeAlreadyPresent) {
      return res.status(400).json({
        error: "Choriste a deja marqué  presence pour ce concert",
      });
    }

    // Initialize concert.presences if it doesn't exist
    if (!concert.presences) {
      concert.presences = [];
    }
    console.log("Avant l'ajout de la présence :", concert.presences);
    concert.presences.push({
      present: true,
      choriste: compteId,
    });
    console.log("Après l'ajout de la présence :", concert.presences);

    try {
      await Utilisateur.updateOne(
        { _id: compteId },
        { $inc: { nb_prensenceConcert: 1 } } // Increment the nb_prensenceConcert field
      );
      await concert.save();
      console.log("Après Sauvgarde concert :", concert.presences);
      choriste.concert.push(concert._id);
      await choriste.save();
      const choristeInfo = {
        nom: choriste.nom,
        prenom: choriste.prenom,
        email: choriste.email,
      };
      res.status(201).json({
        presence: concert,
        choriste: choristeInfo,
        message: "Presence enregitré avec succes!",
      });
    } catch (error) {
      console.error("Error while updating utilisateur or concert:", error);
      res.status(500).json({ error: error.message });
    }
  } catch (error) {
    console.error("Error in marquerPresenceConcert function:", error);
    res.status(500).json({ error: error.message });
  }
};

//23. marquer presence d'un choriste manuellemet

const marquerPresenceManuellementA_repitition = async (req, res) => {
  try {
    const repetetionId = req.params.id;
    const choristeId = req.body._id;
    const present = req.body.present;

    const raisonAjoutManuellement = req.body.raisonAjoutManuellement;
    const repetition = await Repetition.findOne({ _id: repetetionId });
    const choristes = await Utilisateur.findById({ _id: choristeId });

    if (choristes.role !== "choriste") {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    const choristeExistsInRehearsal = repetition.participants.some(
      (participant) => participant.choriste.toString() === choristeId
    );
    if (!choristeExistsInRehearsal) {
      return res
        .status(404)
        .json({ message: "Choriste not found in the rehearsal participants" });
    }
    const nouvelleAbsence = new Absence({
      Presence: present,
      choriste: choristeId,
      repetitions: repetetionId,
      raisonAjoutManuellement: raisonAjoutManuellement,
    });
    try {
      if (present === true) {
        await Utilisateur.updateOne(
          { _id: choristeId },
          { nb_prensenceRep: choristes.nb_prensenceRep + 1 }
        );
      } else {
        await Utilisateur.updateOne(
          { _id: choristeId },
          { nombreAbsenceRep: choristes.nombreAbsenceRep + 1 }
        );
      }

      choristes.absence.push(nouvelleAbsence._id);
      await choristes.save();
      repetition.absence.push(nouvelleAbsence._id);
      await repetition.save();
      const absenceEnregistree = await nouvelleAbsence.save();

      res.status(201).json({
        absence: absenceEnregistree,
        message: "présence créée avec succès !",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: " Erreur" });
  }
};

//23. marquer presence d'un choriste manuellemet à un  cocert

const marquerPresenceManuellementA_concert = async (req, res) => {
  try {
    const ConcertId = req.params.id;
    const choristeId = req.body.choriste;
    const present = req.body.present;
    const raisonAjoutManuellement = req.body.raisonAjoutManuellement;
    const concert = await Concert.findOne({ _id: ConcertId });
    const choristes = await Utilisateur.findById({ _id: choristeId });
    const choristeExistsInRehearsal = concert.participants.some(
      (participant) => participant.choriste.toString() === choristeId
    );
    if (!choristeExistsInRehearsal) {
      return res
        .status(404)
        .json({ message: "Choriste not found in the rehearsal Concert" });
    }
    if (choristes.role !== "choriste") {
      return res.status(403).json({ message: "Accès non autorisé" });
    }
    concert.presences.push({
      present: present,
      choriste: choristeId,
      raisonAjoutManuellement: raisonAjoutManuellement,
    });
    try {
      choristes.concert.push(concert._id);
      if (present === true) {
        await Utilisateur.updateOne(
          { _id: choristeId },
          { nb_prensenceConcert: choristes.nb_prensenceConcert + 1 }
        );
      } else {
        await Utilisateur.updateOne(
          { _id: choristeId },
          { nombreAbsenceConcert: choristes.nombreAbsenceConcert + 1 }
        );
      }

      await concert.save();

      await choristes.save();
      res.status(201).json({
        absence: concert,
        message: "présence créée avec succès !",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de la disponibilité" });
  }
};
//teja qr repetitions
//marquer les choristes qui ne participent pas aux répétitions comme absents
cron.schedule("58 22 * * *", async () => {
  try {
    console.log("Daily absence check started.");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const rehearsalsToday = await Repetition.find({
      date: {
        $gte: today.toISOString(),
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      },
    })
      .populate("participants")
      .populate("absence");

    console.log("Rehearsals today:", rehearsalsToday);

    for (const rehearsal of rehearsalsToday) {
      console.log("Processing rehearsal:", rehearsal._id);

      for (const participant of rehearsal.participants) {
        console.log("Processing participant:", participant._id);

        // Check if the participant is already marked as absent for this rehearsal
        const existingAbsence = await Absence.findOne({
          choriste: participant._id,
          repetitions: rehearsal._id,
        });

        if (!existingAbsence) {
          console.log("Participant is absent. Marking as absent.");

          const absence = new Absence({
            choriste: participant._id,
            repetitions: rehearsal._id,
            date_absence: rehearsal.date,
            etat: "Absent",
            Presence: false,
          });

          const updatedAbsenceRepCount = isNaN(participant.nombreAbsenceRep)
            ? 1
            : participant.nombreAbsenceRep + 1;

          await absence.save();
          // Incrémenter le nombre d'absences pour le choriste
          const chorister = await Utilisateur.findByIdAndUpdate(
            participant._id,
            { $inc: { nombreAbsenceRep: 1 } }
          );

          // Save the updated chorister document
          await chorister.save();

          console.log("Participant marked as absent.");
        } else {
          console.log(
            "Participant is already marked as absent for this rehearsal. Skipping."
          );
        }
      }
    }

    console.log("Daily absence check completed.");
  } catch (error) {
    console.error("Error in daily absence check:", error);
  }
});

//marquer les choristes qui ns partcipents pas au concert absents
const abs = [];
const absenceRep = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const rehearsalsToday = await Repetition.find({
      date: {
        $gte: today.toISOString(),
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      },
    }).populate("participants.choriste"); // Populate participants.choriste field

    for (const rehearsal of rehearsalsToday) {
      const allChoristers = rehearsal.participants.map((participant) =>
        participant.choriste._id.toString()
      );

      for (const a of allChoristers) {
        const ab = await Absence.findOne({
          choriste: a,
          repetitions: rehearsal._id,
        });
        if (!ab) {
          abs.push(a);
        }

        if (ab) {
          console.log("Found Absence:", ab);
        } else {
          console.log("No Absence found for chorister ID:", a);
        }
      }

      for (const cb of abs) {
        console.log("rrrrrrrrrrrr" + abs);

        const chorister = await Utilisateur.findById(cb);

        if (!chorister) {
          console.error(`Chorister with ID ${choristerId} not found.`);
          continue;
        }
        console.log(rehearsalsToday);
        const absence = new Absence({
          choriste: chorister._id,
          repetitions: rehearsal._id,
          date_absence: rehearsal.date,
          etat: "Absent",
          Presence: false,
        });
        // Update the chorister's absence count
        await Utilisateur.updateOne(
          { _id: chorister._id },
          { nombreAbsenceRep: chorister.nombreAbsenceRep + 1 }
        );

        await absence.save();

        rehearsal.absence.push(absence._id);
      }
    }

    console.log("Daily absence check completed.");
  } catch (error) {
    console.error("Error in daily absence check:", error);
  }
};

cron.schedule("30 21 * * *", async () => {
  await absenceRep();
  abs = [];
});

//marquer les choristes qui ns partcipents pas au concert absents
const absentConcert = [];

const absenceConcerts = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log("Recherche des concerts pour aujourd'hui :", today);

    const rehearsalsToday = await Concert.find({
      date: {
        $gte: today.toISOString(),
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      },
    }).populate("participants.choriste");

    if (!rehearsalsToday || rehearsalsToday.length === 0) {
      console.log("Aucun concert trouvé pour aujourd'hui.");
      return res
        .status(404)
        .json({ message: "Aucun concert trouvé pour aujourd'hui." });
    }

    console.log("Concerts trouvés pour aujourd'hui :", rehearsalsToday);

    for (const rehearsal of rehearsalsToday) {
      const allChoristers = rehearsal.participants
        .map((participant) =>
          participant && participant.choriste
            ? participant.choriste._id.toString()
            : null
        )
        .filter(Boolean);

      console.log("Choristes participant au concert :", allChoristers);

      const absentChoristers = new Set(allChoristers);

      console.log("Choristes absents :", absentChoristers);

      if (!rehearsal.presences) {
        console.log(
          "Rehearsal.presences is not defined. Initializing as an empty array."
        );
        rehearsal.presences = []; // Initialize rehearsal.presences if it's not defined
      }

      for (const choristerId of absentChoristers) {
        console.log("Vérification de la présence du choriste :", choristerId);

        const chorister = await Utilisateur.findById(choristerId);

        if (!chorister) {
          console.log("Choriste non trouvé pour l'ID :", choristerId);
          continue;
        }

        console.log("Choriste trouvé :", chorister);

        const isAlreadyPresent = rehearsal.presences.some(
          (presence) => presence.choriste.toString() === choristerId
        );

        console.log("Présence du choriste dans ce concert :", isAlreadyPresent);

        if (!isAlreadyPresent) {
          console.log(
            `Choriste ${choristerId} est absent pour le concert ${rehearsal._id}.`
          );
          rehearsal.presences.push({
            present: false,
            choriste: chorister._id,
          });

          await Utilisateur.updateOne(
            { _id: chorister._id },
            { nombreAbsenceConcert: chorister.nombreAbsenceConcert + 1 }
          );
          await rehearsal.save();
          chorister.concert.push(rehearsal._id);
          await chorister.save();
        }
      }
    }

    console.log("Vérification quotidienne des absences terminée.");
    if (res) {
      // Check if res is defined before accessing its properties
      res
        .status(201)
        .json({ message: "Vérification quotidienne des absences terminée." });
    }
  } catch (error) {
    console.error(
      "Erreur lors de la vérification quotidienne des absences :",
      error
    );
    if (res) {
      // Check if res is defined before accessing its properties
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
};

module.exports = { absenceConcerts };

cron.schedule("58 21 * * *", async () => {
  await absenceConcerts();
  absentConcert = [];
});
//teja qr concertsabsent
cron.schedule("58 22 * * *", async () => {
  try {
    console.log("Daily absence check started.");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Récupérer tous les concerts dont la date et l'heure sont passées
    const concerts = await Concert.find({
      date: {
        $gte: today.toISOString(),
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      },
    }).populate("participants");

    console.log("Concerts found:", concerts);

    for (const concert of concerts) {
      console.log("Processing concert:", concert._id);

      // Initialiser presences si non défini
      if (!concert.presences) {
        concert.presences = [];
      }

      // Créer un ensemble pour stocker les IDs des participants présents
      const presentParticipants = new Set(
        concert.presences
          .filter((presence) => presence.present)
          .map((presence) => presence.choriste.toString())
      );

      // Vérifier chaque participant du concert
      for (const participant of concert.participants) {
        console.log("Processing participant:", participant.choriste);

        // Vérifier si le participant est déjà marqué comme présent
        const participantID = participant.choriste.toString();
        const isParticipantPresent = presentParticipants.has(participantID);

        console.log("Is participant present:", isParticipantPresent);

        if (!isParticipantPresent) {
          // Si le participant n'est pas marqué présent, ajoutez automatiquement une absence
          console.log(
            "Participant is absent. Adding absence for participant:",
            participantID
          );

          concert.presences.push({
            choriste: participantID,
            present: false,
          });

          // Récupérer le choriste
          const chorister = await Utilisateur.findById(participantID);

          // Vérifier si le nombre d'absences est NaN
          if (isNaN(chorister.nombreAbsenceConcert)) {
            chorister.nombreAbsenceConcert = 0; // Initialiser à 0
          }

          // Mettre à jour le nombre d'absences pour le choriste
          chorister.nombreAbsenceConcert += 1;

          // Enregistrer les modifications apportées au choriste
          await chorister.save();
        }
      }

      // Enregistrez les modifications apportées au concert
      await concert.save();
      console.log("Concert saved with updated presences:", concert);
    }

    console.log("Automatic absence marking for concerts completed.");
  } catch (error) {
    console.error("Error in automatic absence marking for concerts:", error);
  }
});

const receiveNotification = async () => {
  try {
    const currentDate = new Date();
    const yesterdayTenAM = new Date();
    yesterdayTenAM.setHours(10, 0, 0, 0);
    yesterdayTenAM.setDate(currentDate.getDate() - 1);

    const updatedCandidats = await Candidat.find({
      $or: [
        { updatedAt: { $gte: yesterdayTenAM } },
        { sexe: { $ne: undefined } },
      ],
    });

    if (updatedCandidats.length > 0) {
      const client = new net.Socket();
      client.connect(12345, "127.0.0.1", async () => {
        const candidatsNoms = updatedCandidats.map((candidat) => candidat.nom);
        const message = `Candidats mis à jour: ${candidatsNoms.join(", ")}`;
        client.write(message);
        client.end();
      });
    } else {
      console.log(
        "Aucune mise à jour de candidat depuis la dernière notification"
      );
    }

    lastCronRun = currentDate;
  } catch (error) {
    console.error(
      "Erreur lors de la notification de l'administrateur :",
      error.message
    );
  }
};

cron.schedule("00 09 * * *", async () => {
  console.log("Exécution de la notification quotidienne à 21:00...");
  await receiveNotification();
  console.log("Tâche cron exécutée à 10h");
});

//juste pour le teste ajouter un administarteur
const signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new Utilisateur({
        email: req.body.email,
        nom: req.body.nom,
        prenom: req.body.prenom,
        role: req.body.role,
        password: hash,
      });
      user
        .save()
        .then((response) => {
          const newUser = response.toObject();
          delete newUser.password,
            res.status(201).json({
              model: newUser,
              message: "Utlisateur créé !",
            });
        })
        .catch((error) => {
          res.status(400).json({ error: error.message });
        });
    })
    .catch((error) => res.status(500).json({ error }));
};

// authentification

// authentification asma

const log = async (req, res, next) => {
  try {
    const user = await Utilisateur.findOne({ email: req.body.email });
    console.log(user);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Login ou mot de passe incorrecte" });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res
        .status(401)
        .json({ message: "Login ou mot de passe incorrecte" });
    }

    const token = jwt.sign({ userId: user._id }, "your-secret-key-here", {
      expiresIn: "24h",
    });

    res.status(200).json({
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// changer password denier tache asma

const changerpass = async (req, res) => {
  try {
    const { encienpass, newpass, confpass } = req.body;

    if (!encienpass || !newpass || !confpass) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Assuming that the user information is stored in req.user
    const user = req.user;

    const validPassword = await bcrypt.compare(encienpass, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Incorrect old password" });
    }

    // Check if newpass matches confpass
    if (newpass !== confpass) {
      return res.status(400).json({
        message: "New password and confirmation password do not match",
      });
    }

    const hashedPassword = await bcrypt.hash(newpass, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getParticipantsByChefPupitres = async (req, res) => {
  try {
    const concertId = req.params.id;

    const concert = await Concert.findById(concertId).populate({
      path: "disponible.choriste",
      select: "nom prenom pupitre nombreAbsenceConcert nb_prensenceConcert",
    });

    if (!concert) {
      return res.status(404).json({ message: "Concert non trouvé" });
    }

    const choristesParChefPupitre = {};

    concert.disponible.forEach((dispo) => {
      if (dispo.diponiblitee) {
        const chefPupitre = dispo.choriste.pupitre;

        if (!choristesParChefPupitre[chefPupitre]) {
          choristesParChefPupitre[chefPupitre] = [];
        }

        choristesParChefPupitre[chefPupitre].push({
          choriste: dispo.choriste,
          disponible: dispo.diponiblitee,
          nombreAbsenceConcert: dispo.choriste.nombreAbsenceConcert || 0,
          nombrePresenceConcert: dispo.choriste.nb_prensenceConcert || 0,
        });
      }
    });

    for (const chefPupitre in choristesParChefPupitre) {
      choristesParChefPupitre[chefPupitre].sort((a, b) => {
        // Tri par nombre de présences croissant
        return a.nombrePresenceConcert - b.nombrePresenceConcert;
      });
    }

    const chefsPupitre = Object.keys(choristesParChefPupitre);
    chefsPupitre.sort((a, b) => {
      const tauxAbsenceA = choristesParChefPupitre[a].reduce(
        (sum, choriste) => sum + choriste.nombreAbsenceConcert,
        0
      );
      const tauxAbsenceB = choristesParChefPupitre[b].reduce(
        (sum, choriste) => sum + choriste.nombreAbsenceConcert,
        0
      );
      return tauxAbsenceA - tauxAbsenceB;
    });

    const listeParticipants = [];
    chefsPupitre.forEach((chefPupitre) => {
      listeParticipants.push({
        chefPupitre: chefPupitre,
        choristes: choristesParChefPupitre[chefPupitre],
      });
    });

    res.status(200).json(listeParticipants);
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des participants" });
  }
};

// valider liste finale des participant a un concert
const getParticipantsByChefPupitreWithSeuil = async (req, res) => {
  try {
    const concertId = req.params.id;

    const concert = await Concert.findById(concertId).populate({
      path: "disponible.choriste",
      select: "nom prenom pupitre nombreAbsenceConcert nb_prensenceConcert",
    });

    if (!concert) {
      return res.status(404).json({ message: "Concert non trouvé" });
    }

    const choristesParChefPupitre = {};

    concert.disponible.forEach((dispo) => {
      if (dispo.diponiblitee) {
        const chefPupitre = dispo.choriste.pupitre;

        if (!choristesParChefPupitre[chefPupitre]) {
          choristesParChefPupitre[chefPupitre] = [];
        }

        const seuilPresence = concert.seuilpresence;

        const nombrePresenceConcert = dispo.choriste.nb_prensenceConcert;

        if (nombrePresenceConcert >= seuilPresence) {
          choristesParChefPupitre[chefPupitre].push({
            choriste: dispo.choriste,
            disponible: dispo.diponiblitee,
            nombreAbsenceConcert: dispo.choriste.nombreAbsenceConcert || 0,
            nombrePresenceConcert: nombrePresenceConcert,
          });
        }
      }
    });

    for (const chefPupitre in choristesParChefPupitre) {
      choristesParChefPupitre[chefPupitre].sort((a, b) => {
        // Tri par nombre de présences croissant
        return a.nombrePresenceConcert - b.nombrePresenceConcert;
      });
    }

    const chefsPupitre = Object.keys(choristesParChefPupitre);
    chefsPupitre.sort((a, b) => {
      const tauxAbsenceA = choristesParChefPupitre[a].reduce(
        (sum, choriste) => sum + choriste.nombreAbsenceConcert,
        0
      );
      const tauxAbsenceB = choristesParChefPupitre[b].reduce(
        (sum, choriste) => sum + choriste.nombreAbsenceConcert,
        0
      );
      return tauxAbsenceA - tauxAbsenceB;
    });

    const listeParticipants = [];
    chefsPupitre.forEach((chefPupitre) => {
      listeParticipants.push({
        chefPupitre: chefPupitre,
        choristes: choristesParChefPupitre[chefPupitre],
      });
    });

    res.status(200).json(listeParticipants);
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des participants" });
  }
};

const getPresenceByChefPupitreAndRepetition = async (req, res) => {
  try {
    const chefPupitreId = req.params.chefPupitre;
    const repetitionId = req.params.repetitionId;

    // Récupérer le chef de pupitre
    const chefPupitre = await Utilisateur.findOne({
      _id: chefPupitreId,
      role: "chefPupitre",
    });

    if (!chefPupitre) {
      return res.status(404).json({ message: "Chef de pupitre non trouvé" });
    }

    // Récupérer les choristes du même type de pupitre que le chef de pupitre
    const choristes = await Utilisateur.find({
      pupitre: chefPupitre.pupitre,
      role: "choriste",
    });

    // Récupérer les absences des choristes dans la répétition
    const absences = await Absence.find({
      repetitions: repetitionId,
      choriste: { $in: choristes.map((choriste) => choriste._id) },
      Presence: true,
    }).populate("choriste");

    const choristesPresent = absences.map((absence) => ({
      choriste: absence.choriste,
      present: true,
    }));

    res.status(200).json(choristesPresent);
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération de la présence" });
  }
};

//envoyer une notification d'information rapide :
const getChoristeByChefPupitre = (req, res) => {
  const pupitreId = req.params.id;

  // Récupérez le pupitre spécifié par l'identifiant
  Utilisateur.findById(pupitreId)
    .then((pupitre) => {
      if (!pupitre || pupitre.role !== "chefPupitre") {
        throw new Error('Pupitre non trouvé ou n\'a pas le rôle "pupitre"');
      }

      // Récupérez tous les choristes avec le même pupitre
      return Utilisateur.find({
        tessitureVocale: pupitre.tessitureVocale,
        role: "choriste",
      });
    })
    .then((choristes) => {
      // Filtrez les choristes ayant la même tessiture que le pupitre si nécessaire
      // const choristesAvecMemeTessiture = choristes.filter(choriste => choriste.tessitureVocale === pupitre.nom);
      choristes.forEach((choriste) => {
        nodemailer2.sendUpdateRepetitionEmail(
          choriste.nom,
          choriste.prenom,
          choriste.email
          // savedUser.activationCode,
        );
      });
      res.status(200).json(choristes);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
};

//status historique du choriste 3
const getStatutHistorique = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await Utilisateur.findById(userId).select(
      "nom prenom role historiqueActivite"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.role !== "chefPupitre" && user.role !== "choriste") {
      return res
        .status(403)
        .json({ message: "donner choriste ou chef de pupitre " });
    }

    const userProfileDetails = {
      nom: user.nom,
      prenom: user.prenom,
      role: user.role,
      etat: user.etat,
      historiqueActivite: user.historiqueActivite.map((entry) => ({
        saison: entry.Saison,
        statut: entry.status,
      })),
    };

    res.json(userProfileDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

//3 congee admin valide  congee
schedule.scheduleJob("* * * * *", async () => {
  try {
    const today = new Date();
    const expiredCongees = await congee.find({
      enConge: true,
      dateFinConge: { $lt: today },
    });

    for (const congee of expiredCongees) {
      await Utilisateur.findByIdAndUpdate(congee.Choriste, { etat: "Actif" });
    }
  } catch (error) {
    console.error("Erreur des dates de congée ", error);
  }
});

const approuverRejeterConge = async (req, res) => {
  const { congeeId } = req.params;

  try {
    const congees = await congee.findById(congeeId).populate("Choriste");

    if (!congees || !congees.Choriste || congees.Choriste.role !== "choriste") {
      return res.status(401).json({ error: "Congee not found." });
    }

    await congee.findByIdAndUpdate(congeeId, { enConge: true });

    const updatedChoriste = await Utilisateur.findByIdAndUpdate(
      congees.Choriste._id,
      { etat: "EnConge" },
      { new: true }
    );

    res.json({
      message: "Congee approved successfully.",
      congee: {
        _id: congees._id,
        dateDebutConge: congees.dateDebutConge,
        dateFinConge: congees.dateFinConge,
        demande: congees.demande,
        Choriste: {
          _id: updatedChoriste._id,
          nom: updatedChoriste.nom,
          prenom: updatedChoriste.prenom,
          role: updatedChoriste.role,
          etat: updatedChoriste.etat,
        },
      },
    });
  } catch (error) {
    console.error("Error modifying congee:", error);
    res.status(500).json({ error: error.message });
  }
};

//3 désigner 2 chefs
const designerdeuxchefs = async (req, res, next) => {
  try {
    const designateData = req.body;
    const modifiedUsers = [];

    for (const data of designateData) {
      const { pupitre, userIds } = data;

      //  le rôle "choriste"
      const areChoristes = await Utilisateur.find({
        _id: { $in: userIds },
        role: "choriste",
      });

      if (areChoristes.length === userIds.length) {
        if (userIds.length === 2) {
          //  role to 'chefPupitre'
          const updatedUsers = await Utilisateur.updateMany(
            { _id: { $in: userIds }, groupe_Pupitre: pupitre },
            { role: "chefPupitre" }
          );

          // Fetch modified users data
          const usersData = await Utilisateur.find(
            { _id: { $in: userIds } },
            "nom prenom role etat"
          );
          modifiedUsers.push(...usersData);
        } else {
          console.log(`Spécifier 2 chefs de pupitres ${pupitre}.`);
        }
      } else {
        return res
          .status(401)
          .json({ error: "Tous les chefs doivent être choriste avant " });
      }
    }

    res
      .status(200)
      .json({ message: "Chefs désignés avec succès", modifiedUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

//3 absences par choriste concert
const retournerAbsencesConcertPourChoristes = async (req, res) => {
  try {
    const choristes = await Utilisateur.find({ role: "choriste" });

    const choristesWithAbsencesConcert = await Promise.all(
      choristes.map(async (choriste) => {
        try {
          const utilisateurAvecAbsences = await Utilisateur.findById(
            choriste._id
          ).populate({
            path: "concert",
            populate: { path: "presences.choriste" },
          });

          if (!utilisateurAvecAbsences) {
            console.log(`No utilisateur found for choriste ${choriste._id}`);
            return null;
          }

          //  'present' is false
          const formattedAbsencesConcert =
            utilisateurAvecAbsences.concert.reduce((absences, concert) => {
              const concertAbsences = (concert.presences || []).filter(
                (presence) =>
                  presence &&
                  presence.choriste &&
                  presence.choriste._id.toString() ===
                    choriste._id.toString() &&
                  !presence.present
              );
              const formattedAbsences = concertAbsences.map((absence) => ({
                _id: absence._id,
                date_absence: absence.date,
                concert: {
                  _id: concert._id,
                  date: concert.date,
                  lieu: concert.lieu,
                },
              }));
              return absences.concat(formattedAbsences);
            }, []);

          return {
            choriste: {
              _id: choriste._id,
              nom: choriste.nom,
            },
            absencesConcert: formattedAbsencesConcert,
          };
        } catch (error) {
          console.error(`Error processing choriste ${choriste._id}:`, error);
          return null;
        }
      })
    );

    const validChoristesWithAbsences =
      choristesWithAbsencesConcert.filter(Boolean);

    res
      .status(200)
      .json({ choristesWithAbsencesConcert: validChoristesWithAbsences });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error:
        "Erreur lors de la récupération des absences de concerts pour les choristes",
    });
  }
};

//3 nomination élimination concert
const calculateUserConcertNominationElimination = async (req, res) => {
  try {
    const choristes = await Utilisateur.find({ role: "choriste" });
    const concerts = await Concert.find();

    const results = [];

    for (const choriste of choristes) {
      const participantConcerts = concerts.filter((concert) =>
        concert.participants.some((participant) =>
          participant.choriste.equals(choriste._id)
        )
      );

      const absencePercentage =
        choriste.nombreAbsenceConcert > 0
          ? (choriste.nombreAbsenceConcert /
              (choriste.nombreAbsenceConcert + choriste.nb_prensenceConcert)) *
            100
          : 0;

      let isNominated = absencePercentage >= Concert.seuilNomination;
      const isEliminated = absencePercentage >= Concert.seuilElimination;

      // Update etat
      if (isEliminated) {
        isNominated = false;
        choriste.etat = "Eliminé";
        await choriste.save();
        // Send email notification
        sendEliminationEmail(choriste.email, choriste._id, absencePercentage);
      } else if (isNominated && !isEliminated) {
        choriste.etat = "Nominé";
        await choriste.save();
        sendNominationEmail(choriste.email, choriste._id, absencePercentage);
      }

      results.push({
        choristeId: choriste._id,
        isNominated,
        isEliminated,
        absencePercentage,
        email: choriste.email,
      });
    }

    res.status(200).json({ choristesConcertNominationsEliminations: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//3 Function to send elimination email
const sendEliminationEmail = async (toEmail, choristeId, absencePercentage) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mariemmhiri82@gmail.com", // Update with your Gmail email
      pass: "izcm jpry ncke ifqn", // Update with your Gmail password or use an app password
    },
  });

  const mailOptions = {
    from: "mariemmhiri82@gmail.com", // Update with your Gmail email
    to: toEmail,
    subject: "Élimination Notification",
    text: `Cher Choriste,\n\nVous avez été éliminé ${absencePercentage}% d'absences en concerts.\n\nCordialement`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(
      `Email sent to choriste ${choristeId} - Eliminated (${absencePercentage}% absences)`
    );
  } catch (error) {
    console.error(`Error sending email to choriste ${choristeId}:`, error);
  }
};
//3 teja envoyer email nominés
const sendNominationEmail = async (toEmail, choristeId, absencePercentage) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mariemmhiri82@gmail.com", // Update with your Gmail email
      pass: "izcm jpry ncke ifqn", // Update with your Gmail password or use an app password
    },
  });

  const mailOptions = {
    from: "mariemmhiri82@gmail.com", // Update with your Gmail email
    to: toEmail,
    subject: "Nomination Notification",
    text: `Cher Choriste ,\n\nVous avez été nominé en raison de dépassement du taux des absences.\n\nCordialement`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(
      `Email sent to choriste ${choristeId} - Nominations (${absencePercentage}% absences)`
    );
  } catch (error) {
    console.error(`Error sending email to choriste ${choristeId}:`, error);
  }
};
module.exports = calculateUserConcertNominationElimination;

//3 afficher nominés

const getNomineeChoristes = async (req, res) => {
  try {
    const nominatedChoristers = await Utilisateur.find({
      etat: "Nominé",
      role: "choriste",
    });
    res.json(nominatedChoristers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: " Error de récupération des nominés" });
  }
};

//3afficher éliminés juste etat
const getElimineeChoristes = async (req, res) => {
  try {
    const ElimineeChoristes = await Utilisateur.find({
      etat: "Eliminé",
      role: "choriste",
    });
    res.json(ElimineeChoristes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: " Error de récupération des éliminés" });
  }
};

//3 éliminer choriste pour de bon aziz
const eliminerChoriste = async (req, res) => {
  try {
    const userId = req.params.userId;
    const choriste = await Utilisateur.findById(userId);

    if (!choriste) {
      return res.status(404).json({ error: "Choriste not found" });
    }

    if (choriste.etat === "Eliminé") {
      try {
        if (!req.body) {
          await Utilisateur.deleteOne({ _id: choriste._id });

          return res.status(200).json({
            message: "Choriste eliminated successfully",
            eliminatedChoriste: {
              _id: choriste._id,
              userId: choriste._id,
              nom: choriste.nom,
              prenom: choriste.prenom,
              email: choriste.email,
              disciplinaryReason: "Dépassement du taux d'absence", // Replace with an appropriate reason
              role: choriste.role,
            },
          });
        }

        const eliminatedChoriste = new Eliminated({
          userId: choriste._id,
          nom: choriste.nom,
          prenom: choriste.prenom,
          email: choriste.email,
          disciplinaryReason:
            req.body.disciplinaryReason || "Dépassement du taux d'absence", // Replace with an appropriate reason
          role: choriste.role,
        });

        await eliminatedChoriste.save();

        // Remove choriste
        await Utilisateur.deleteOne({ _id: choriste._id });

        return res.status(200).json({
          message: "Choriste eliminated successfully",
          eliminatedChoriste: {
            _id: eliminatedChoriste._id,
            userId: eliminatedChoriste.userId,
            nom: eliminatedChoriste.nom,
            prenom: eliminatedChoriste.prenom,
            email: eliminatedChoriste.email,
            disciplinaryReason: eliminatedChoriste.disciplinaryReason,
            role: eliminatedChoriste.role,
          },
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    } else {
      const { disciplinaryReason } = req.body;

      const eliminatedChoriste = new Eliminated({
        userId: choriste._id,
        nom: choriste.nom,
        prenom: choriste.prenom,
        email: choriste.email,
        disciplinaryReason:
          disciplinaryReason || "Dépassement du taux d'absence", // Replace with an appropriate reason
        role: choriste.role,
      });

      await eliminatedChoriste.save();
      // Remove choriste
      await Utilisateur.deleteOne({ _id: choriste._id });

      return res.status(200).json({
        message: "Choriste eliminated successfully",
        eliminatedChoriste: {
          _id: eliminatedChoriste._id,
          userId: eliminatedChoriste.userId,
          nom: eliminatedChoriste.nom,
          prenom: eliminatedChoriste.prenom,
          email: eliminatedChoriste.email,
          disciplinaryReason: eliminatedChoriste.disciplinaryReason,
          role: eliminatedChoriste.role,
        },
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

//demander congee choriste
const demanderConge = async (req, res) => {
  const userId = req.params.userId;
  const { demandeConge } = req.body;

  try {
    // Mettre à jour la demande de congé
    await Utilisateur.findByIdAndUpdate(userId, { demandeConge });

    // Envoyer  notification
    const notificationMessage = `demande de congé de choriste avec id ${userId} : ${demandeConge}`;
    const notificationServer = net.createConnection({ port: 12345 }, () => {
      console.log("Connecté au serveur de notification");
      notificationServer.write(notificationMessage);
      notificationServer.end();
    });

    res.json({ message: "Demande de congé soumise avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

//3  getalleliminés table éliminés
const getAllEliminatedChoristes = async (req, res) => {
  try {
    const eliminatedChoristes = await Eliminated.find();
    res.json(eliminatedChoristes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error de récuppération des éliminés" });
  }
};

//3 absences par choriste répétition
const retournerAbsencespourChoriste = async (req, res) => {
  try {
    const choristes = await Utilisateur.find({ role: "choriste" });

    const choristesWithAbsences = await Promise.all(
      choristes.map(async (choriste) => {
        const utilisateurAvecAbsences = await Utilisateur.findById(
          choriste._id
        ).populate("absence");

        //  'Presence' is false
        const filteredAbsences = utilisateurAvecAbsences.absence.filter(
          (absence) => absence.Presence === false
        );

        const formattedAbsences = filteredAbsences.map((absence) => ({
          _id: absence._id,
          date_absence: absence.date_absence,
          Presence: absence.Presence,
          repetitions: absence.repetitions,
        }));

        return {
          choriste: {
            _id: choriste._id,
            nom: choriste.nom,
          },
          absences: formattedAbsences,
        };
      })
    );

    res.status(200).json({ choristesWithAbsences });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Erreur lors de la récupération des absences pour les choristes",
    });
  }
};

//3 nomination élimination répétition
const calculateNominationsAndEliminations = async (req, res) => {
  try {
    const choristes = await Utilisateur.find({ role: "choriste" }).populate(
      "absence"
    );
    const nominations = choristes.map(async (choriste) => {
      const absencePercentage =
        choriste.nombreAbsenceRep > 0
          ? (choriste.nombreAbsenceRep /
              (choriste.nombreAbsenceRep + choriste.nb_prensenceRep)) *
            100
          : 0;

      let isNominated = absencePercentage >= Repetition.seuilNomination;
      const isEliminated = absencePercentage >= Repetition.seuilElimination;

      if (isEliminated) {
        isNominated = false;
        choriste.etat = "Eliminé";
        await choriste.save();
      }

      if (isNominated && !isEliminated) {
        choriste.etat = "Nominé";
        await choriste.save();
      }

      return {
        choriste: choriste._id,
        isNominated,
        isEliminated,
        absencePercentage,
        email: choriste.email,
      };
    });
    const results = await Promise.all(nominations);

    const eliminatedChoristes = results.filter((result) => result.isEliminated);

    //  eliminations  emails
    if (eliminatedChoristes.length > 0) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "mariemmhiri82@gmail.com",
          pass: "izcm jpry ncke ifqn",
        },
      });

      eliminatedChoristes.forEach((eliminatedChoriste) => {
        const { choriste, isEliminated, absencePercentage, email } =
          eliminatedChoriste;

        const mailOptions = {
          from: "mariemmhiri82@gmail.com",
          to: email,
          subject: "Elimination Notification",
          text: `cher Choriste,\n\nVous avez été éliminé ${absencePercentage}% absences dans les répétitions.\n\nCordialement`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
          } else {
            console.log(
              `Email sent to choriste ${choriste} - Eliminated (${absencePercentage}% absences): ${info.response}`
            );
          }
        });
      });
    }

    const nomineChoristes = results.filter((result) => result.isNominated);

    //  nomines  emails
    if (nomineChoristes.length > 0) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "mariemmhiri82@gmail.com",
          pass: "izcm jpry ncke ifqn", // Add your password here
        },
      });

      nomineChoristes.forEach((nomineChoriste) => {
        const { choriste, isNominated, absencePercentage, email } =
          nomineChoriste;

        const mailOptions = {
          from: "mariemmhiri82@gmail.com",
          to: email,
          subject: "Nomination Notification",
          text: `cher Choriste ${choriste},\n\nVous avez été nominé ${absencePercentage}% absences dans les répétitions.\n\nCordialement`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
          } else {
            console.log(
              `Email sent to choriste ${choriste} - nominé (${absencePercentage}% absences): ${info.response}`
            );
          }
        });
      });
    }
    res.status(200).json({ nominations: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getParticipantsByChefPupitre = async (req, res) => {
  try {
    const concertId = req.params.id;

    const concert = await Concert.findById(concertId).populate({
      path: "disponible.choriste",
      select: "nom prenom pupitre nombreAbsenceConcert nb_prensenceConcert",
    });

    if (!concert) {
      return res.status(404).json({ message: "Concert non trouvé" });
    }

    const choristesParChefPupitre = {};

    concert.disponible.forEach((dispo) => {
      if (dispo.diponiblitee) {
        const chefPupitre = dispo.choriste.pupitre;

        if (!choristesParChefPupitre[chefPupitre]) {
          choristesParChefPupitre[chefPupitre] = [];
        }

        choristesParChefPupitre[chefPupitre].push({
          choriste: dispo.choriste,
          disponible: dispo.diponiblitee,
          nombreAbsenceConcert: dispo.choriste.nombreAbsenceConcert || 0,
          nombrePresenceConcert: dispo.choriste.nb_prensenceConcert || 0,
        });
      }
    });

    for (const chefPupitre in choristesParChefPupitre) {
      choristesParChefPupitre[chefPupitre].sort((a, b) => {
        // Tri par nombre de présences croissant
        return a.nombrePresenceConcert - b.nombrePresenceConcert;
      });
    }

    const chefsPupitre = Object.keys(choristesParChefPupitre);
    chefsPupitre.sort((a, b) => {
      const tauxAbsenceA = choristesParChefPupitre[a].reduce(
        (sum, choriste) => sum + choriste.nombreAbsenceConcert,
        0
      );
      const tauxAbsenceB = choristesParChefPupitre[b].reduce(
        (sum, choriste) => sum + choriste.nombreAbsenceConcert,
        0
      );
      return tauxAbsenceA - tauxAbsenceB;
    });

    const listeParticipants = [];
    chefsPupitre.forEach((chefPupitre) => {
      listeParticipants.push({
        chefPupitre: chefPupitre,
        choristes: choristesParChefPupitre[chefPupitre],
      });
    });

    res.status(200).json(listeParticipants);
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des participants" });
  }
};

//teja nominations
const calculateNominations = async (req, res) => {
  try {
    const choristes = await Utilisateur.find({ role: "choriste" });

    const nominations = choristes.map((choriste) => {
      const repetitionAbsencePercentage =
        choriste.nombreAbsenceRep > 0
          ? (choriste.nombreAbsenceRep /
              (choriste.nombreAbsenceRep + choriste.nb_prensenceRep)) *
            100
          : 0;

      const concertAbsencePercentage =
        choriste.nombreAbsenceConcert > 0
          ? (choriste.nombreAbsenceConcert /
              (choriste.nombreAbsenceConcert + choriste.nb_prensenceConcert)) *
            100
          : 0;

      const isNominatedForRepetition =
        repetitionAbsencePercentage >= Repetition.seuilNomination;
      const isNominatedForConcert =
        concertAbsencePercentage >= Concert.seuilNomination;

      return {
        _id: choriste._id,
        name: choriste.nom,
        email: choriste.email,
        repetitionAbsencePercentage,
        concertAbsencePercentage,
        isNominatedForRepetition,
        isNominatedForConcert,
      };
    });

    res.status(200).json({ nominations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
//teja nominees
const sendNominationEmailnomines = async (toEmail, choristeId) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mariemmhiri82@gmail.com", // Update with your Gmail email
      pass: "izcm jpry ncke ifqn", // Update with your Gmail password or use an app password
    },
  });

  const mailOptions = {
    from: "mariemmhiri82@gmail.com", // Update with your Gmail email
    to: toEmail,
    subject: "Nomination Notification",
    text: `Cher Choriste,\n\nVous avez été nominé à cause de nombre des absences.\n\nCordialement`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(
      `Email sent to choriste ${choristeId} - Nomination Notification`
    );
  } catch (error) {
    console.error(`Error sending email to choriste ${choristeId}:`, error);
  }
};

module.exports = sendNominationEmailnomines;

//teja nominees checkbox send email usues send email nominations function
const sendNotificationNomine = require("../middelwares/sendNotificationNomine");

const selectNominees = async (req, res) => {
  try {
    const { selectedNominees } = req.body;

    // Update etat to "Nominé" for selected nominees
    await Utilisateur.updateMany(
      { _id: { $in: selectedNominees } },
      { $set: { etat: "Nominé" } }
    );

    // Fetch choriste details for selected nominees
    const nomineesDetails = await Promise.all(
      selectedNominees.map(async (choristeId) => {
        const choriste = await Utilisateur.findById(choristeId);
        return {
          nom: choriste.nom,
          prenom: choriste.prenom,
          email: choriste.email,
          etat: choriste.etat,
        };
      })
    );

    // Send nomination email to each selected nominee
    await Promise.all(
      nomineesDetails.map(async (nominee) => {
        await sendNominationEmailnomines(nominee.email, nominee._id);
      })
    );

    res
      .status(200)
      .json({ message: "Nominees successfully selected.", nomineesDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to select nominees." });
  }
};

//qr repetitons
const getAllRepetitions = async (req, res) => {
  try {
    // Récupérer les données de la base de données
    const repetitions = await repetition.find();

    // Retourner les données formatées
    res.status(200).json({ message: "Success", repetitions });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

///aziz
const select_user = async (req, res) => {
  try {
    const userId = req.query.userId;
    // console.log(userId);
    // Utiliser la méthode find pour sélectionner tous les choristes avec l'ID utilisateur fourni
    const choristes = await Utilisateur.find({ _id: userId });
    // console.log(choristes);
    return res.status(200).json(choristes);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateSchedule = async (req, res) => {
  const { schedulNotif, userId } = req.body;
  try {
    const user = await Utilisateur.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    await Utilisateur.updateOne(
      { _id: userId },
      { schedulNotif: schedulNotif }
    ); // Specify the query condition for updating
    global.scheduledNotificationDate = schedulNotif;
    res.json({ message: "schedulNotif mis à jour avec succès" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

const selectionner_choriste = async (req, res) => {
  try {
    // Utiliser la méthode find pour sélectionner tous les choristes
    const choristes = await Utilisateur.find({ role: "choriste" })
      .populate("absence")
      .exec();

    return res.status(200).json(choristes);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const UpdateutilisateurNotif = async (req, res) => {
  try {
    const userId = req.params.id;
    const utilisateur = await Utilisateur.findOneAndUpdate(
      { _id: userId },
      { $set: { "notifications.$[elem].read": true } },
      { arrayFilters: [{ "elem.read": false }], new: true }
    );
    res.status(200).json(utilisateur);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Erreur lors de la mise à jour de l'utilisateur",
    });
  }
};

const getUtilisateur = async (req, res) => {
  try {
    const userId = req.params.id;
    const utilisateur = await Utilisateur.find({ _id: userId });
    res.status(200).json(utilisateur);
  } catch (error) {
    // console.error(error.message);
    res.status(500).json({
      error: "Erreur lors de la récupération l'utilisateur",
    });
  }
};
///aziz

module.exports = {
  generateRandomURL: generateUrl,
  createAbsence: marquerPresenceRepetitionss,
  createAbsenceConcert: marquerPresenceConcert,
  marquerPresenceManuellementA_repitition,

  marquerPresenceManuellementA_concert,

  EmailTodisponiblechoriste,
  login,
  calculateNominationsAndEliminations,

  retournerAbsencespourChoriste,
  getParticipantsByChefPupitre: getParticipantsByChefPupitre,

  ajouter_utlisateur: ajouter_utlisateur,
  modifier_utlisateur: modifier_utlisateur,
  supprimer_utilisateur: supprimer_utilisateur,
  selectionner_choristes: selectionner_choristes,
  selectionner_chefPupitre: selectionner_chefPupitre,

  selectionner_id: selectionner_id,
  selectionner: selectionner,
  log: log,
  signup: signup,
  AddChoriste,
  getChoristeParConcert,
  IndiquerDisponibilté,
  profil,

  getNomineeChoristes,
  getElimineeChoristes,
  retournerAbsencesConcertPourChoristes,
  calculateUserConcertNominationElimination,
  eliminerChoriste,
  getAllEliminatedChoristes,

  UpdateTessitureVocal,

  updateStatus,
  changerpass,
  getParticipantsByChefPupitres,
  getParticipantsByChefPupitreWithSeuil,

  getPresenceByChefPupitreAndRepetition,
  getChoristeByChefPupitre,
  getStatutHistorique,
  demanderConge,
  approuverRejeterConge,
  designerdeuxchefs,

  rappel_repetition_choristes_noncongé: rappel_repetition_choristes_noncongé,

  archiveUsersBySeason: archiveUsersBySeason,
  Updaterepetition: Updaterepetition,

  sendEmailToChoristesWithSameTessiture: sendEmailToChoristesWithSameTessiture,
  calculateNominations,
  selectNominees,
  getAllRepetitions,
  //aziz
  select_user: select_user,
  updateSchedule: updateSchedule,
  selectionner_allchoriste: selectionner_choriste,
  UpdateutilisateurNotif: UpdateutilisateurNotif,
  getUtilisateur: getUtilisateur,

  //
};
