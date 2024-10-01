const express = require("express");
const router = express.Router();
const concertController = require("../Controllers/concert2");

const loggedMiddleware = require("../middelwares/logmiddelware");
// tasks est un variable bach n7ot fih liste

const auth = require("../middelwares/auth");

/**
 * @swagger
 * components:
 *   schemas:
 *     ConcertInput:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date-time
 *         lieu:
 *           type: string
 *         affiche:
 *           type: string
 *         heuredébut:
 *           type: string
 *           format: date-time
 *         heurefin:
 *           type: string
 *           format: date-time
 *         confirmationLink:
 *           type: string
 *         seuilpresence:
 *           type: number
 *         disponible:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               choriste:
 *                 type: string
 *                 format: uuid
 *               diponibilite:
 *                 type: boolean
 *         Absences:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               choriste:
 *                 type: string
 *                 format: uuid
 *               absent:
 *                 type: boolean
 *         presences:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               choriste:
 *                 type: string
 *                 format: uuid
 *               present:
 *                 type: boolean
 *         programme:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               oeuvre:
 *                 type: string
 *                 format: uuid
 *               besoin_choeur:
 *                 type: boolean
 *         Absence:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *     ConcertUpdateInput:
 *       type: object
 *       properties:
 *         seuilpresence:
 *           type: number
 *     ConcertResponse:
 *       type: object
 *       properties:
 *         model:
 *           $ref: '#/components/schemas/ConcertInput'
 *         message:
 *           type: string
 *
 *     concertsListResponse:
 *       type: object
 *       properties:
 *         Oeuvres:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ConcertResponse'
 *
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *         message:
 *           type: string
 */
router.get(
  "/getAll",
  loggedMiddleware.loggedMiddleware,
  concertController.getConcerts
);

/**
 * @swagger
 * /api/concert/getAll:
 *   get:
 *     summary: Get all concerts
 *     tags:
 *       - concerts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/concertsListResponse'
 *       '400':
 *         description: Error in fetching compsiteur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

router.patch(
  "/cons/seuil/p/:id",
  loggedMiddleware.loggedMiddleware,
  loggedMiddleware.isAdmin,
  concertController.updateSoeuilConcert
);

/**
 * @swagger
 * /api/concert/seuil/{id}:
 *   put:
 *     summary: Update an oeuvre by ID
 *     tags:
 *       - concerts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the concert to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConcertUpdateInput'
 *     responses:
 *       '200':
 *         description: oeuvres updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConcertResponse'
 *       '404':
 *         description: concerts not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '400':
 *         description: Error in updating concert
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
module.exports = router;
