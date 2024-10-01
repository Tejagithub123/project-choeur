const Candidat = require("../Models/condidat");
const audition = require("../Models/audition");
const cron = require("node-cron");
const net = require("net");
const nodemailer = require("nodemailer");
const moment = require("moment-timezone");
//ajouter un Candidat
const AddCandidat = async (req, res) => {
  const condidat = new Candidat(req.body);

  condidat.audition = req.body.audition;

  condidat.createdAt = moment().tz("Africa/Tunis").format();
  condidat
    .save()
    .then(() => {})
    .catch((error) => {
      res.status(400).json({
        error: error.message,
        message: "Données invalides",
      });
    });
};

//Select Candidat
const GetAllCandidat = (req, res) => {
  Candidat.find()
    .then((condidat) => {
      res.status(200).json({
        model: condidat,
        message: "Succée",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error.message,
        message: "probleme d'extraction",
      });
    });
};

// Chercher
const ChercherCandidat = async (req, res) => {
  let data = await Candidat.find({
    $or: [
      { nom: { $regex: req.params.key } },
      { prenom: { $regex: req.params.key } },
    ],
  });
  res.send(data);
};

//3.a: Lister les candidats avec pagination et filtrage
const ListCandidats = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const filter = {};

    if (req.query.nom) {
      filter.nom = { $regex: req.query.nom, $options: "i" };
    }
    if (req.query.prenom) {
      filter.prenom = { $regex: req.query.prenom, $options: "i" };
    }

    const candidats = await Candidat.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      candidats,
      currentPage: page,
      totalPages: Math.ceil((await Candidat.countDocuments(filter)) / limit),
      message: "Succès",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Erreur lors de la récupération des candidats",
    });
  }
};

const user = "mariemmhiri82@gmail.com"; // hedhi t7ot feha l email
const pass = "izcm jpry ncke ifqn"; // houni lazmek ta3mel generation lel code hedha gmail apps

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: user,
    pass: pass,
  },
});

// 3.e: notifier l'admin à 10:00

let lastCronRun = null;

const notifierAdmin = async () => {
  try {
    const currentDate = new Date();
    const yesterdayTenAM = new Date();
    yesterdayTenAM.setHours(10, 0, 0, 0);
    yesterdayTenAM.setDate(currentDate.getDate() - 1);

    const newCandidats = await Candidat.find({
      createdAt: { $gte: yesterdayTenAM.toDateString() },
    });

    if (newCandidats.length > 0) {
      const client = new net.Socket();
      client.connect(12345, "127.0.0.1", async () => {
        const candidatsNoms = newCandidats.map(
          (candidat) => candidat.nom + " " + candidat.prenom
        );
        const message = `Nouvelles candidatures ajoutées: ${candidatsNoms.join(
          ", "
        )}`;
        client.write(message);
        client.end();
      });
    } else {
      console.log("Aucun nouveau candidat depuis la dernière notification");
    }

    lastCronRun = currentDate;
  } catch (error) {
    console.error(
      "Erreur lors de la notification de l'administrateur :",
      error.message
    );
  }
};

cron.schedule("00 18 * * *", async () => {
  console.log("Exécution de la notification quotidienne à 21:00...");
  await notifierAdmin();
  console.log("Tâche cron exécutée à 10h");
});

//3.b:   générer planifications des auditions
const planifierAuditions = async () => {
  try {
    const candidatsSansAudition = await Candidat.find({
      audition: { $exists: false },
    });
    const groupesDeCandidats = chunkArray(candidatsSansAudition, 3);
    const joursAudition = ["lundi", "mardi", "mercredi", "jeudi", "vendredi"];

    const dateDebutAuditions = new Date("2023-02-13");

    groupesDeCandidats.forEach(async (groupe, index) => {
      const jourAudition = joursAudition[index % joursAudition.length];
      const dateAudition = new Date(dateDebutAuditions);

      groupe.forEach(async (candidat, heureIndex) => {
        dateAudition.setHours(9 + heureIndex, 0, 0, 0);
        const heureDebut = `${dateAudition.getHours()}:00`;
        const heureFin = `${dateAudition.getHours() + 1}:00`;

        const nouvelleAudition = new audition({
          date: jourAudition + " " + dateAudition.toISOString().split("T")[0],
          Candidat: candidat._id,
          heure: heureDebut,
        });

        candidat.audition = nouvelleAudition._id;

        await nouvelleAudition.save();
        await candidat.save();

        console.log(candidat.email);

        const emailBody = `Bonjour,\n\nVous êtes invité à une audition le ${jourAudition}     ${
          dateAudition.toISOString().split("T")[0]
        } à ${heureDebut}. Cordialement,\nL'équipe d'audition`;

        await transport.sendMail({
          from: "trikiasma31@gmail.com",
          to: candidat.email,
          subject: "Invitation à l'audition",
          text: emailBody,
        });

        console.log(`E-mail d'invitation envoyé à ${candidat.email}`);
      });
      dateDebutAuditions.setDate(dateDebutAuditions.getDate() + 1);
    });
    res.status().json({ message: "Auditions planifiées avec succès" });

    console.log("Auditions planifiées avec succès");
  } catch (error) {
    console.error(
      "Erreur lors de la planification des auditions :",
      error.message
    );
  }
};

//3.b:   générer planifications des auditions
const planifierAuditions2 = async (req, res) => {
  try {
    const candidatsSansAudition = await Candidat.find({
      audition: { $exists: false },
    });
    const groupesDeCandidats = chunkArray(candidatsSansAudition, 3);
    const nouvellesAuditions = [];

    let dateDebutAuditions = new Date("01-02-2024");
    let heureDebutAuditions = 9;

    for (const groupe of groupesDeCandidats) {
      for (const candidat of groupe) {
        const heureDebut = `${heureDebutAuditions}:00`;

        const nouvelleAudition = new audition({
          date: dateDebutAuditions.toISOString().split("T")[0],
          Candidat: candidat._id,
          heure: heureDebut,
        });

        candidat.audition = nouvelleAudition._id;

        await nouvelleAudition.save();
        await candidat.save();

        const emailBody = `Bonjour,\n\nVous êtes invité à une audition le ${
          dateDebutAuditions.toISOString().split("T")[0]
        } à ${heureDebut}. Cordialement,\nL'équipe d'audition`;

        await transport.sendMail({
          from: "mariemmhiri82@gmail.com",
          to: candidat.email,
          subject: "Invitation à l'audition",
          text: emailBody,
        });

        console.log(`E-mail d'invitation envoyé à ${candidat.email}`);

        nouvellesAuditions.push(nouvelleAudition);
      }

      heureDebutAuditions++;

      if (heureDebutAuditions > 15) {
        heureDebutAuditions = 9;
        dateDebutAuditions.setDate(dateDebutAuditions.getDate() + 1);
      }
    }

    console.log("Auditions planifiées avec succès");
    // Populate the Candidat field to get the email
    await audition.populate(nouvellesAuditions, {
      path: "Candidat",
      select: "email",
    });

    // Retourner un objet JSON contenant le message de succès et les détails des nouvelles auditions
    res.status(200).json({
      message: "Plannification avec succès",
      nouvellesAuditions: nouvellesAuditions.map((audition) => ({
        id: audition._id,
        date: audition.date,
        candidat: {
          id: audition.Candidat._id,
          email: audition.Candidat.email,
        },
        heure: audition.heure,
      })),
    });
  } catch (error) {
    console.error(
      "Erreur lors de la planification des auditions :",
      error.message
    );

    res
      .status(500)
      .json({ error: "Erreur lors de la planification des auditions" });
  }
};

const chunkArray = (array, chunkSize) => {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};
//teja

const planifierAuditions3 = async (req, res) => {
  try {
    const { heureDebut, jourDebut, jourFin, nbHeures } = req.body;

    let duree;
    if (new Date(jourDebut).getTime() === new Date(jourFin).getTime()) {
      duree = nbHeures;
    } else {
      const diffJours =
        (new Date(jourFin) - new Date(jourDebut)) / (1000 * 60 * 60 * 24);
      duree = (diffJours + 1) * nbHeures;
    }
    console.log("duree", duree);

    const candidatsSansAudition = await Candidat.find({
      auditions: { $size: 0 },
    });
    if (candidatsSansAudition.length === 0) {
      return res
        .status(204)
        .json({ message: "Aucun candidat sans audition trouvé." });
    }

    const nombreSlots = duree;

    if (nombreSlots < candidatsSansAudition.length) {
      console.log(candidatsSansAudition.length);
      return res
        .status(400)
        .json({ message: "Nombre de créneaux horaires insuffisant" });
    }
    let dateActuelle = new Date(jourDebut);

    let heuresPlanifiees = 0;

    //nouvelles
    let heureActuelle = parseInt(heureDebut);
    const nouvellesAuditions = [];
    for (let i = 0; i < candidatsSansAudition.length; i++) {
      const candidat = candidatsSansAudition[i];

      const nouvelleAudition = new audition({
        date: formatDate(dateActuelle), // Utilisation de la date actuelle
        heure: heureActuelle.toString(),
        Candidat: candidat._id,
      });

      await nouvelleAudition.save();
      candidat.auditions = nouvelleAudition._id;
      await candidat.save();

      const emailBody = `Bonjour,\n\nVous êtes invité à une audition le ${formatDate(
        dateActuelle
      )} à ${heureActuelle}. Cordialement,\nL'équipe d'audition`;

      await transport.sendMail({
        from: "mariemmhiri82@gmail.com",
        to: candidat.email,
        subject: "Invitation à l'audition",
        text: emailBody,
      });

      // Ajoutez l'audition à nouvellesAuditions
      nouvellesAuditions.push({
        jour: formatDate(dateActuelle),
        heureDebut: heureActuelle.toString(),
        Candidat: candidat._id,
        email: candidat.email,
        nom: candidat.nom,
        prenom: candidat.prenom,
      });
      heureActuelle++;
      heuresPlanifiees++;
      if (
        heuresPlanifiees >= nbHeures &&
        formatDate(dateActuelle) !== jourFin
      ) {
        heuresPlanifiees = 0;
        heureActuelle = parseInt(heureDebut); // Réinitialiser à l'heure de début
        dateActuelle.setDate(dateActuelle.getDate() + 1);
      }
    }
    // Vérification si l'heure actuelle dépasse la limite horaire
    if (heureActuelle >= parseInt(heureDebut) + nbHeures) {
      // Vérifier si des auditions sont déjà planifiées pour le jour suivant
      const auditionsJourSuivant = await audition.find({
        date: formatDate(dateActuelle.setDate(dateActuelle.getDate() + 1)),
      });
      if (auditionsJourSuivant.length === 0) {
        // Réinitialisation de l'heure si aucune audition n'est planifiée pour le jour suivant
        heureActuelle = parseInt(heureDebut);
      } else {
        // Sinon, revenir à 9h
        heureActuelle = parseInt(heureDebut);
        dateActuelle.setDate(dateActuelle.getDate() + 1); // Passage au jour suivant
      }
      // Mettre à jour le jour de début si ce n'est pas le même
    }
    // Réponse avec les informations sur les nouvelles auditions
    res.status(200).json(nouvellesAuditions);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Une erreur est survenue lors de la planification des auditions.",
    });
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString); // Convertir la chaîne en objet Date
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Ajouter 1 au mois car les mois commencent à 0
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

//teja fin 3b correct

//aziz 3.d:   planifier des audition pour defaillant aziz
// I Change THIS !!! (Med Aziz)
//3.d:   planifier des audition pour defaillant
const updateAuditions = async (req, res) => {
  try {
    const {
      candidatsIds,
      dateDebutAudition,
      heureDebutAudition,
      jourFin,
      nbHeures,
    } = req.body;
    console.log(req.body);
    const nouvellesAuditions = [];
    if (!candidatsIds) {
      return res
        .status(400)
        .json({ error: "Champs manquants dans la requête." });
    }

    // Extraire le jour, le mois et l'année
    const [day, month, year] = dateDebutAudition.split("-");

    // Créer un nouvel objet Date en spécifiant le fuseau horaire
    const dateDebutAuditions = new Date(`${year}-${month}-${day}T00:00:00Z`);

    const [day1, month1, year1] = jourFin.split("-");

    // Créer un nouvel objet Date en spécifiant le fuseau horaire
    const jourFins = new Date(`${year1}-${month1}-${day1}T00:00:00Z`);
    // console.log(jourFins);
    // console.log(dateDebutAuditions);
    let duree;
    if (jourFins.getTime() === dateDebutAuditions.getTime()) {
      duree = nbHeures;
    } else {
      const diffJours = (jourFins - dateDebutAuditions) / (1000 * 60 * 60 * 24);
      duree = (diffJours + 1) * nbHeures;
    }
    // console.log("duree", duree);
    const nombreSlots = duree;
    // console.log("candidatsIds.length", candidatsIds.length);
    if (nombreSlots < candidatsIds.length) {
      // console.log(candidatsIds.length);
      return res
        .status(400)
        .json({ message: "Nombre de créneaux horaires insuffisant" });
    }
    let dateActuelle = dateDebutAuditions;
    let heuresPlanifiees = 0;
    let heureActuelle = parseInt(heureDebutAudition);
    for (const candidatId of candidatsIds) {
      const candidats = await Candidat.findById(candidatId);

      if (!candidats) {
        return res
          .status(404)
          .json({ error: `Candidat avec l'ID ${candidatId} non trouvé.` });
      }

      const premiereAudition = await audition.findOne({
        _id: candidats.auditions,
      });

      if (!premiereAudition) {
        return res.status(404).json({
          error: `Audition du candidat avec l'ID ${candidatId} non trouvée.`,
        });
      }
      // Formatting heureDebutAuditions to "hh:mm" format
      const formattedHeure = heureActuelle.toString().padStart(2, "0");
      // + ":00";

      await premiereAudition.updateOne({
        date: dateActuelle.toISOString().split("T")[0],
        heure: formattedHeure,
      });
      // Fetch the updated document after the updateOne operation
      const updatedPremiereAudition = await audition.findOne({
        _id: candidats.auditions,
      });
      const emailBody = `Bonjour,\n\nVous êtes invité à une audition le ${
        dateDebutAuditions.toISOString().split("T")[0]
      } à ${heureDebutAudition}:00 . \n Cordialement,\nL'équipe d'audition`;

      await transport.sendMail({
        from: "mariemmhiri82@gmail.com",
        to: candidats.email,
        subject: "Invitation à l'audition",
        text: emailBody,
      });
      console.log(`E-mail d'invitation envoyé à ${candidats.email}`);
      // console.log(candidats.email);
      await nouvellesAuditions.push(updatedPremiereAudition);
      // -------------------------------------
      heureActuelle++;
      heuresPlanifiees++;

      if (
        heuresPlanifiees >= nbHeures &&
        formatDate(dateActuelle) !== jourFin
      ) {
        heuresPlanifiees = 0;
        heureActuelle = parseInt(heureDebutAudition); // Réinitialiser à l'heure de début
        dateActuelle.setDate(dateActuelle.getDate() + 1);
      }
    }

    // Vérification si l'heure actuelle dépasse la limite horaire
    if (heureActuelle >= parseInt(heureDebutAudition) + nbHeures) {
      // Vérifier si des auditions sont déjà planifiées pour le jour suivant
      const auditionsJourSuivant = await audition.find({
        date: formatDate(dateActuelle.setDate(dateActuelle.getDate() + 1)),
      });
      if (auditionsJourSuivant.length === 0) {
        // Réinitialisation de l'heure si aucune audition n'est planifiée pour le jour suivant
        heureActuelle = parseInt(heureDebutAudition);
      } else {
        // Sinon, revenir à 9h
        heureActuelle = parseInt(heureDebutAudition);
        dateActuelle.setDate(dateActuelle.getDate() + 1); // Passage au jour suivant
      }
    }

    res.status(200).json({
      message: "Mise à jour des auditions avec succès.",
      nouvellesAuditions,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour des auditions :",
      error.message
    );
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour des auditions." });
  }
};

//teja 3.c:  select planning des auditions par date , par heure et par le 2
const planningAudition = async (req, res) => {
  try {
    const dateDebut = req.query.datedebut;
    const dateFin = req.query.datefin;
    const heureDebut = req.query.heuredebut;
    const heureFin = req.query.heurefin;

    const filter = {};
    if (dateDebut && dateFin && heureDebut && heureFin) {
      const startDate = new Date(dateDebut);
      const endDate = new Date(dateFin);
      const startHour = parseInt(heureDebut);
      const endHour = parseInt(heureFin);

      for (
        let date = startDate;
        date <= endDate;
        date.setDate(date.getDate() + 1)
      ) {
        console.log(date);
        for (let hour = startHour; hour <= endHour; hour++) {
          const heure = hour.toString();
          console.log(heure);
          filter.$or = filter.$or || [];
          filter.$or.push({
            date: date.toISOString().split("T")[0],
            heure: heure,
          });
        }
      }
    }

    if (heureDebut === heureFin) {
      filter.$or.push({ date: dateDebut, heure: heureDebut });
    }

    const auditions = await audition
      .find(filter)
      .populate("Candidat")
      .sort({ date: 1, heure: 1 });

    res.status(200).json({
      auditions,
      message: "Succès",
    });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des auditions :",
      error.message
    );
    res.status(500).json({
      error: "Erreur lors de la récupération des auditions",
    });
  }
};

//teja 3.c
const getAllAuditionsWithCandidates = async (req, res) => {
  try {
    // Fetch all auditions and populate the 'Candidat' field with candidate details
    const auditions = await audition
      .find({ Candidat: { $ne: null } })
      .populate("Candidat");

    // Check if any auditions were found
    if (!auditions || auditions.length === 0) {
      return res.status(404).json({ message: "No auditions found." });
    }

    // Return the auditions with populated candidate details
    res.status(200).json({ auditions });
  } catch (error) {
    console.error("Error fetching auditions:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching auditions." });
  }
};

module.exports = {
  AddCandidat,
  GetAllCandidat,
  ChercherCandidat,
  ListCandidats,
  notifierAdmin,

  planifierAuditions,
  planningAudition,
  planifierAuditions2,
  planifierAuditions3,
  updateAuditions,
  getAllAuditionsWithCandidates,
};
