const express = require('express');
const router = express.Router();

const concertController=require('../Controllers/concertcontroller')

const auth=require('../middelwares/auth')

/**        
 * @swagger
 * tags:
 *   name: Absences
 *   description: API for managing absences
 */

router.get('/stat' ,auth.isAdmiin , auth.loggedMiddleware,  concertController.StatistiqueAbsenceConcert)
/**
 * @swagger
 * /api/concert:
 *   get:
 *     summary: Statistiques des absences/presences par concert
 *     description: Retrieve statistics for attendance and absence based on concerts.
 *     responses:
 *       200:
 *         description: Successful response with attendance and absence statistics for concerts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   concert:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: ID of the concert.
 *                       date:
 *                         type: string
 *                         description: Date of the concert.
 *                       lieu:
 *                         type: string
 *                         description: Location of the concert.
 *                   totalPresence:
 *                     type: integer
 *                     description: Total number of attendees in the concert.
 *                   totalAbsence:
 *                     type: integer
 *                     description: Total number of absences in the concert.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */



//router.get('/:oeuvreId' ,  concertController.countAbsencesPresences)


module.exports = router;



