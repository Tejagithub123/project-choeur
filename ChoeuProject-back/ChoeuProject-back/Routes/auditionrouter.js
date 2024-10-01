const express = require('express');
const router = express.Router();
const auditionController = require('../Controllers/auditioncontroller');
const auth = require('../middelwares/auth')

router.post('/', auth.loggedMiddlewares,auth.isAdminOrManagerChoeur,auditionController.addAudition);


router.get('/getall', auth.loggedMiddlewares,auth.isAdminOrManagerChoeur,auditionController.getAuditions);

router.get('/:id', auth.loggedMiddlewares,auth.isAdminOrManagerChoeur,auditionController.getAudition);


router.put('/:id', auth.loggedMiddlewares,auth.isAdminOrManagerChoeur,auditionController.updateAudition);

router.delete('/:id', auth.loggedMiddlewares,auth.isAdminOrManagerChoeur,auditionController.deleteAudition);

module.exports = router; 

/**
 * @swagger
 * components:
 *   schemas:
 *     AuditionInput:
 *       type: object
 *       properties:
 *         numeroOrdre:
 *           type: number
 *         appreciation:
 *           type: string
 *           enum:
 *             - 'A'
 *             - 'B'
 *             - 'C'
 *         extraitChante:
 *           type: string
 *         remarques:
 *           type: string
 *         date:
 *           type: string
 *           format: date
 *         heure:
 *           type: string
 *           format: date-time
 *         décision:
 *           type: string
 *           enum:
 *             - 'retenu'
 *             - 'refuser'
 *             - 'en attente'
 *             - 'devient_choriste'
 *         saison:
 *           type: number
 *         ConfirmedEmail:
 *           type: string
 *           enum:
 *             - 'confirmer'
 *             - 'infirmer'
 *           default: 'infirmer'
 *         condidat:
 *           type: string
 *           format: uuid
 *         user:
 *           type: string
 *           format: uuid
 *         envoi_email:
 *           type: boolean
 *           default: false
 *
 *     AuditionResponse:
 *       type: object
 *       properties:
 *         model:
 *           $ref: '#/components/schemas/AuditionInput'
 *         message:
 *           type: string
 *
 *     AuditionsListResponse:
 *       type: object
 *       properties:
 *         auditions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AuditionResponse'
 *
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *         message:
 *           type: string
 */

/**
 * @swagger
 * /auditions:
 *   post:
 *     summary: Create a new audition
 *     tags:
 *       - auditions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuditionInput'
 *     responses:
 *       '201':
 *         description: Audition created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuditionResponse'
 *       '400':
 *         description: Invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /auditions/getall:
 *   get:
 *     summary: Get all auditions
 *     tags:
 *       - auditions
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuditionsListResponse'
 *       '400':
 *         description: Error in fetching auditions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /auditions/{id}:
 *   get:
 *     summary: Get an audition by ID
 *     tags:
 *       - auditions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the audition to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Audition found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuditionResponse'
 *       '404':
 *         description: Audition not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '400':
 *         description: Error in fetching audition
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /auditions/{id}:
 *   put:
 *     summary: Update an audition by ID
 *     tags:
 *       - auditions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the audition to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuditionInput'
 *     responses:
 *       '200':
 *         description: Audition updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuditionResponse'
 *       '404':
 *         description: Audition not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '400':
 *         description: Error in updating audition
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /auditions/{id}:
 *   delete:
 *     summary: Delete an audition by ID
 *     tags:
 *       - auditions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the audition to delete
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Audition deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: Audition deleted successfully
 *       '404':
 *         description: Audition not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '400':
 *         description: Error in deleting audition
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

