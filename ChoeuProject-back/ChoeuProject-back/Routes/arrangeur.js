const express= require("express")
const router = express.Router()
const ArrangeurController = require("../Controllers/arrangeur")
const  loggedMiddleware  = require("../middelwares/logmiddelware")
// tasks est un variable bach n7ot fih liste

router.get("/getAll",loggedMiddleware.loggedMiddleware,loggedMiddleware.isAdmin,ArrangeurController.fetcharrangeur)
/**
 * @swagger
 * /api/Arrg/getAll:
 *   get:
 *     summary: Get all arrangeur
 *     tags:
 *       - arrangeurs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication. Please use "Bearer YOUR_TOKEN"
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ArrangeursListResponse'
 *       403:
 *         description: Forbidden. User does not have the role of choriste.
 *       401:
 *         description: Token invalide ou expiré
 *       '400':
 *         description: Error in fetching arrangeur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     ArrangeurInput:
 *       type: object
 *       properties:
 *         nom:
 *           type: string
 *         prenom:
 *           type: string
 *
 *     ArrangeurResponse:
 *       type: object
 *       properties:
 *         model:
 *           $ref: '#/components/schemas/ArrangeurInput'
 *         message:
 *           type: string
 *
 *     ArrangeursListResponse:
 *       type: object
 *       properties:
 *         Arrangeurs:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ArrangeurResponse'
 *
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *         message:
 *           type: string
 */

router.post("/Addarrangeur",loggedMiddleware.loggedMiddleware,loggedMiddleware.isAdmin, ArrangeurController.addArrang)

/**
 * @swagger
 * /api/Arrg/Addarrangeur:
 *   post:
 *     summary: Create a new arrangeur
 *     tags:
 *       - arrangeurs
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArrangeurInput'
 *     responses:
 *       '201':
 *         description: Arrangeurs created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ArrangeurResponse'
 *       '400':
 *         description: Invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id",loggedMiddleware.loggedMiddleware,loggedMiddleware.isAdmin,ArrangeurController.fetchById)
router.put("/UpdateArrg/:id",loggedMiddleware.loggedMiddleware,loggedMiddleware.isAdmin,ArrangeurController.updateArr)
router.delete("/DeleteArrg/:id",loggedMiddleware.loggedMiddleware,loggedMiddleware.isAdmin,ArrangeurController.deleteArrangeur)
/**
 * @swagger
 * /api/Arrg/UpdateArrg/{id}:
 *   put:
 *     summary: Update an arrangeur by ID
 *     tags:
 *       - arrangeurs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the arrangeur to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompositeurInput'
 *     responses:
 *       '200':
 *         description: arrangeurs updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ArrangeurResponse'
 *       '404':
 *         description: arrangeurs not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '400':
 *         description: Error in updating arrangeur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/Arrg/DeleteArrg/{id}:
 *   delete:
 *     summary: Delete an arrangeur by ID
 *     tags:
 *       - arrangeurs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the arrangeur to delete
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: arrangeur deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: arrangeur deleted successfully
 *       '404':
 *         description: arrangeur not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '400':
 *         description: Error in deleting arrangeur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/Arrg/{id}:
 *   get:
 *     summary: Get an arrangeur by ID
 *     tags:
 *       - arrangeurs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the arrangeur to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: arrangeur found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ArrangeurResponse'
 *       '404':
 *         description: arrangeur not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '400':
 *         description: Error in fetching arrangeur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

module.exports = router