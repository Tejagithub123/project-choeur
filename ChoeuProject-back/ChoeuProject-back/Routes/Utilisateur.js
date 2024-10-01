// @ts-ignore

const CategoryUtlisateur = require("../Controllers/Utilisateur");
const express = require("express");

const RouterUtlisateur = express.Router();
const net = require("net");
const loggedMiddleware2 = require("../middelwares/auth2");
const auth = require("../middelwares/auth");
const controllerUser = require("../Controllers/Utilisateur");

const audition = require("../Models/audition");
const sendNotificationNomine = require("../middelwares/sendNotificationNomine");
const CategoryRepetition = require("../Controllers/repetition");
const loggedMiddleware = require("../middelwares/logmiddelware");

RouterUtlisateur.post(
  "/sendEmailToChoristesWithSameTessiture/:repetitionId/:pupitreId",
  CategoryUtlisateur.sendEmailToChoristesWithSameTessiture
);

RouterUtlisateur.post("/", CategoryUtlisateur.ajouter_utlisateur);

RouterUtlisateur.put("/updateRep/:id", CategoryUtlisateur.Updaterepetition);

RouterUtlisateur.patch("/updateStatus/:userId", controllerUser.updateStatus);
RouterUtlisateur.patch(
  "/updateAudition/:id",
  controllerUser.UpdateTessitureVocal
);

//modifier asma
//RouterUtlisateur.put('/:id',auth.loggedMiddleware,auth.isAdmin,CategoryUtlisateur.modifier_utlisateur )

RouterUtlisateur.put(
  "/:id",
  auth.loggedMiddleware3,
  auth.isAdmin,
  CategoryUtlisateur.modifier_utlisateur
);

RouterUtlisateur.post("/AddChoriste", controllerUser.AddChoriste);

RouterUtlisateur.get("/profil/:id", controllerUser.profil);

RouterUtlisateur.get(
  "/getChoristeParConcert/:concertId",
  auth.loggedMiddleware,
  auth.isAdmiin,
  controllerUser.getChoristeParConcert
);

RouterUtlisateur.patch(
  "/indiquerDispo/:id",
  auth.loggedMiddleware,
  auth.isChoristee,
  controllerUser.IndiquerDisponibilté
);
//teja
RouterUtlisateur.post(
  "/generateUrl/:id_repetition/",
  auth.isChoristee,
  controllerUser.createAbsence
);
//teja
RouterUtlisateur.post(
  "/presenceConcert/:id_Concert",
  auth.isChoristee,
  controllerUser.createAbsenceConcert
);

RouterUtlisateur.post(
  "/marquerManuellement_repitition/:id",
  auth.loggedMiddleware,
  auth.isChef_Pupitre,
  controllerUser.marquerPresenceManuellementA_repitition
);

RouterUtlisateur.post(
  "/marquerManuellement_concert/:id",
  auth.loggedMiddleware,
  auth.isChef_Pupitre,
  controllerUser.marquerPresenceManuellementA_concert
);

RouterUtlisateur.post("/login", controllerUser.login);
/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Connexion - Authentification  utilisateur
 *     tags:
 *       - Utilisateurs
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *                 description: Identifiant de l'utilisateur
 *               password:
 *                 type: string
 *                 description: Mot de passe de l'utilisateur
 *     responses:
 *       200:
 *         description: Connexion réussie - Token d'authentification généré
 *       401:
 *         description: Identifiant ou mot de passe incorrect
 *       500:
 *         description: Erreur interne du serveur
 */

//RouterUtlisateur.put('/:id',CategoryUtlisateur.modifier_utlisateur )

// suprimer un compte
RouterUtlisateur.delete(
  "/:id",
  auth.loggedMiddleware3,
  auth.isAdmin,
  CategoryUtlisateur.supprimer_utilisateur
);

// selecter touts les chefPupitre

// selecter touts les choeuriste

// selecter touts les choristes diponible a un concert par pupitre

RouterUtlisateur.get(
  "/getChoristeParchefPupitreParConcert/:id",
  loggedMiddleware.loggedMiddleware,
  loggedMiddleware.isAdmin,
  CategoryUtlisateur.getParticipantsByChefPupitre
);

/**
 * @swagger
 * /getChoristeParchefPupitreParConcert/{id}:
 *   get:
 *     summary: Recuperer la liste des participants par chef de pupitre pour un concert donné
 *     tags:
 *       - utilisateurs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the concert.
 *     responses:
 *       200:
 *         description: Successful Renvoie la liste des participants par chef de pupitre
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/userResponse'
 *       404:
 *         description: Concert not found.
 *       500:
 *         description: Internal Server Error. Error during the retrieval of participants.
 */

RouterUtlisateur.get(
  "/getChoristeParchefPupitreParConcert/:id",
  CategoryUtlisateur.getParticipantsByChefPupitres
);

// selecter la liste finale des choristes diponible a un concert par pupitre
RouterUtlisateur.get(
  "/getListFinalChoristeParchefPupitreParConcert/:id",
  loggedMiddleware.loggedMiddleware,
  loggedMiddleware.isAdmin,
  CategoryUtlisateur.getParticipantsByChefPupitreWithSeuil
);

/**
 * @swagger
 * /getListFinalChoristeParchefPupitreParConcert/{id}:
 *   get:
 *     summary: Retrieve participants by Chef de Pupitre with Seuil for a specific concert.
 *     tags:
 *       - utilisateurs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the concert.
 *     responses:
 *       200:
 *         description: Successful response with a list of participants grouped by Chef de Pupitre.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/userResponse'
 *       404:
 *         description: Concert not found.
 *       500:
 *         description: Internal Server Error. Error during the retrieval of participants.
 */

/**
 * @swagger
 * /api/utilisateur/{id}:
 *   delete:
 *     summary: Delete a user by ID.
 *     description: Delete a user by providing their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the user to be deleted.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: User deleted successfully
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: User not found
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Internal server error
 */

// selecter touts les chefPupitre
RouterUtlisateur.get(
  "/getchefPupitre",
  auth.loggedMiddleware3,
  auth.isAdmin,
  CategoryUtlisateur.selectionner_chefPupitre
);
/**
 * @swagger
 * /api/utilisateur/getchefPupitre:
 *   get:
 *     summary: Retrieve all chief pupitre.
 *     description: Retrieve a list of all chief pupitre without displaying the 'demandeConge' property.
 *     responses:
 *       200:
 *         description: Successful response with a list of chief pupitre.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               chiefPupitre: [{ _id: '123', nom: 'John', prenom: 'Doe' }, { _id: '456', nom: 'Jane', prenom: 'Doe' }]
 *       500:
 *         description: Internal server error.
 */

// selecter  des choristes present a une repetition par pupitre
RouterUtlisateur.get(
  "/getEtatpresenceParchefPupitre/:chefPupitre/:repetitionId",
  loggedMiddleware.loggedMiddleware,
  loggedMiddleware.ischefPupitre,
  CategoryUtlisateur.getPresenceByChefPupitreAndRepetition
);

/**
 * @swagger
 * /getEtatpresenceParchefPupitre/{chefPupitre}/{repetitionId}:
 *   get:
 *     summary: Retrieve the presence status of choristers in a rehearsal for a specific Chef de Pupitre.
 *     tags:
 *       - utilisateurs
 *     parameters:
 *       - in: path
 *         name: chefPupitre
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the chef de pupitre.
 *       - in: path
 *         name: repetitionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the chef de repetition.
 *     responses:
 *       200:
 *         description: Successful response with a list of choristers and their presence status.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/userResponse'
 *       404:
 *         description: Concert not found.
 *       500:
 *         description: Internal Server Error. Error during the retrieval of participants.
 */

// selecter touts les choeuriste
RouterUtlisateur.get(
  "/getchoristes",
  auth.loggedMiddleware,
  auth.isAdmin,
  CategoryUtlisateur.selectionner_choristes
);

//teja selecter touts les choeuriste qr  repetitions
RouterUtlisateur.get(
  "/getchoristesall",
  auth.loggedMiddlewares,
  auth.isChoriste,
  CategoryUtlisateur.selectionner_choristes
);

// selecter touts les choeuriste  d'un pupitre  pour envoyer une info rapide

// selecter touts les choeuriste  d'un pupitre
RouterUtlisateur.get(
  "/getchoristesBypupitre/:id",
  CategoryUtlisateur.getChoristeByChefPupitre
);

// getby_id
RouterUtlisateur.get(
  "/:id",
  auth.loggedMiddleware3,
  CategoryUtlisateur.selectionner_id
);

RouterUtlisateur.get(
  "/ut/ut",
  auth.loggedMiddleware3,
  auth.isAdmin,
  CategoryUtlisateur.selectionner
);

//aziz
RouterUtlisateur.get("/getutilisateur/:id", CategoryUtlisateur.getUtilisateur);
///

// Archiver  les utlisateur
RouterUtlisateur.put("/archiveuser", CategoryUtlisateur.archiveUsersBySeason);

//signup
RouterUtlisateur.post("/signup", CategoryUtlisateur.signup);

//login
RouterUtlisateur.post("/login/login/lo", CategoryUtlisateur.log);

//changer password asma

RouterUtlisateur.put(
  "/changer/changerpassword",
  loggedMiddleware2,
  CategoryUtlisateur.changerpass
);

RouterUtlisateur.get(
  "/consulterstatuthistorique/:userId",
  auth.loggedMiddlewares,
  auth.isChoristehim,
  CategoryUtlisateur.getStatutHistorique
);

RouterUtlisateur.post(
  "/demandeConge/:userId",
  CategoryUtlisateur.demanderConge
);

RouterUtlisateur.put(
  "/approuverRejeterConge/:userId",
  CategoryUtlisateur.approuverRejeterConge
);

RouterUtlisateur.post(
  "/designer2chefspupitre",
  auth.loggedMiddlewares,
  auth.isManagerChoeur,
  CategoryUtlisateur.designerdeuxchefs
);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Connexion - Authentification  utilisateur
 *     tags:
 *       - Utilisateurs
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *                 description: Identifiant de l'utilisateur
 *               password:
 *                 type: string
 *                 description: Mot de passe de l'utilisateur
 *     responses:
 *       200:
 *         description: Connexion réussie - Token d'authentification généré
 *       401:
 *         description: Identifiant ou mot de passe incorrect
 *       500:
 *         description: Erreur interne du serveur
 */

RouterUtlisateur.post("/sendEmail", controllerUser.EmailTodisponiblechoriste);

RouterUtlisateur.get(
  "/consulterstatuthistorique/:userId",
  CategoryUtlisateur.getStatutHistorique
);

RouterUtlisateur.post("/AddChoriste", CategoryUtlisateur.AddChoriste);
RouterUtlisateur.get(
  "/getChoristeParConcert/:id",
  CategoryUtlisateur.getChoristeParConcert
);
RouterUtlisateur.get("/profil/:id", CategoryUtlisateur.profil);
RouterUtlisateur.patch(
  "/indiquerDispo/:id",
  CategoryUtlisateur.IndiquerDisponibilté
);

//tache etd3 congee
RouterUtlisateur.post(
  "/approuverConge/:congeeId",
  auth.loggedMiddlewares,
  auth.isAdmin,
  CategoryUtlisateur.approuverRejeterConge
);

RouterUtlisateur.get(
  "/consulterstatuthistorique/:userId",
  CategoryUtlisateur.getStatutHistorique
);

RouterUtlisateur.post(
  "/demandeConge/:userId",
  CategoryUtlisateur.demanderConge
);

RouterUtlisateur.put(
  "/approuverRejeterConge/:userId",
  CategoryUtlisateur.approuverRejeterConge
);

RouterUtlisateur.post(
  "/designer2chefspupitre",
  CategoryUtlisateur.designerdeuxchefs
);

RouterUtlisateur.patch(
  "/updateAudition/:id",
  CategoryUtlisateur.UpdateTessitureVocal
);

//3 absence répétition pour chaque choristes
RouterUtlisateur.get(
  "/lesabsences/repetitions",
  auth.loggedMiddlewares,
  auth.isAdmin,
  CategoryUtlisateur.retournerAbsencespourChoriste
);

//3 absence concert pour chaque choristes
RouterUtlisateur.get(
  "/lesabsences/concerts",
  auth.loggedMiddlewares,
  auth.isAdmin,
  CategoryUtlisateur.retournerAbsencesConcertPourChoristes
);

//3nominé  //éliminé
RouterUtlisateur.get(
  "/calculate/repetition",
  auth.loggedMiddlewares,
  auth.isAdmin,
  CategoryUtlisateur.calculateNominationsAndEliminations
),
  RouterUtlisateur.get(
    "/calculate/concerts",
    auth.loggedMiddlewares,
    auth.isAdmin,
    CategoryUtlisateur.calculateUserConcertNominationElimination
  ),
  //éliminerchoriste
  RouterUtlisateur.post(
    "/eliminerchoriste/:userId",
    auth.loggedMiddlewares,
    auth.isAdmin,
    CategoryUtlisateur.eliminerChoriste
  );

//get  nominé
RouterUtlisateur.get(
  "/getall/nomines",
  auth.loggedMiddlewares,
  auth.isAdmin,
  CategoryUtlisateur.getNomineeChoristes
);
//get éliminé
RouterUtlisateur.get(
  "/getall/elimines",
  auth.loggedMiddlewares,
  auth.isAdmin,
  CategoryUtlisateur.getElimineeChoristes
);
RouterUtlisateur.get(
  "/getall/eliminesfinal",
  auth.loggedMiddlewares,
  auth.isAdmin,
  CategoryUtlisateur.getAllEliminatedChoristes
);

RouterUtlisateur.post("/sendEmail", controllerUser.EmailTodisponiblechoriste);

module.exports = RouterUtlisateur;

RouterUtlisateur.get(
  "/get/AllRepetitionsQR",
  auth.loggedMiddleware,
  auth.isChoriste,
  CategoryUtlisateur.getAllRepetitions
);
//teja
RouterUtlisateur.get(
  "/nomines/show",
  auth.loggedMiddlewares,
  auth.isAdmin,
  CategoryUtlisateur.calculateNominations
);
//teja
RouterUtlisateur.post(
  "/selectNominees",
  auth.loggedMiddlewares,
  auth.isAdmin,
  sendNotificationNomine,
  CategoryUtlisateur.selectNominees
);

//aziz
RouterUtlisateur.patch(
  "/UpdateutilisateurNotif/:id",
  CategoryUtlisateur.UpdateutilisateurNotif
);
RouterUtlisateur.get("/getuser/user", controllerUser.select_user);
///

//aziz
RouterUtlisateur.get(
  "/getallchoristes/s",
  auth.loggedMiddleware,
  auth.isAdmin,
  CategoryUtlisateur.selectionner_allchoriste
);

//aziz
RouterUtlisateur.patch("/updateSchedule", controllerUser.updateSchedule);
//aziz
