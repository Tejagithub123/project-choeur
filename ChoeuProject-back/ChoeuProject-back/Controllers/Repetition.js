const repetition = require("../Models/Repetition");
const moment = require("moment");

const User = require("../Models/Utilisateur");
const net = require("net");

const Absence = require("../Models/absences");

/*ajouter_repetition = (req, res) => {

    const repetitionData = req.body;

    // Formater les champs heureDebut et heureFin en objets de date
    repetitionData.heureDebut = moment.parseZone(repetitionData.heureDebut).toDate();
    repetitionData.heureFin = moment.parseZone(repetitionData.heureFin).toDate();

    const Repetition = new repetition(repetitionData);

    Repetition.save().then((resultat) => {
        res.status(201).json({
            model: resultat,
            message: "La Répétition est bien créée"
        });
    })
    .catch((err) => {
        res.status(400).json({ err: err.message });
    });
}
*/

/*ajouter_repetition2 = (req, res) => {
    try {
        const repetitionData = req.body;

        // Créer une nouvelle instance de répétition avec les données de la requête
        const Repetition = new repetition(repetitionData);

        // Enregistrer la nouvelle répétition
        Repetition.save().then((resultat) => {
            res.status(201).json({
                model: resultat,
                message: "La Répétition est bien créée"
            });
        });
    } catch (err) {
        res.status(400).json({ err: err.message });
    }
};*/

//repetition avec notifs
/*ajouter_repetition3 = async (req, res) => { 
    try {
        const repetitionData = req.body;
     
        const Repetition = new repetition(repetitionData);
        
        const resultat = await Repetition.save();

        await notifierUtilisateursNouvelleRepetition(resultat);

        res.status(201).json({
            model: resultat,
            message: "La Répétition est bien créée"
        });
    } catch (err) {
        res.status(400).json({ err: err.message });
    }
    
}; */

// notifier tous les utilisateurs choriste ajouter_repetition3

/* async function notifierUtilisateursNouvelleRepetition(repetition) {
    try {
   
      const utilisateurs = await User.find({ role: 'choriste' });
  
      // ne sont pas en congé
      const utilisateursActifs = utilisateurs.filter((utilisateur) => utilisateur.etat !== 'EnConge');
  
      // Envoyer une notification
      utilisateursActifs.forEach(async (utilisateur) => {
        const notificationMessage = `Nouvelle répétition pour programme : ${repetition.programme} pour le choriste ${utilisateur._id}`;
  
        // Créer socket d'envoi 
        const notificationServer = net.createConnection({ port: 12345 }, () => {
          console.log(`Connecté au serveur de notification pour l'utilisateur ${utilisateur._id} ${utilisateur.nom}`);
          notificationServer.write(notificationMessage);
          notificationServer.end();
        });
      });
    } catch (error) {
      console.error(error);
    }
  }


*/

/*supprimer_repetition = (req, res) =>{

    repetition.findOneAndDelete({_id: req.params.id}).then((resultat)=>{
        if(!resultat){res.status(404).json({message: "n'exite pas"})}
        res.status(404).json({message: "Répétition supprimer"})
    })
    .catch((err)=>{
        res.status(404).json({err: err.message})  
    })
}*/

/*modifier_repetition = (req, res)=>{


    repetition.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}).then((rep)=>{
        if(!rep){
            res.status(404).json({message: "existe pas"})
        }
        res.status(200).json({message: "bien modifier", model:rep })
    })
    .catch((err)=>{
        res.status(404).json({err: err.message})  
    })
}
*/

modifier_repetition_avecnotif = (req, res) => {
  repetition
    .findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    .then((rep) => {
      if (!rep) {
        res.status(404).json({ message: "existe pas" });
      }
      res.status(200).json({ message: "bien modifier", model: rep });
    })
    .catch((err) => {
      res.status(404).json({ err: err.message });
    });
};

/*select_repetition= (req ,res) =>{

    repetition.find()
    .then((resultat)=>{
        if(!resultat){
            res.status(404).json({
                message: "Répétition non trouvé",})
                return}   
                res.status(200).json({
                    model: resultat,
                    message: "voilà les répétition "
                })  
        } )
}*/

/*select_repetition_id = (req, res) =>{
   
    repetition.findOne({ _id: req.params.id })
            .then((abs) => {
                if (!abs) {
                    return res.status(404).json({
                        message: "Objet non trouvé"
                    });
                }
    
                return res.status(200).json({
                    model: abs,
                    message: "Objet trouvé"
                });
            })
            .catch((err) => {
                res.status(500).json({
                    message: "Erreur interne du serveur",
                    error: err.message
                });
            });
   
    
}*/
// teja
const setseuils = async (req, res) => {
  try {
    const { seuilNomination, seuilElimination } = req.body;

    repetition.seuilNomination = seuilNomination;
    repetition.seuilElimination = seuilElimination;

    res.status(200).json({
      seuilNomination: repetition.seuilNomination,
      seuilElimination: repetition.seuilElimination,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// tache 8 asma ajout
const createRepetition = async (req, res) => {
  try {
    const exist_choriste = await User.find({ role: "choriste" });

    // Create arrays for each tessitureVocale
    const basse = exist_choriste.filter(
      (choriste) => choriste.tessitureVocale === "Basse"
    );
    const tenor = exist_choriste.filter(
      (choriste) => choriste.tessitureVocale === "Tenor"
    );
    const soprano = exist_choriste.filter(
      (choriste) => choriste.tessitureVocale === "Soprano"
    );
    const alto = exist_choriste.filter(
      (choriste) => choriste.tessitureVocale === "Alto"
    );

    // Parse percentages from request body
    const sop = parseFloat(req.body.sop) || 0;
    const al = parseFloat(req.body.al) || 0;
    const bas = parseFloat(req.body.bas) || 0;
    const ten = parseFloat(req.body.ten) || 0;

    // Check if any pupitre's percentage exceeds 100
    if (sop > 100 || al > 100 || bas > 100 || ten > 100) {
      return res.status(400).json({
        message: "Percentage for each pupitre should not exceed 100.",
      });
    }

    const rep = new repetition({
      heureDebut: req.body.heureDebut,
      heureFin: req.body.heureFin,
      date: req.body.date,
      lieu: req.body.lieu,
      programme: req.body.programme,
      concert: req.params.id,
      choriste: [],
    });

    // Add choristers based on percentages
    rep.choriste = [
      ...getRandomChoristers(basse, bas),
      ...getRandomChoristers(tenor, ten),
      ...getRandomChoristers(soprano, sop),
      ...getRandomChoristers(alto, al),
    ];

    let response = await rep.save();
    res.status(200).json({ message: "success repetition", response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Helper function to get a random subset of choristers
const getRandomChoristers = (choristers, percentage) => {
  const count = Math.round(choristers.length * (percentage / 100));
  return count > 0
    ? choristers
        .sort(() => Math.random() - 0.5)
        .slice(0, count)
        .map((choriste) => choriste._id)
    : [];
};

// tache 8 asma modifier

const updateRepetition = async (req, res) => {
  try {
    const { sop, al, bas, ten, heureDebut, heureFin, date, lieu, programme } =
      req.body;

    // Check if any pupitre's percentage exceeds 100
    if (sop > 100 || al > 100 || bas > 100 || ten > 100) {
      return res.status(400).json({
        message: "Percentage for each pupitre should not exceed 100.",
      });
    }

    const exist_choriste = await User.find({ role: "choriste" });
    const basse = exist_choriste.filter(
      (choriste) => choriste.tessitureVocale === "Basse"
    );
    const tenor = exist_choriste.filter(
      (choriste) => choriste.tessitureVocale === "Tenor"
    );
    const soprano = exist_choriste.filter(
      (choriste) => choriste.tessitureVocale === "Soprano"
    );
    const alto = exist_choriste.filter(
      (choriste) => choriste.tessitureVocale === "Alto"
    );

    const repToUpdate = await repetition.findById(req.params.repetitionId);

    // Remove existing choristers
    repToUpdate.choriste = [];

    // Add choristers based on new percentages
    repToUpdate.choriste = [
      ...getRandomChoristers(basse, bas),
      ...getRandomChoristers(tenor, ten),
      ...getRandomChoristers(soprano, sop),
      ...getRandomChoristers(alto, al),
    ];

    // Update other fields
    repToUpdate.heureDebut = heureDebut || repToUpdate.heureDebut;
    repToUpdate.heureFin = heureFin || repToUpdate.heureFin;
    repToUpdate.date = date || repToUpdate.date;
    repToUpdate.lieu = lieu || repToUpdate.lieu;
    repToUpdate.programme = programme || repToUpdate.programme;

    // Save the updated repetition
    await repToUpdate.save();

    res
      .status(200)
      .json({ message: "Repetition updated successfully", repToUpdate });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//tache 8 asma select tous les repretion

const getAllRepetitions = async (req, res) => {
  try {
    const repetitions = await repetition
      .find()
      .populate("choriste") // Assuming 'choriste' is the correct field to populate
      .populate("concert"); // Assuming 'concert' is the correct field to populate

    res.status(200).json({ message: "Success", repetitions });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// tache 8 asma select by id repetition

const selectRepetitionById = async (req, res) => {
  await repetition
    .findOne({ _id: req.params.id })
    .populate("choriste")
    .populate("concert")
    .then((abs) => {
      if (!abs) {
        return res.status(404).json({
          message: "Objet non trouvé",
        });
      }

      return res.status(200).json({
        model: abs,
        message: "Objet trouvé",
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Erreur interne du serveur",
        error: err.message,
      });
    });
};

// tache 8 asma supprimer repetition

/*supprimer_repetition = (req, res) =>{
    repetition.findOneAndDelete({_id: req.params.id}).then((resultat)=>{
        if(!resultat){res.status(404).json({message: "n'exite pas"})}
        res.status(404).json({message: "Répétition supprimer"})
    })
    .catch((err)=>{
        res.status(404).json({err: err.message})  
    })
}*/
supprimer_repetition = (req, res) => {
  repetition
    .findOneAndDelete({ _id: req.params.id })
    .then((resultat) => {
      if (!resultat) {
        return res.status(404).json({ message: "Répétition n'existe pas" });
      }
      // Use 200 status code for success
      res.status(200).json({ message: "Répétition supprimée" });
    })
    .catch((err) => {
      // Use 500 status code for internal server error
      res.status(500).json({ err: err.message });
    });
};

select_repetition_id = (req, res) => {
  // Exemple d'utilisation
  repetition.findOne(
    {
      /* Conditions pour sélectionner la répétition */
    },
    (err, repetition) => {
      if (err) {
        console.error("Erreur lors de la recherche de la répétition:", err);
        return;
      }

      if (!repetition) {
        console.log("Répétition non trouvée.");
        return;
      }

      // Remplacez le code ci-dessous par la recherche de l'utilisateur lié à la répétition
      User.findOne(
        {
          /* Conditions pour sélectionner l'utilisateur */
        },
        (err, utilisateur) => {
          if (err) {
            console.error("Erreur lors de la recherche de l'utilisateur:", err);
            return;
          }

          if (!utilisateur) {
            console.log("Utilisateur non trouvé.");
            return;
          }

          // Planifiez les rappels pour cette répétition et cet utilisateur
          planifierRappel(repetition, utilisateur);
        }
      );
    }
  );
};

const addParticipantsToRepetition = async (req, res) => {
  try {
    const { repetitionId } = req.params;

    const Repetition = await repetition.findById(repetitionId);
    if (!Repetition) {
      return res.status(404).json({ message: "Répétition non trouvée" });
    }

    const { participants } = req.body;

    if (!participants || participants.length === 0) {
      return res
        .status(400)
        .json({ message: "Veuillez fournir des participants valides" });
    }

    for (const participantId of participants) {
      const participant = await User.findById(participantId);
      if (!participant) {
        console.log(`Utilisateur avec l'ID ${participantId} introuvable`);
        return res
          .status(400)
          .json({ message: "Veuillez fournir des participants valides" });
      }

      if (!Repetition.choriste.includes(participantId)) {
        console.log(
          `Utilisateur avec l'ID ${participantId} n'est pas un choriste de la répétition`
        );
        return res
          .status(400)
          .json({ message: "Veuillez fournir des participants valides" });
      }

      if (Repetition.participants.includes(participantId)) {
        console.log(
          `Utilisateur avec l'ID ${participantId} est déjà ajouté à la répétition`
        );
        continue;
      }

      Repetition.participants.push(participantId);
    }

    await Repetition.save();

    res.status(200).json({
      message: "Participants ajoutés avec succès à la répétition",
      repetition: Repetition,
    });
  } catch (error) {
    console.error(
      "Erreur lors de l'ajout des participants à la répétition:",
      error
    );
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

module.exports = {
  /* ajouter_repetition: ajouter_repetition,*/

  supprimer_repetition: supprimer_repetition,
  //modifier_repetition: modifier_repetition,
  //ajouter_repetition2:ajouter_repetition2,
  select_repetition_id: select_repetition_id,
  // select_repetition: select_repetition,
  setseuils,
  //AbsenceStat,

  //supprimer_repetition: supprimer_repetition,
  //modifier_repetition: modifier_repetition,
  //select_repetition: select_repetition,
  //ajouter_repetition2:ajouter_repetition2,
  //select_repetition_id: select_repetition_id,
  createRepetition: createRepetition,
  updateRepetition: updateRepetition,
  getAllRepetitions: getAllRepetitions,
  selectRepetitionById: selectRepetitionById,
  supprimer_repetition: supprimer_repetition,
  addParticipantsToRepetition: addParticipantsToRepetition,
};
