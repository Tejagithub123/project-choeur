// @ts-ignore
const CategoryRepetition = require("../Controllers/repetition");
const Repetetion = require("../Models/Repetition");
const express = require("express");
const RouterRepetition = express.Router();
const Absence = require("../Models/absences");
const auth = require("../middelwares/auth");
//RouterRepetition.post('/',CategoryRepetition.ajouter_repetition2 )
//aj

//repetition avec notifs
//RouterRepetition.post('/notif',CategoryRepetition.ajouter_repetition3 )

/*RouterRepetition.post('/',CategoryRepetition.ajouter_repetition )*/

/*RouterRepetition.delete('/:id',CategoryRepetition.supprimer_repetition )

RouterRepetition.put('/:id',CategoryRepetition.modifier_repetition )

RouterRepetition.get('/',CategoryRepetition.select_repetition )

RouterRepetition.get('/:id',CategoryRepetition.select_repetition_id )*/

RouterRepetition.post(
  "/seuils",
  auth.loggedMiddlewares,
  auth.isAdmin,
  CategoryRepetition.setseuils
);

/**
 * @swagger
 * paths:
 *   /api/repetition/seuils:
 *     post:
 *       summary: Définir les seuils pour les répétitions
 *       tags:
 *         - Repetition
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 seuilNomination:
 *                   type: number
 *                   description: Seuil de nomination en pourcentage (ex. 50 pour 50%)
 *                 seuilElimination:
 *                   type: number
 *                   description: Seuil d'élimination en pourcentage (ex. 100 pour 100%)
 *       responses:
 *         '200':
 *           description: Seuils définis avec succès
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *         '500':
 *           description: Erreur lors de la définition des seuils
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 */

//RouterRepetition.get('/abs',CategoryRepetition.AbsenceStat )

//auth.loggedMiddleware3 it was
// tache 8
RouterRepetition.post(
  "/ajout/reptition",
  auth.loggedMiddleware,
  auth.isAdmin,
  CategoryRepetition.createRepetition
);
/**
 * @swagger
 * /api/repetition/ajout/reptition:
 *   post:
 *     summary: Create a new repetition.
 *     description: Create a new repetition with specified details and assign choristers based on given percentages.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the concert to which the repetition belongs.
 *         schema:
 *           type: string
 *           example: '123'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               heureDebut:
 *                 type: string
 *                 description: The start time of the repetition.
 *                 example: '18:00'
 *               heureFin:
 *                 type: string
 *                 description: The end time of the repetition.
 *                 example: '20:00'
 *               date:
 *                 type: string
 *                 description: The date of the repetition.
 *                 example: '2024-01-01'
 *               lieu:
 *                 type: string
 *                 description: The location of the repetition.
 *                 example: 'Salle de concert XYZ'
 *               sop:
 *                 type: number
 *                 description: The percentage of sopranos participating in the repetition.
 *                 example: 50
 *               al:
 *                 type: number
 *                 description: The percentage of altos participating in the repetition.
 *                 example: 50
 *               bas:
 *                 type: number
 *                 description: The percentage of basses participating in the repetition.
 *                 example: 0
 *               ten:
 *                 type: number
 *                 description: The percentage of tenors participating in the repetition.
 *                 example: 0
 *     responses:
 *       200:
 *         description: Repetition created successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: 'Success! Repetition created.'
 *               response: { _id: '123', heureDebut: '18:00', heureFin: '20:00', date: '2024-01-01', lieu: 'Salle de concert XYZ', choriste: ['choristeId1', 'choristeId2', ...] }
 *       400:
 *         description: Bad request. Invalid input or missing parameters.
 *       500:
 *         description: Internal server error.
 */

RouterRepetition.put(
  "/repetition/:repetitionId",
  auth.loggedMiddleware3,
  auth.isAdmin,
  CategoryRepetition.updateRepetition
);

/**
 * @swagger
 * /api/repetition/repetition/{repetitionId}:
 *   put:
 *     summary: Update a repetition by ID.
 *     description: Update the details of a repetition based on the provided repetition ID.
 *     parameters:
 *       - in: path
 *         name: repetitionId
 *         required: true
 *         description: The ID of the repetition to be updated.
 *         schema:
 *           type: string
 *           example: '123'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               heureDebut:
 *                 type: string
 *                 description: The updated start time of the repetition.
 *                 example: '18:00'
 *               heureFin:
 *                 type: string
 *                 description: The updated end time of the repetition.
 *                 example: '20:00'
 *               date:
 *                 type: string
 *                 description: The updated date of the repetition.
 *                 example: '2024-01-01'
 *               lieu:
 *                 type: string
 *                 description: The updated location of the repetition.
 *                 example: 'Updated Location'
 *               choriste:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: An array of chorister IDs participating in the repetition.
 *                 example: ['choristeId1', 'choristeId2']
 *     responses:
 *       200:
 *         description: Repetition updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: 'Success! Repetition updated.'
 *               response: { _id: '123', heureDebut: '18:00', heureFin: '20:00', date: '2024-01-01', lieu: 'Updated Location', choriste: ['choristeId1', 'choristeId2'] }
 *       400:
 *         description: Bad request. Invalid input or missing parameters.
 *       404:
 *         description: Repetition not found.
 *         content:
 *           application/json:
 *             example:
 *               message: 'Repetition not found.'
 *       500:
 *         description: Internal server error.
 */

RouterRepetition.get(
  "/get/All",
  auth.loggedMiddleware3,
  auth.isAdmin,
  CategoryRepetition.getAllRepetitions
);
//teja qr
RouterRepetition.get(
  "/get/AllRepetitions",
  auth.loggedMiddleware,
  auth.isChoriste,
  CategoryRepetition.getAllRepetitions
);

/**
 * @swagger
 * /api/repetition/get/All:
 *   get:
 *     summary: Retrieve all repetitions.
 *     description: Retrieve a list of all repetitions.
 *     responses:
 *       200:
 *         description: Successful response with a list of repetitions.
 *         content:
 *           application/json:
 *             example:
 *               message: 'Success! Repetitions retrieved.'
 *               repetitions: [
 *                 { _id: '123', heureDebut: '18:00', heureFin: '20:00', date: '2024-01-01', lieu: 'Location 1', choriste: ['choristeId1', 'choristeId2'] },
 *                 { _id: '456', heureDebut: '19:00', heureFin: '21:00', date: '2024-01-02', lieu: 'Location 2', choriste: ['choristeId3', 'choristeId4'] }
 *               ]
 *       500:
 *         description: Internal server error.
 */

RouterRepetition.get(
  "/getby_id/:id",
  auth.loggedMiddleware3,
  auth.isAdmin,
  CategoryRepetition.selectRepetitionById
);

/**
 * @swagger
 * /api/repetition/getby_id/{id}:
 *   get:
 *     summary: Retrieve a repetition by ID.
 *     description: Retrieve a repetition by providing its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the repetition to be retrieved.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response with the repetition details.
 *         content:
 *           application/json:
 *             example:
 *               message: 'Success! Repetition retrieved.'
 *               repetition: { _id: '123', heureDebut: '18:00', heureFin: '20:00', date: '2024-01-01', lieu: 'Location 1', choriste: ['choristeId1', 'choristeId2'] }
 *       404:
 *         description: Repetition not found.
 *         content:
 *           application/json:
 *             example:
 *               message: 'Repetition not found.'
 *       500:
 *         description: Internal server error.
 */

RouterRepetition.delete(
  "/supprimer/:id",
  auth.loggedMiddleware3,
  auth.isAdmin,
  CategoryRepetition.supprimer_repetition
);

/**
 * @swagger
 * /api/repetition/supprimer/{id}:
 *   delete:
 *     summary: Delete a repetition by ID.
 *     description: Delete a repetition by providing its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the repetition to be deleted.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Repetition deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: 'Repetition deleted successfully.'
 *       404:
 *         description: Repetition not found.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: 'Repetition not found.'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: 'Internal server error.'
 */

//RouterRepetition.get('/abs',CategoryRepetition.AbsenceStat )

RouterRepetition.post(
  "/participe/:repetitionId/addParticipants",
  auth.loggedMiddleware,
  auth.isAdmin,
  CategoryRepetition.addParticipantsToRepetition
);

module.exports = RouterRepetition;
