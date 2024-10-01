const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const CondidatController = require("../Controllers/condidat");
const Confirm = require("../middelwares/confirmation");
const loggedMiddleware = require("../middelwares/logmiddelware");

// @ts-ignore

const Audition = require("../Models/audition");
// tasks est un variable bach n7ot fih liste
// @ts-ignore

const Condidat = require("../Models/condidat");

const nodemailer = require("nodemailer");
const auth = require("../middelwares/auth");

router.put(
  "/SaveCondidat/:email",
  Confirm.checkEmailConfirmation,
  CondidatController.SaveCondidature
);

router.patch("/ConfirmMail/:email", CondidatController.updateConfirmEmail);

//traiter le click dans la boite mail pour valider l'emai
router.get("/ConfirmMail2/:email", CondidatController.updateConfirmEmail),
  /**
   * @swagger
   * /api/Condidat/ConfirmMail2/{email}:
   *   get:
   *     summary: Update confirmation status of email
   *     tags:
   *       - condidats
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: email
   *         required: true
   *         description: Email address to confirm
   *         schema:
   *           type: string
   *           format: email
   *     responses:
   *       '200':
   *         description: Successful email confirmation
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CondidatResponse'
   *       '400':
   *         description: Error confirming email
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       '404':
   *         description: Email not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *               example:
   *                 message: Object non trouvé
   */

  //créer un évènement de lancement d'audition et envoyer un email
  router.get(
    "/lanceAudition",
    loggedMiddleware.loggedMiddleware,
    loggedMiddleware.isAdmin,
    CondidatController.getCondidatByConfirm
  ),
  /**
   * @swagger
   * /api/Condidat/lanceAudition:
   *   get:
   *     summary: Send audition emails to confirmed condidats
   *     tags:
   *       - condidats
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       '200':
   *         description: Audition emails sent successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CondidatsListResponse'
   *       '500':
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */

  // ajouter un condidat
  router.post("/addcondidat", CondidatController.add_Condidat2);

/// condidats par pupitre
/*router.get('/condidatsByTessitureVocale/:tessitureVocale', async (req, res) => {
    try {
      const { tessitureVocale } = req.params;
  
      const candidates = await CondidatController.getCandidatesByTessitureVocale(tessitureVocale);
  
      res.status(200).json({ success: true, candidates });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  });
*/
// decison et evaluation et proucentage
router.get(
  "/condidatsByTessitureVocale/:tessitureVocale/:percentage",
  async (req, res) => {
    try {
      const { tessitureVocale, percentage } = req.params;

      // Ensure percentage is a valid number between 0 and 100
      const parsedPercentage = parseFloat(percentage);
      if (
        isNaN(parsedPercentage) ||
        parsedPercentage < 0 ||
        parsedPercentage > 100
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid percentage value." });
      }

      const candidates =
        await CondidatController.getCandidatesByTessitureVocale(
          tessitureVocale,
          parsedPercentage
        );

      res.status(200).json({ success: true, candidates });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
);
//
router.get("/getAll", CondidatController.fetchcondidats);

router.post("/VerifMail2", CondidatController.add_Condidat);

/**
 * @swagger
 * /api/Condidat/VerifMail2:
 *   post:
 *     summary: Create a new condidat
 *     tags:
 *       - condidats
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Condidat2Input'
 *     responses:
 *       '201':
 *         description: condidat created successfully
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

// decison et  avec le nombre
router.get("/condidatsBypupitre/:tessitureVocale/:nombre", async (req, res) => {
  try {
    const { tessitureVocale, nombre } = req.params;

    // Ensure nombre is a valid positive integer
    const parsedNombre = parseInt(nombre);
    if (isNaN(parsedNombre) || parsedNombre <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid nombre value." });
    }

    const candidates = await CondidatController.getCandidatesBypupitre(
      tessitureVocale,
      parsedNombre
    );

    res.status(200).json({ success: true, candidates });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ca tache 1 étudiant 4
//decision et avec nombre mais
router.get(
  "/condidatsByTessitureVocalenombre/:tessitureVocale/:nombre",
  auth.loggedMiddleware3,
  auth.ischoriste_admin,
  async (req, res) => {
    try {
      const { tessitureVocale, nombre } = req.params;

      // Ensure nombre is a valid positive integer
      const parsedNombre = parseInt(nombre);
      if (isNaN(parsedNombre) || parsedNombre <= 0) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid nombre value." });
      }

      const result = await CondidatController.getCandidatesBypupitreavecnombre(
        tessitureVocale,
        parsedNombre
      );

      res.status(200).json({ success: true, ...result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
);

/**
 * @swagger
 * /api/Condidat/condidatsByTessitureVocalenombre/{tessitureVocale}/{nombre}:
 *   get:
 *     summary: Get candidates by tessiture vocale and number.
 *     description: Retrieve candidates based on the provided tessiture vocale and a required number.
 *     parameters:
 *       - in: path
 *         name: tessitureVocale
 *         schema:
 *           type: string
 *         required: true
 *         description: The tessiture vocale to filter candidates.
 *       - in: path
 *         name: nombre
 *         schema:
 *           type: integer
 *         required: true
 *         description: The required number of candidates.
 *     responses:
 *       200:
 *         description: Successful response with candidates.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               candidates: [{ _id: '123', nom: 'John', prenom: 'Doe' }, { _id: '456', nom: 'Jane', prenom: 'Doe' }]
 *       400:
 *         description: Bad request. Invalid input or missing parameters.
 *       404:
 *         description: No candidates found for the given tessiture vocale and number.
 *       500:
 *         description: Internal server error.
 */

// ajouter un condidat
router.get("/getCondidatById/:id", CondidatController.getCondidatById);

/*const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
      user: "trikiasma31@gmail.com",
      pass: "dsat mufr ydmc dxao",
  },
  tls: {
      rejectUnauthorized: false,
  },
});
*/
/*const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
      user: "mariemmhiri82@gmail.com",
      pass: "izcm jpry ncke ifqn",
  },
  tls: {
      rejectUnauthorized: false,
  },
});*/

router.get("/getAllcondidat", async (req, res) => {
  try {
    const spo = req.body.sop;
    const alt = req.body.alt;
    const ten = req.body.ten;
    const bas = req.body.bas;
    let tab = [];

    let Sopo = [];
    let Tero = [];
    let bass = [];
    let alto = [];

    const Soprano = await Audition.find({
      tessitureVocale: "Soprano",
      décision: "retenu",
    });
    Soprano.map(async (elem) => {
      console.log(elem._id);
      const condidat = await Condidat.findOne({ audition: elem._id.toString });
      Sopo.push(condidat);
    });

    const Alto = await Audition.find({
      tessitureVocale: "Alto",
      décision: "retenu",
    });
    Alto.map(async (elem) => {
      console.log(elem._id);
      const condidat = await Condidat.findOne({ audition: elem._id.toString });
      alto.push(condidat);
    });

    const Tenor = await Audition.find({
      tessitureVocale: "Tenor",
      décision: "retenu",
    });
    Tenor.map(async (elem) => {
      console.log(elem._id);
      const condidat = await Condidat.findOne({ audition: elem._id.toString });
      Tero.push(condidat);
    });
    const Basse = await Audition.find({
      tessitureVocale: "Basse",
      décision: "retenu",
    });
    Basse.map(async (elem) => {
      console.log(elem._id);
      const condidat = await Condidat.findOne({ audition: elem._id.toString });
      bass.push(condidat);
    });
    for (let i = 0; i < spo; i++) {
      tab.push(Sopo[i]);
    }
    for (let i = 0; i < alt; i++) {
      tab.push(alto[i]);
    }
    for (let i = 0; i < ten; i++) {
      tab.push(bass[i]);
    }
    for (let i = 0; i < bas; i++) {
      tab.push(Tero[i]);
    }
    tab.map((elem) => {
      transporter.sendMail(
        {
          from: "assma ",
          to: elem.email,
          subject: "confirmation de retenu",
          html: `Bonjour ${elem.nom}  ${elem.prenom}  votre deamnde a ete retenu depui notre equipe vous étes les bienvenu`,
        },
        (err, info) => {
          if (err) {
            console.log(err);
            return res.status(400).json({
              message: {
                error: err,
              },
            });
          }
          console.log(info);
        }
      );
    });

    res.status(200).json(tab);
  } catch (error) {
    console.log(error);
  }
});

// tache 2 etudiant 4
//router.get("/gettache2", CondidatController.getCandidaR)

router.post(
  "/gettache2",
  auth.loggedMiddleware3,
  auth.ischoriste_admin,
  CondidatController.getCandidaR
);

/**
 * @swagger
 * /api/Condidat/gettache2:
 *   post:
 *     summary: Get candidates based on specified criteria.
 *     description: Provide criteria in the request body. Parameters sop, alt, ten, bas should be included in the request body.
 *     tags: [Tache2Etudiant4]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sop:
 *                 type: integer
 *               alt:
 *                 type: integer
 *               ten:
 *                 type: integer
 *               bas:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Successful response with candidates.
 *         content:
 *           application/json:
 *             example:
 *               - // your example data here
 *       '400':
 *         description: Bad request. Invalid input or missing parameters.
 *       '404':
 *         description: No candidates found for the given criteria.
 *       '500':
 *         description: Internal server error.
 */

router.get(
  "/confirmation/:token",
  auth.loggedMiddleware3,
  auth.ischoriste_admin,
  CondidatController.confirmation
);

/**
 * @swagger
 * /api/Condidat/confirmation/{token}:
 *   get:
 *     summary: Confirm user registration.
 *     tags: [Confirmation]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: The confirmation token received via email.
 *     responses:
 *       '200':
 *         description: User registration confirmed successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Registration confirmed successfully.
 *       '400':
 *         description: Bad request. Invalid token or expired.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Invalid token or token expired.
 *       '404':
 *         description: Token not found or user not registered.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Token not found or user not registered.
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Internal Server Error.
 */

module.exports = router;
