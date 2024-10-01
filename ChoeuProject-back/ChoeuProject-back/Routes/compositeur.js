const express= require("express")
const router = express.Router()
const CompositeurController = require("../Controllers/compositeur")

const  loggedMiddleware  = require("../middelwares/logmiddelware")
// tasks est un variable bach n7ot fih liste

router.get("/getAll",loggedMiddleware.loggedMiddleware,loggedMiddleware.isAdmin,CompositeurController.fetchcompositeur)

/**
 * @swagger
 * /api/Comp/getall:
 *   get:
 *     summary: Get all compsiteurs
 *     tags:
 *       - compsiteurs
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompositeursListResponse'
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
 *     CompositeurInput:
 *       type: object
 *       properties:
 *         nom:
 *           type: string
 *         prenom:
 *           type: string
 *     CompositeurResponse:
 *       type: object
 *       properties:
 *         model:
 *           $ref: '#/components/schemas/CompositeurInput'
 *         message:
 *           type: string
 *
 *     CompositeursListResponse:
 *       type: object
 *       properties:
 *         Compositeurs:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CompositeurResponse'
 *
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *         message:
 *           type: string
 */
router.post("/Addcompositeur",loggedMiddleware.loggedMiddleware,loggedMiddleware.isAdmin, CompositeurController.addcompositeur)

/**
 * @swagger
 * /api/Comp/Addcompositeur:
 *   post:
 *     summary: Create a new compositeur
 *     tags:
 *       - compsiteurs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompositeurInput'
 *     responses:
 *       '201':
 *         description: compsiteur created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompositeurResponse'
 *       '400':
 *         description: Invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id",loggedMiddleware.loggedMiddleware,loggedMiddleware.isAdmin,CompositeurController.fetchById)
/**
 * @swagger
 * /api/Comp/{id}:
 *   get:
 *     summary: Get an compositeur by ID
 *     tags:
 *       - compsiteurs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the compsiteur to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: compsiteur found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompositeurResponse'
 *       '404':
 *         description: compsiteur not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '400':
 *         description: Error in fetching compsiteur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */


router.put("/Updatecomp/:id",loggedMiddleware.loggedMiddleware,loggedMiddleware.isAdmin,CompositeurController.updatecompositeur)
router.delete("/Deletecomp/:id",loggedMiddleware.loggedMiddleware,loggedMiddleware.isAdmin,CompositeurController.deletecompositeur)

/**
 * @swagger
 * /api/Comp/Updatecomp/{id}:
 *   put:
 *     summary: Update an compsiteur by ID
 *     tags:
 *       - compsiteurs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the compsiteur to update
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
 *         description: compsiteur updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompositeurResponse'
 *       '404':
 *         description: compsiteur not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '400':
 *         description: Error in updating compsiteur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/Comp/Deletecomp/{id}:
 *   delete:
 *     summary: Delete an compsiteur by ID
 *     tags:
 *       - compsiteurs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the compsiteur to delete
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: compsiteur deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: compsiteur deleted successfully
 *       '404':
 *         description: compsiteur not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '400':
 *         description: Error in deleting compsiteur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

module.exports = router