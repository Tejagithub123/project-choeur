const condidat = require("../Models/condidat");
const audition = require("../Models/audition");
const validator = require("validator");
const nodemailer = require("nodemailer");
const nodemailer2 = require("../utils/nodemailer");
const bcrypt = require("bcrypt");
const path = require("path");
const secretKey = "your-secret-key";
const jwt = require("jsonwebtoken");

const Utilisateur = require("../Models/Utilisateur");
const generator = require("generate-password");

//aziz
const fetchcondidats = async (req, res) => {
  try {
    const populatedCondidats = await condidat
      .find()
      .populate({ path: "auditions" })
      .exec();
    // console.log(populatedCondidats);
    res.status(200).json({
      model: populatedCondidats,
      message: "success",
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "probleme d'extraction",
    });
  }
};

const addcondidat = (req, res) => {
  const { nom, prenom, email } = req.body;

  // Vérifier la validité de l'email
  if (!validator.isEmail(email)) {
    return res.status(400).json({
      message: "Adresse email invalide",
    });
  }
  // Validation des données
  if (!nom || !prenom) {
    return res.status(400).json({
      message: "Données invalides",
    });
  }

  // Envoi de l'email de validation
  const transporter = nodemailer.createTransport({
    // Configurations de transport email (SMTP, OAuth, etc.)

    host: "mariemmhiri82@gmail.com",
    secureConnection: false,
    port: 587,
    tls: {
      ciphers: "SSLv3",
    },
    auth: {
      user: "mariemmhiri82@gmail.com",
      pass: "tunis2019",
    },
  });

  const mailOptions = {
    from: "mariemmhiri82@gmail.com",
    to: email,
    subject: "Validation d'email",
    text: "Cliquez sur le lien suivant pour valider votre email : http://votre-site/valider-email",
  };
  transporter.sendMail(mailOptions, (error, info) => {
    console.log("email", mailOptions);
    if (error) {
      return res
        .status(500)
        .json({ message: "Erreur lors de l'envoi de l'email de validation" });
    }
    /*else {
       return res.send( 'email sent  ')     
    }*/

    // Enregistrement du nouveau candidat
    const newcondidat = new condidat({ nom, prenom, email });
    newcondidat
      .save()
      .then(() => {
        res.status(201).json({
          model: newcondidat,
          message: "Objet créé ! Email de validation envoyé avec succès.",
        });
      })
      .catch((saveError) => {
        res.status(400).json({
          error: saveError.message,
          message: "Erreur lors de l'enregistrement du candidat",
        });
      });
  });
};

const updateConfirmEmail = (req, res) => {
  condidat
    .findOneAndUpdate(
      { email: req.params.email },
      { ConfirmedEmail: true },
      { new: true }
    )
    .then((cond) => {
      if (!cond) {
        return res.status(404).json({
          message: "Object non trouvé",
        });
      }
      res.status(200).json({
        model: cond,
        message: "Email confirmé avec succès ",
      });
    })
    .catch((error) => {
      res.status(400).json({
        message: "Erreur lors de la confirmation de l'email",
      });
    });
};

const add_Condidat = async (req, res) => {
  const { nom, prenom, email } = req.body;

  console.log(req.body);
  try {
    const newcondidat = new condidat({ nom, prenom, email });
    const savedUser = await newcondidat.save();

    res.status(201).json({
      model: savedUser,
      message: "Objet créé !",
    });
    //nodemailer yab3th des emails automatiq
    nodemailer2.sendConfirmationEmail(
      savedUser.nom,
      savedUser.prenom,
      savedUser.email
      // savedUser.activationCode,
    );
  } catch (e) {
    console.log(e);
    res.send({ error: e.message });
  }
};
/*
const confirm_clic = async (req,res) => {
  const mail = req.params.email;

  try {
    // Mettez en œuvre votre logique pour marquer l'email comme confirmé dans la base de données
    // Vous pouvez utiliser le prénom pour retrouver le candidat dans la base de données
    const candidat = await condidat.findOneAndUpdate({ mail }, { ConfirmedEmail: true });

    if (!candidat) {
      return res.status(404).json({ error: 'Candidat non trouvé.' });
    }

    res.status(200).json({ 
      model:candidat,
      message: 'Email confirmé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la confirmation de l\'email :', error);
    res.status(500).json({ error: 'Erreur lors de la confirmation de l\'email.' });
  }
};*/

const SaveCondidature = (req, res) => {
  condidat
    .findOneAndUpdate({ email: req.params.email }, req.body, { new: true })
    .then((cond) => {
      if (!cond) {
        return res.status(404).json({
          message: "Object non trouvé",
        });
      }
      res.status(200).json({
        model: cond,
        message: "Object modifié",
      });
    })
    .catch((error) => {
      res.status(400).json({
        message: "Données invalides",
      });
    });
};

const add_Condidat2 = (req, res) => {
  const Condidat = new condidat(req.body); // Use 'Condidat' here
  Condidat.save()
    .then((resultat) => {
      res.status(201).json({
        model: resultat,
        message: "Le condidat a bien été créé.",
      });
    })
    .catch((err) => {
      res.status(400).json({ err: err.message });
    });
};

//lance audition
const getCondidatByConfirm = (req, res) => {
  condidat
    .find({ ConfirmedEmail: true })
    .then((cond) => {
      console.log("cond", cond);
      if (!cond) {
        throw new Error("condidat non trouvé ");
      }

      // Récupérez tous les choristes avec le même pupitre
      return condidat.find({ ConfirmedEmail: true });
    })
    .then((choristes) => {
      // Filtrez les choristes ayant la même tessiture que le pupitre si nécessaire
      // const choristesAvecMemeTessiture = choristes.filter(choriste => choriste.tessitureVocale === pupitre.nom);
      choristes.forEach((choriste) => {
        nodemailer2.sendAuditionEmail(
          choriste.nom,
          choriste.prenom,
          choriste.email
          // savedUser.activationCode,
        );
      });
      res.status(200).json(choristes);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
};

// get by id
const getCondidatById = async (req, res) => {
  const condidatId = req.params.id;

  try {
    const Condidat = await condidat
      .findById(condidatId)
      .populate("auditions")
      .exec();

    if (!Condidat) {
      return res.status(404).json({
        success: false,
        message: "Condidat not found.",
      });
    }

    res.status(200).json({
      success: true,
      model: Condidat,
      message: "Condidat retrieved successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

/*
const getCandidatesByTessitureVocale = async (tessitureVocale) => {
  try {
    if (!['Soprano', 'Alto', 'Tenor', 'Basse'].includes(tessitureVocale)) {
      throw new Error('Invalid tessitureVocale.');
    }

    const candidates = await condidat
      .find({ 'auditions': { $exists: true, $ne: [] } })
      .populate({
        path: 'auditions',
        match: { 'tessitureVocale': tessitureVocale }
      })
      .exec();

    console.log('Candidates:', candidates);

    const filteredCandidates = candidates.filter(candidate => candidate.auditions.length > 0);

    return filteredCandidates;
  } catch (error) {
    throw error;
  }
};
*/
/*
const getCandidatesByTessitureVocale = async (tessitureVocale) => {
  try {
    if (!['Soprano', 'Alto', 'Tenor', 'Basse'].includes(tessitureVocale)) {
      throw new Error('Invalid tessitureVocale.');
    }

    const candidates = await condidat
      .find({ 'auditions': { $exists: true, $ne: [] } })
      .populate({
        path: 'auditions',
        match: { 'tessitureVocale': tessitureVocale }
      })
      .exec();

    // Filter out candidates with null or empty auditions
    const filteredCandidates = candidates.filter(candidate => candidate.auditions.length > 0);

    // Sort the candidates based on appreciation and décision
    const sortedCandidates = filteredCandidates.sort((a, b) => {
      // Order by décision: retenu > en attente > refuser
      const decisionOrder = { 'retenu': 1, 'en attente': 2, 'refuser': 3 };
      const decisionA = decisionOrder[a.auditions[0].décision];
      const decisionB = decisionOrder[b.auditions[0].décision];
      
      if (decisionA !== decisionB) {
        return decisionA - decisionB;
      }

      // Order by appreciation: A > B > C
      const appreciationOrder = { 'A': 1, 'B': 2, 'C': 3 };
      const appreciationA = appreciationOrder[a.auditions[0].appreciation];
      const appreciationB = appreciationOrder[b.auditions[0].appreciation];

      return appreciationA - appreciationB;
    });

    console.log('Sorted Candidates:', sortedCandidates);

    return sortedCandidates;
  } catch (error) {
    throw error;
  }
};
*/

/*
const getCandidatesByTessitureVocale = async (tessitureVocale) => {
  try {
    if (!['Soprano', 'Alto', 'Tenor', 'Basse'].includes(tessitureVocale)) {
      throw new Error('Invalid tessitureVocale.');
    }

    const candidates = await condidat
      .find({ 'auditions': { $exists: true, $ne: [] } })
      .populate({
        path: 'auditions',
        match: { 'tessitureVocale': tessitureVocale }
      })
      .exec();

    // Filter out candidates with null or empty auditions
    const filteredCandidates = candidates.filter(candidate => candidate.auditions.length > 0);

    // Sort the candidates based on décision and appreciation
    const sortedCandidates = filteredCandidates.sort((a, b) => {
      const decisionOrder = { 'retenu': 1, 'en attente': 2, 'refuser': 3 };

      // Order by decision
      const decisionA = decisionOrder[a.auditions[0].décision];
      const decisionB = decisionOrder[b.auditions[0].décision];

      if (decisionA !== decisionB) {
        return decisionA - decisionB;
      }

      // If both decisions are the same, order by appreciation
      const appreciationOrder = { 'A': 3, 'B': 2, 'C': 1 };
      const appreciationA = appreciationOrder[a.auditions[0].appreciation];
      const appreciationB = appreciationOrder[b.auditions[0].appreciation];

      return appreciationA - appreciationB;
    });

    console.log('Sorted Candidates:', sortedCandidates);

    return sortedCandidates;
  } catch (error) {
    throw error;
  }
};
*/

// get avec pupitre évaluation et décision et proucentage
const getCandidatesByTessitureVocale = async (tessitureVocale, percentage) => {
  try {
    if (!["Soprano", "Alto", "Tenor", "Basse"].includes(tessitureVocale)) {
      throw new Error("Invalid tessitureVocale.");
    }

    const candidates = await condidat
      .find({ auditions: { $exists: true, $ne: [] } })
      .populate({
        path: "auditions",
        match: { tessitureVocale: tessitureVocale },
      })
      .exec();

    // Filter out candidates with null or empty auditions
    const filteredCandidates = candidates.filter(
      (candidate) => candidate.auditions.length > 0
    );

    // Sort the candidates based on décision and appreciation
    const sortedCandidates = filteredCandidates.sort((a, b) => {
      const decisionOrder = { retenu: 1, "en attente": 2, refuser: 3 };

      // Order by decision
      const decisionA = decisionOrder[a.auditions[0].décision];
      const decisionB = decisionOrder[b.auditions[0].décision];

      if (decisionA !== decisionB) {
        return decisionA - decisionB;
      }

      // If both decisions are the same, order by appreciation
      const appreciationOrder = { A: 3, B: 2, C: 1 };
      const appreciationA = appreciationOrder[a.auditions[0].appreciation];
      const appreciationB = appreciationOrder[b.auditions[0].appreciation];

      return appreciationA - appreciationB;
    });

    // Calculate the number of candidates to return based on the specified percentage
    const numberOfCandidates = Math.ceil(
      (percentage / 100) * sortedCandidates.length
    );

    // Return the specified percentage of candidates
    const selectedCandidates = sortedCandidates.slice(0, numberOfCandidates);

    console.log("Sorted Candidates:", selectedCandidates);

    return selectedCandidates;
  } catch (error) {
    throw error;
  }
};

// get avec pupitre  et décision et nombre
const getCandidatesBypupitre = async (tessitureVocale, numberOfCandidates) => {
  try {
    if (!["Soprano", "Alto", "Tenor", "Basse"].includes(tessitureVocale)) {
      throw new Error("Invalid tessitureVocale.");
    }

    const candidates = await condidat
      .find({ auditions: { $exists: true, $ne: [] } })
      .populate({
        path: "auditions",
        match: { tessitureVocale: tessitureVocale },
      })
      .exec();

    // Filter out candidates with null or empty auditions
    const filteredCandidates = candidates.filter(
      (candidate) => candidate.auditions.length > 0
    );

    // Sort the candidates based on décision
    const sortedCandidates = filteredCandidates.sort((a, b) => {
      const decisionOrder = { retenu: 1, "en attente": 2, refuser: 3 };

      // Order by decision
      const decisionA = decisionOrder[a.auditions[0].décision];
      const decisionB = decisionOrder[b.auditions[0].décision];

      return decisionA - decisionB;
    });

    // Return the specified number of candidates
    const selectedCandidates = sortedCandidates.slice(0, numberOfCandidates);

    console.log("Sorted Candidates:", selectedCandidates);

    return selectedCandidates;
  } catch (error) {
    throw error;
  }
};

// asma //asam hathi tache num 1 : tache1

const getCandidatesBypupitreavecnombre = async (
  tessitureVocale,
  numberOfCandidates
) => {
  try {
    if (!["Soprano", "Alto", "Tenor", "Basse"].includes(tessitureVocale)) {
      throw new Error("Invalid tessitureVocale.");
    }

    const auditions = await audition
      .find({
        tessitureVocale: tessitureVocale,
        condidat: { $exists: true, $ne: null }, // Filter out auditions without condidat
      })
      .populate("condidat")
      .exec();

    // Sort the candidates based on décision
    const sortedCandidates = auditions.sort((a, b) => {
      const decisionOrder = { retenu: 1, "en attente": 2, refuser: 3 };

      // Order by decision
      const decisionA = decisionOrder[a.décision];
      const decisionB = decisionOrder[b.décision];

      return decisionA - decisionB;
    });

    // Calculate the total number of candidates
    const totalCandidates = sortedCandidates.length;

    // Return the specified number of candidates with total at the beginning
    const selectedCandidates = [
      ...sortedCandidates.slice(0, numberOfCandidates),
    ];

    console.log("Sorted Candidates:", selectedCandidates);

    return { totalCandidates, candidates: selectedCandidates };
  } catch (error) {
    throw error;
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mariemmhiri82@gmail.com",
    pass: "izcm jpry ncke ifqn",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

/*const getCandidaR= async(req,res)=>{
  try {
 const spo=req.body.sop
 const alt=req.body.alt
 const ten=req.body.ten
 const bas=req.body.bas
  let tab=[]
      const Soprano=await audition.find({
        tessitureVocale:"Soprano",
        décision:"retenu"
      })
      .populate('condidat')
      const Alto=await audition.find({
        tessitureVocale:"Alto",
        décision:"retenu"
            })
            .populate('condidat')
         
            const Tenor=await audition.find({
              tessitureVocale:"Tenor",
              décision:"retenu"
            })
           
                  .populate('condidat')
                 
                  const Basse=await audition.find({
                    tessitureVocale:"Basse",
                    décision:"retenu"
                        })
                        .populate('condidat')
                       
  for(let i=0;i<spo;i++){
    tab.push(Soprano[i])
  }
  for(let i=0;i<alt;i++){
    tab.push(Alto[i])
  }
  for(let i=0;i<ten;i++){
    tab.push(Tenor[i])
  }
  for(let i=0;i<bas;i++){
    tab.push(Basse[i])
  }
  
  tab.map(elem=>{
  
    transporter.sendMail({
      from: "asma",
      to: elem.condidat.email,

      subject: "[ FIRST STEP DONE - Acceptation Candidature Carthage Symphony Orchestra ]",
      
      attachments: [
        {
          filename: 'logo_isaamm.jpg',
          path: path.join(__dirname, '../temp/logo_isaamm.jpg'),
          encoding: 'base64', 
          contentType: 'image/jpg',
          cid: 'unique@ocs.com',
        },
        {
          filename: 'chart.pdf',
          path: path.join(__dirname, '../temp/chart.pdf'),
          encoding: 'base64', 
          contentType: 'application/pdf',
        },
        
      ],
      html: `  <img src="cid:unique@ocs.com" width="500" height="250"><br><br><strong></strong>Cher <strong>${elem.condidat.nom} ${elem.condidat.prenom}</strong>,<br><br>
      Après avoir étudié votre candidature, nous avons le plaisir de vous informer que vous avez réussi la première étape du processus de recrutement.<br><br>
      Afin de procéder à la prochaine étape du processus, veuillez prendre un moment pour lire attentivement la charte de l'entreprise, jointe à ce courriel. Une fois que vous l'avez examinée en détail, nous vous prions de bien vouloir signer le document en bas de la page pour indiquer votre accord.<br><br>
      De plus, confirmez votre intégration en cliquant sur le lien d'acceptation indiquant votre accord.<br><br>
      Félicitations encore pour cette réussite, et nous attendons avec impatience de collaborer avec vous.<br><br>
      Cordialement,`,
      
    }, (err, info) => {
      if (err) {
          console.log(err);
          return res.status(400).json({
              message: {
                  error: err
              }
          });
      }
      console.log(info);
  });
  })


res.status(200).json(tab)
  } catch (error) {
    console.log(error);
  }} */

const password_generated = generator.generate({
  length: 10,
  numbers: true,
});

//méthode ajouter tache2
const confirmation = async (req, res) => {
  try {
    const token = req.params.token;
    const verify = jwt.verify(token, secretKey);
    console.log(verify.condidat);
    const exitaudition = await audition.findOne({ condidat: verify.condidat });
    console.log(exitaudition._id);

    if (exitaudition) {
      const updatet = {
        ConfirmedEmail: "confirmer",
        décision: "devient_choriste",
      };
      const updateaudition = await audition.findOneAndUpdate(
        { condidat: verify.condidat },
        { ...updatet },
        { new: true }
      );
    }

    const existe_condidat = await condidat.findById(verify.condidat);

    const salt = await bcrypt.genSalt(10);
    const passwords = await bcrypt.hash(password_generated, salt);

    const new_chosriste = new Utilisateur({
      nom: existe_condidat.nom,
      prenom: existe_condidat.prenom,
      email: existe_condidat.email,
      password: passwords,
      taille: existe_condidat.taille,
      //asma
      tessitureVocale: exitaudition.tessitureVocale,

      role: "choriste",
      etat: "Actif",
    });

    transporter.sendMail(
      {
        from: "asma",
        to: existe_condidat.email,

        subject:
          "[ FIRST STEP DONE - Acceptation Candidature Carthage Symphony Orchestra ]",

        html: ` cher condidat vous éte maintenant membre de notre équipe puisque vous aves confirmer .vous éte le bienvenu chez notre equipe 
      svp utilser votre email ${existe_condidat.email} et votre password ${password_generated} pour connecter dans votre compte 
      groupe de lapplication!!!!
      `,
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
    const reponse = await new_chosriste.save();

    await audition.findByIdAndUpdate(
      { _id: exitaudition._id },
      { $unset: { condidat: existe_condidat._id } }
    );

    await audition.findByIdAndUpdate(
      { _id: exitaudition._id },
      { $addToSet: { user: reponse._id } }
    );
    // await condidat.findByIdAndDelete({_id:existe_condidat._id})

    res.status(200).json({
      resultat: reponse,
      message: "le compte a éte crrer avec succes ",
    });
  } catch (e) {
    console.log(e);
  }
};

// hathi ili kant t5dem 9bel
/*const getCandidaR= async(req,res)=>{
  try {
 const spo=req.body.sop
 const alt=req.body.alt
 const ten=req.body.ten
 const bas=req.body.bas
  let tab=[]
      const Soprano=await audition.find({
        tessitureVocale:"Soprano",
        décision:"retenu",
       
      })
  .populate('condidat')
  
      if(Soprano.condidat){console.log("true");}

      const Alto=await audition.find({
        tessitureVocale:"Alto",
        décision:"retenu",
       
            })
         .populate('condidat')
            if(Alto.condidat){console.log("true");}


            const Tenor=await audition.find({
              tessitureVocale:"Tenor",
              décision:"retenu",
             
            })
           
              .populate('condidat')
                  if(Tenor.condidat){console.log("true");}


                  const Basse=await audition.find({
                    tessitureVocale:"Basse",
                    décision:"retenu",
                   
                        })
                      .populate('condidat')
    if(Basse.condidat ){console.log("true");}

  
  if(Soprano != null){                
  for(let i=0;i<spo;i++){
   if (Soprano[i] != null) tab.push(Soprano[i])
    }
  }


  if(Alto){   
  for(let i=0;i<alt;i++){
   
    if (Alto[i] != null) tab.push(Alto[i])
   } }

  
   if(Tenor){   
  for(let i=0;i<ten;i++){
   
    if (Tenor[i] != null) tab.push(Tenor[i])
   
  }
   }

  
   if(Basse){   
  for(let i=0;i<bas;i++){
   
    if (Basse[i] != null) tab.push(Basse[i])
  
  }  }
  console.log(tab);
  
 for ( let i=0 ;i<tab.length;i++){
  console.log( tab[i].condidat._id);

      if(tab[i].condidat && tab[i].envoi_email==false){
    const confirmationToken = jwt.sign({ condidat: tab[i].condidat._id }, secretKey, { expiresIn: '1d' });
   
    console.log(confirmationToken);

    transporter.sendMail({
      from: "asma",
      to: tab[i].condidat.email,

      subject: "[ FIRST STEP DONE - Acceptation Candidature Carthage Symphony Orchestra ]",
      
      attachments: [
        {
          filename: 'logo_isaamm.jpg',
          path: path.join(__dirname, '../temp/logo_isaamm.jpg'),
          encoding: 'base64', 
          contentType: 'image/jpg',
          cid: 'unique@ocs.com',
        },
        {
          filename: 'chart.pdf',
          path: path.join(__dirname, '../temp/chart.pdf'),
          encoding: 'base64', 
          contentType: 'application/pdf',
        },
        
      ],
      html: `  <img src="cid:unique@ocs.com" width="500" height="250"><br><br><strong></strong>Cher <strong>${tab[i].condidat.nom} ${tab[i].condidat.prenom}</strong>,<br><br>
      Après avoir étudié votre candidature, nous avons le plaisir de vous informer que vous avez réussi la première étape du processus de recrutement.<br><br>
      Afin de procéder à la prochaine étape du processus, veuillez prendre un moment pour lire attentivement la charte de l'entreprise, jointe à ce courriel. Une fois que vous l'avez examinée en détail, nous vous prions de bien vouloir signer le document en bas de la page pour indiquer votre accord.<br><br>
      De plus, confirmez votre intégration en cliquant sur le lien d'acceptation indiquant votre accord.<br><br>
      <a href="http://localhost:3000/${confirmationToken}">Cliquez ici pour confirmer votre e-mail</a>
      Félicitations encore pour cette réussite, et nous attendons avec impatience de collaborer avec vous.<br><br>
      Cordialement,`,
      
    }, async(err, info) => {
      if (err) {
          console.log(err);
          return res.status(400).json({
              message: {
                  error: err
              }
          });
      }
      await audition.findByIdAndUpdate({_id:tab[i]._id}, {envoi_email:true})
      console.log(info);
  });
}
}


res.status(200).json(tab)
  } catch (error) {
    console.log(error);
  }}*/

const getCandidaR = async (req, res) => {
  try {
    const spo = req.body.sop;
    const alt = req.body.alt;
    const ten = req.body.ten;
    const bas = req.body.bas;
    let tab = [];

    const fetchCandidates = async (tessitureVocale, count) => {
      const candidates = await audition
        .find({
          tessitureVocale: tessitureVocale,
          décision: "retenu",
          envoi_email: false,
        })
        .populate("condidat");

      for (let i = 0; i < Math.min(candidates.length, count); i++) {
        if (candidates[i] != null) {
          tab.push(candidates[i]);
        }
      }
    };

    await fetchCandidates("Soprano", spo);
    await fetchCandidates("Alto", alt);
    await fetchCandidates("Tenor", ten);
    await fetchCandidates("Basse", bas);

    console.log(tab);

    for (let i = 0; i < tab.length; i++) {
      if (tab[i].condidat && tab[i].envoi_email == false) {
        console.log(tab[i].condidat._id);

        if (tab[i].condidat && tab[i].envoi_email == false) {
          const confirmationToken = jwt.sign(
            { condidat: tab[i].condidat._id },
            secretKey,
            { expiresIn: "1d" }
          );

          console.log(confirmationToken);

          // Configurations du courriel
          const mailOptions = {
            from: "asma",
            to: tab[i].condidat.email,
            subject:
              "[ FIRST STEP DONE - Acceptation Candidature Carthage Symphony Orchestra ]",
            attachments: [
              {
                filename: "logo_isaamm.jpg",
                path: path.join(__dirname, "../temp/logo_isaamm.jpg"),
                encoding: "base64",
                contentType: "image/jpg",
                cid: "unique@ocs.com",
              },
              {
                filename: "charte.pdf",
                path: path.join(__dirname, "../temp/charte.pdf"),
                encoding: "base64",
                contentType: "application/pdf",
              },
            ],
            html: `  <img src="cid:unique@ocs.com" width="500" height="250"><br><br><strong></strong>Cher <strong>${tab[i].condidat.nom} ${tab[i].condidat.prenom}</strong>,<br><br>
              Après avoir évalué attentivement votre candidature, nous sommes heureux de vous annoncer que vous avez franchi avec succès la première phase du processus de recrutement.<br><br>
                Afin de procéder à la prochaine étape du processus, veuillez prendre un moment pour lire attentivement la charte de l'entreprise, jointe à ce courriel. Une fois que vous l'avez examinée en détail, nous vous prions de bien vouloir signer le document en bas de la page pour indiquer votre accord.<br><br>
                De plus, confirmez votre intégration en cliquant sur le lien d'acceptation indiquant votre accord.<br><br>
                <a href="http://localhost:3000/${confirmationToken}">Cliquez ici pour confirmer votre e-mail</a>
                Félicitations encore pour cette réussite, et nous attendons avec impatience de collaborer avec vous.<br><br>
                Cordialement,`,
          };

          // Envoi du courriel
          transporter.sendMail(mailOptions, async (err, info) => {
            if (err) {
              console.log(err);
              return res.status(400).json({
                message: { error: err },
              });
            }

            // Mise à jour de la base de données après l'envoi du courriel
            await audition.findByIdAndUpdate(
              { _id: tab[i]._id },
              { envoi_email: true }
            );

            // Rechargez la valeur de tab depuis la base de données
            tab[i] = await audition.findById(tab[i]._id).populate("condidat");

            console.log(info);
          });
        }
      }
    }

    res.status(200).json(tab);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  add_Condidat: add_Condidat,
  fetchcondidats: fetchcondidats,
  addcondidat: addcondidat,
  updateConfirmEmail: updateConfirmEmail,
  SaveCondidature: SaveCondidature,

  add_Condidat2: add_Condidat2,
  getCandidatesByTessitureVocale: getCandidatesByTessitureVocale,
  getCondidatById: getCondidatById,
  getCandidatesBypupitre: getCandidatesBypupitre,
  getCandidatesBypupitreavecnombre: getCandidatesBypupitreavecnombre,
  getCandidaR: getCandidaR,
  confirmation: confirmation,
  getCondidatByConfirm: getCondidatByConfirm,
  // confirm_clic:confirm_clic
};
