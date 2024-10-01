const express = require("express");
const router = express.Router();

const cron = require("node-cron");
const controllerCandidat = require("../Controllers/Candidat");
const auth = require("../middelwares/auth");

/**
 * @swagger
 * tags:
 *   name: Absences
 *   description: API for managing absences
 */

router.get("/candidats/list", auth.isAdmiin, controllerCandidat.ListCandidats);

/**
 * @swagger
 * /api/candidats/list:
 *   get:
 *     summary: List candidates with pagination and filtering
 *     tags: [Candidats]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           description: The page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           description: The number of items to return per page
 *       - in: query
 *         name: nom
 *         schema:
 *           type: string
 *           description: Filter candidates by name
 *       - in: query
 *         name: prenom
 *         schema:
 *           type: string
 *           description: Filter candidates by last name
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CandidateListResponse'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CandidateListResponse:
 *       type: object
 *       properties:
 *         candidats:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Candidate'
 *         currentPage:
 *           type: integer
 *           description: The current page number
 *         totalPages:
 *           type: integer
 *           description: The total number of pages
 *         message:
 *           type: string
 *           description: A success message
 *     Candidate:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the candidate
 *         nom:
 *           type: string
 *           description: The name of the candidate
 *         prenom:
 *           type: string
 *           description: The last name of the candidate
 *         // Add other properties of your Candidate model here
 */

router.get("/notifier", controllerCandidat.notifierAdmin);

//teja
router.get(
  "/planningAudition",
  auth.isAdmiin,
  auth.loggedMiddleware,
  controllerCandidat.planningAudition
);

/**
 * @swagger
 * /api/planningAudition:
 *   get:
 *     summary: Afficher planning des audition par date par heure et par les 2
 *     tags: [Auditions]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           description: The date for filtering auditions
 *       - in: query
 *         name: heure
 *         schema:
 *           type: string
 *           description: The time for filtering auditions
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuditionListResponse'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AuditionListResponse:
 *       type: object
 *       properties:
 *         auditions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Audition'
 *         message:
 *           type: string
 *           description: A success message
 *     Audition:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the audition
 *         // Add other properties of your Audition model here
 *         date:
 *           type: string
 *           description: The date of the audition
 *         heure:
 *           type: string
 *           description: The time of the audition
 *         Candidat:
 *           $ref: '#/components/schemas/Candidate'
 *     Candidate:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the candidate
 *         nom:
 *           type: string
 *           description: The name of the candidate
 *         prenom:
 *           type: string
 *           description: The last name of the candidate
 *         // Add other properties of your Candidate model here
 */

router.get(
  "/planifier2",
  auth.isAdmiin,
  controllerCandidat.planifierAuditions2
);
//teja
router.post(
  "/planifier3",
  auth.isAdmiin,
  controllerCandidat.planifierAuditions3
);
//teja
router.get(
  "/getallAuditionsCandidats",
  auth.isAdmiin,
  controllerCandidat.getAllAuditionsWithCandidates
);

/**
 * @swagger
 * /api/planifier2:
 *   get:
 *     summary: Planifier des auditions
 *     tags: [Auditions]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlanificationAuditionResponse'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PlanificationAuditionResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: A success message
 */

router.put(
  "/updateAuditions",
  auth.isAdmiin,
  controllerCandidat.updateAuditions
);

//router.get('/planifier',controllerCandidat.planifierAuditions);
//router.get('/ChercherCandidat/:key',controllerCandidat.ChercherCandidat);
cron.schedule("0 20 * * *", async () => {
  console.log("Exécution de la notification quotidienne à 21:00...");
  await controllerCandidat.notifierAdmin();
});
module.exports = router;
