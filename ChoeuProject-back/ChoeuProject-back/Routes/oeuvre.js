const express= require("express")
const router = express.Router()
const OeuvreController = require("../Controllers/oeuvre")

const  loggedMiddleware  = require("../middelwares/logmiddelware")


// tasks est un variable bach n7ot fih liste

router.get("/getAll",loggedMiddleware.loggedMiddleware,loggedMiddleware.isAdmin,OeuvreController.fetchoeuvre)

/**
 * @swagger
 * /api/Oeuv/getAll:
 *   get:
 *     summary: Get all oeuvres
 *     tags:
 *       - oeuvres
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OeuvresListResponse'
 *       '400':
 *         description: Error in fetching compsiteur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
 


/**
 * @swagger
 * components:
 *   schemas:
 *     OeuvreInput:
 *       type: object
 *       properties:
 *         titre:
 *           type: string
 *         anneeComposition:
 *           type: number
 *         genre:
 *           type: string
 *         paroles:
 *           type: string
 *         partition:
 *           type: string
 *         parties:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               titrePartie:
 *                 type: string
 *               chœur:
 *                 type: boolean
 *               pupitres:
 *                 type: array
 *                 items:
 *                   type: string
 *         arrangeur:
 *           type: string
 *           format: uuid
 *         compositeur:
 *           type: string
 *           format: uuid
 *         user:
 *           type: string
 *           format: uuid
 *         saison:
 *           type: number
 *
 *     OeuvreResponse:
 *       type: object
 *       properties:
 *         model:
 *           $ref: '#/components/schemas/OeuvreInput'
 *         message:
 *           type: string
 *
 *     OeuvresListResponse:
 *       type: object
 *       properties:
 *         Oeuvres:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OeuvreResponse'
 *
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *         message:
 *           type: string
 */

router.post("/AddOeuvre",loggedMiddleware.loggedMiddleware,loggedMiddleware.isAdmin, OeuvreController.postoeuvre)

/**
 * @swagger
 * /api/Oeuv/AddOeuvre:
 *   post:
 *     summary: Create a new oeuvre
 *     tags:
 *       - oeuvres
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OeuvreInput'
 *     responses:
 *       '201':
 *         description: Oeuvres created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OeuvreResponse'
 *       '400':
 *         description: Invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

router.get("/:id",loggedMiddleware.loggedMiddleware,loggedMiddleware.isAdmin,OeuvreController.fetchById)
router.put("/UpdateOeuv/:id",loggedMiddleware.loggedMiddleware,loggedMiddleware.isAdmin,OeuvreController.updateoeuv)
router.delete("/DeleteOeuv/:id",loggedMiddleware.loggedMiddleware,loggedMiddleware.isAdmin,OeuvreController.deleteoeuvre)

/**
 * @swagger
 * /api/Oeuv/UpdateOeuv/{id}:
 *   put:
 *     summary: Update an oeuvre by ID
 *     tags:
 *       - oeuvres
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the oeuvre to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OeuvreInput'
 *     responses:
 *       '200':
 *         description: oeuvres updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OeuvreResponse'
 *       '404':
 *         description: oeuvres not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '400':
 *         description: Error in updating oeuvre
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/Oeuv/DeleteOeuv/{id}:
 *   delete:
 *     summary: Delete an oeuvre by ID
 *     tags:
 *       - oeuvres
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the oeuvre to delete
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: oeuvre deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: oeuvre deleted successfully
 *       '404':
 *         description: oeuvre not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '400':
 *         description: Error in deleting oeuvre
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/Oeuv/{id}:
 *   get:
 *     summary: Get an oeuvre by ID
 *     tags:
 *       - oeuvres
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the oeuvre to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: oeuvre found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OeuvreResponse'
 *       '404':
 *         description: oeuvre not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '400':
 *         description: Error in fetching oeuvre
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
module.exports = router