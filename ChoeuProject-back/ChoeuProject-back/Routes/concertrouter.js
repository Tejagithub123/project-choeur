const express = require("express");
const router = express.Router();
const multer = require("multer");
const xlsx = require("xlsx");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const RouterConcert = express.Router();
const auth = require("../middelwares/auth");

const concertController = require("../Controllers/concertcontroller");
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
 *               diponiblitee:
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
 *
 *     ConcertResponse:
 *       type: object
 *       properties:
 *         model:
 *           $ref: '#/components/schemas/ConcertInput'
 *         message:
 *           type: string
 *
 *     ConcertsListResponse:
 *       type: object
 *       properties:
 *         Concerts:
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

//teja QR concert
router.get(
  "/getallconcerts",
  auth.loggedMiddleware,
  auth.isChoriste,
  concertController.getConcerts
);

router.post(
  "/",
  auth.loggedMiddlewares,
  auth.isAdmin,
  concertController.addConcert
);
router.get(
  "/getall",
  auth.loggedMiddlewares,
  auth.isAdmin,
  concertController.getConcerts
);
router.get(
  "/:id",
  auth.loggedMiddlewares,
  auth.isAdmin,
  concertController.getConcert
);
router.put(
  "/:id",
  auth.loggedMiddlewares,
  auth.isAdmin,
  concertController.updateConcert
);
router.patch(
  "/:id",
  auth.loggedMiddlewares,
  auth.isAdmin,
  concertController.updateSoeuilConcert
);

router.delete(
  "/:id",
  auth.loggedMiddlewares,
  auth.isAdmin,
  concertController.deleteConcert
);

router.post(
  "/addConcertExcel/:concertId",
  auth.loggedMiddlewares,
  auth.isAdmin,
  upload.single("excelFile"),
  concertController.addConcertExcel
);
router.post(
  "/seuils",
  auth.loggedMiddlewares,
  auth.isAdmin,
  concertController.setseuilsconcerts
);
module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     ConcertInput:
 *       type: object
 *       properties:
 *         titre:
 *           type: string
 *         date:
 *           type: string
 *           format: date
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
 *         disponible:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               choriste:
 *                 type: string
 *                 format: uuid
 *               diponiblitee:
 *                 type: boolean
 *           default: []
 *         urlQR:
 *           type: string
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
 *           default: []
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
 *               QRCodeConcert:
 *                 type: string
 *               raisonAjoutManuellement:
 *                 type: string
 *           default: []
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
 *           default: []
 *         participants:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               choriste:
 *                 type: string
 *                 format: uuid
 *               pupitre:
 *                 type: string
 *           default: []
 *         Absence:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *
 *     ConcertResponse:
 *       type: object
 *       properties:
 *         model:
 *           $ref: '#/components/schemas/ConcertInput'
 *         message:
 *           type: string
 *           example: Concert created successfully
 *
 *     ConcertsListResponse:
 *       type: object
 *       properties:
 *         concerts:
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
 *
 
 *   responses:
 *     ConcertResponse:
 *       description: Concert operation response
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConcertResponse'
 *     ConcertsListResponse:
 *       description: Concerts list operation response
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConcertsListResponse'
 *     ErrorResponse:
 *       description: Error response
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /concerts:
 *   post:
 *     summary: Create a new concert
 *     tags:
 *       - concerts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConcertInput'
 *     responses:
 *       '201':
 *         description: Concert created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConcertResponse'
 *       '400':
 *         description: Invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /concerts/getall:
 *   get:
 *     summary: Get all concerts
 *     tags:
 *       - concerts
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConcertsListResponse'
 *       '400':
 *         description: Error in fetching concerts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /concerts/{id}:
 *   get:
 *     summary: Get a concert by ID
 *     tags:
 *       - concerts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the concert to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: concert found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConcertsListResponse'
 *       '404':
 *         description: concert not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '400':
 *         description: Error in fetching concert
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /concerts/{id}:
 *   put:
 *     summary: Update a concert n by ID
 *     tags:
 *       - concerts
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
 *             $ref: '#/components/schemas/ConcertInput'
 *     responses:
 *       '200':
 *         description: concert updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConcertsListResponse'
 *       '404':
 *         description: Concert not found
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

/**
 * @swagger
 * /concerts/{id}:
 *   delete:
 *     summary: Delete a concert by ID
 *     tags:
 *       - concerts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the concert to delete
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConcertInput'
 *     responses:
 *       '200':
 *         description: concert deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConcertsListResponse'
 *       '404':
 *         description: Concert not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '400':
 *         description: Error in deleting concert
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /concerts/seuils:
 *   post:
 *     summary: Set Seuils absence for concerts
 *     tags:
 *       - concerts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               seuilNomination:
 *                 type: number
 *               seuilElimination:
 *                 type: number
 *             required:
 *               - seuilNomination
 *               - seuilElimination
 *     responses:
 *       '200':
 *         description: Seuils set successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConcertsListResponse'
 *       '400':
 *         description: Error in setting Seuils
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/ErrorResponse'
 */

/**
 * @swagger
 * /concerts/addConcertExcel/{id}:
 *   post:
 *     summary: Add concert data from Excel file
 *     tags:
 *       - concerts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the concert to add a program
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               excelFile:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: Concert data added successfully
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/ConcertsListResponse'
 *       '400':
 *         description: Error in adding concert data from Excel
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/ErrorResponse'
 */

router.post(
  "/addConcertExcel",
  upload.single("excelFile"),
  concertController.addConcertExcel
);

// Ajouter placement sur scéne
router.get(
  "/postplacement/:id",
  auth.loggedMiddleware3,
  auth.isAdmin,
  concertController.ajoutplacement
);
/**
 * @swagger
 * /concerts/postplacement/{id}:
 *   get:
 *     summary: Add placement for a concert.
 *     description: Add placement details for a specific concert.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the concert for which placement is being added.
 *     responses:
 *       200:
 *         description: Successful response with placement details.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Placement added successfully.
 *       400:
 *         description: Bad request. Invalid input or missing parameters.
 *       404:
 *         description: Concert not found.
 *       500:
 *         description: Internal server error.
 */

RouterConcert.get("/", concertController.StatistiqueAbsenceConcert);

module.exports = router;
