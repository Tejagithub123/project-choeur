const CategoryAbsences = require("../Controllers/absences");

const express = require("express");
const RouterAbsences = express.Router();

const auth = require("../middelwares/auth");

RouterAbsences.post(
  "/abs/ab/",
  auth.loggedMiddleware3,
  auth.isChoriste,
  CategoryAbsences.ajouter_absences
);

/**
 * @swagger
 * paths:
 *   /api/absences:
 *     post:
 *       summary: Ajouter une absence
 *       tags:
 *         - Absences
 *       security:
 *         - bearerAuth: []  # Utilise l'authentification Bearer (jeton)
 *       requestBody:
 *         description: Données de la nouvelle absence
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 etat:
 *                   type: string
 *                   description: État de l'absence
 *                 raison_absence:
 *                   type: string
 *                   description: Raison de l'absence
 *                 dates_absence:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: date
 *                   description: Liste des dates d'absence
 *                 concert:
 *                   type: boolean
 *                   description: Indicateur si l'absence concerne un concert
 *                 repetitions:
 *                   type: boolean
 *                   description: Indicateur si l'absence concerne des répétitions
 *       responses:
 *         '201':
 *           description: Absence ajoutée avec succès
 *         '400':
 *           description: Requête incorrecte
 *         '401':
 *           description: Non autorisé
 */

RouterAbsences.get("/:id", CategoryAbsences.select_absences_id);

RouterAbsences.put("/", auth.isAdmiin, CategoryAbsences.AbsenceStat);

RouterAbsences.post("/", CategoryAbsences.ajouter_absences);

//RouterAbsences.post('/ab_choriste/abc/:id',CategoryAbsences.absence_plusieurdate)

RouterAbsences.post(
  "/absences/:choristeId",
  auth.loggedMiddleware,
  auth.isChoriste,
  CategoryAbsences.ajouter_abs_unseul
);
/**
 * @swagger
 * /api/absences/absences/{choristeId}:
 *   post:
 *     summary: Ajouter une absence pour un choriste spécifié.
 *     description: Ajouter une absence pour un choriste spécifié par son ID.
 *     parameters:
 *       - in: path
 *         name: choristeId
 *         required: true
 *         description: ID du choriste pour lequel ajouter l'absence.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               etat:
 *                 type: string
 *                 description: État de l'absence.
 *               raison_absence:
 *                 type: string
 *                 description: Raison de l'absence.
 *               date_absence:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: date
 *                 description: Tableau de dates d'absence (format YYYY-MM-DD).
 *               concert:
 *                 type: string
 *                 description: ID du concert lié à l'absence.
 *               repetitions:
 *                 type: string
 *                 description: ID de la répétition liée à l'absence.
 *               choriste:
 *                 type: string
 *                 description: ID du choriste lié à l'absence (doit correspondre à choristeId).
 *     responses:
 *       201:
 *         description: Succès, absence ajoutée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 model:
 *                   $ref: '#/components/schemas/Absence'  # Référence au schéma Absence
 *                 message:
 *                   type: string
 *                   description: Message de succès
 *       400:
 *         description: Requête invalide, vérifiez vos informations.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   description: Message d'erreur
 *       500:
 *         description: Erreur interne du serveur, réessayez ultérieurement.
 */

RouterAbsences.put("/stat", CategoryAbsences.AbsenceStat);

/**
 * @swagger
 * /api/absences:
 *   put:
 *     summary: Statistiques des presences/absences par repitition 
 *     description: Retrieve statistics for attendance and absence based on rehearsal repetitions.
 *     responses:
 *       200:
 *         description: Successful response with attendance and absence statistics.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   repetition:
 *                     type: string
 *                     description: ID of the rehearsal repetition.
 *                   nbPresence:
 *                     type: integer
 *                     description: Number of attendees in the rehearsal repetition.
 *                   nbAbsence:
 *                     type: integer
 *                     description: Number of absences in the rehearsal repetition.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:

 *                 err:
 *                   type: string
 *                   description: Message d'erreur interne

 *                 error:
 *                   type: string
 *                   description: Error message
 */

RouterAbsences.get("/a/b", CategoryAbsences.select_absences_selon_critères);

/**
 * @swagger
 * /api/Absences:
 *   get:
 *     summary: Afficher etat des absences par critéres
 *     tags: [Absences]
 *     parameters:
 *       - in: query
 *         name: programme
 *         schema:
 *           type: string
 *         description: Filter absences by program
 *       - in: query
 *         name: saison
 *         schema:
 *           type: string
 *         description: Filter absences by season
 *       - in: query
 *         name: pupitre
 *         schema:
 *           type: string
 *         description: Filter absences by section
 *       - in: query
 *         name: dateAbsence
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter absences by date
 *       - in: query
 *         name: choriste
 *         schema:
 *           type: string
 *         description: Filter absences by chorister
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *              schema:
 *                  type: array
 *                  items:
 *                      $ref: '#/components/schemas/Absence'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Absence:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the absence
 *           example: 1dzf5f5jbjv5555
 *         Presence:
 *           type: boolean
 *           description: Indicates whether the chorister was present
 *         repetitions:
 *           $ref: '#/components/schemas/Repetition'
 *         choriste:
 *           $ref: '#/components/schemas/Chorister'
 *       example:
 *         _id: 1dzf5f5jbjv5555
 *         Presence: false
 *         repetitions: {}
 *         choriste: {}
 *
 *     Repetition:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the repetition
 *           example: 1dzf5f5jbjv5555
 *         date:
 *           type: string
 *           format: date
 *           description: The date of the repetition
 *           example: 2024-01-15
 *         lieu:
 *           type: string
 *           description: The location of the repetition
 *           example: Concert Hall
 *       example:
 *         _id: 1dzf5f5jbjv5555
 *         date: 2024-01-15
 *         lieu: Concert Hall
 *
 *     Chorister:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the chorister
 *           example: 1dzf5f5jbjv5555
 *         name:
 *           type: string
 *           description: The name of the chorister
 *           example: John Doe
 *       example:
 *         _id: 1dzf5f5jbjv5555
 *         name: John Doe
 */

//aziz
RouterAbsences.get("/a/b", CategoryAbsences.select_absences_selon_critères);

module.exports = RouterAbsences;
