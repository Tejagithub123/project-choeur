const nodemailer = require("nodemailer");

const user = "mariemmhiri82@gmail.com"; // hedhi t7ot feha l email 
const pass = "izcm jpry ncke ifqn"; // houni lazmek ta3mel generation lel code hedha gmail apps 

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: user,
    pass: pass,
  },
});

const mailOptions = {
    from: 'votre_adresse_email@gmail.com',
    to: 'adresse_email_destinataire@gmail.com',
    subject: 'Objet de l\'email',
    text: 'Contenu de l\'email'
};

module.exports.sendConfirmationEmail = async (
    nom, prenom, email,
    //confirmationCode,
  ) => {
    console.log("Email en train de s'envoyer...");
  
    try {
      // transport houwa jesr from chkoun to amal  html body message chnouwa f wostou
      await transport.sendMail({
        from: "mariemmhiri82@gmail.com",
        to: email,
        subject: "Veuillez activer votre compte ",
        html: `q
        <div>
          <h1>Activation du compte </h1>
          <h2>Bonjour ${nom}</h2>
          <p>Veuillez confirmer votre email en cliquant sur le lien suivant</p>
         <a href=http://localhost:3000/api/Condidat/ConfirmMail2/${email}>
          Confirmer l'email</a>
          <ul>+--
            <li> Votre nom d'utilisateur ${nom}  </li>
          </ul>
        </div>
      `,
      });
  
      console.log("Email envoyé avec succès !");
      return "env"; // Retourne "env" si l'email est envoyé avec succès
    } catch (err) {
      console.error("Erreur lors de l'envoi de l'email :", err);
      return err.message; // Retourne le message d'erreur en cas d'échec
    }
  };
  module.exports.sendAuditionEmail = async (
    nom, prenom, email,
    //confirmationCode,
  ) => {
    console.log("Email en train de s'envoyer...");
  
    try {
      // transport houwa jesr from chkoun to amal  html body message chnouwa f wostou
      await transport.sendMail({
        from: "mariemmhiri82@gmail.com",
        to: email,
        subject: "Audition ",
        html: `
        <div>
          <h1>Bientot une nouvelle audition  </h1>
          <h2>Bonjour ${nom}</h2>
          <p>Veuillez romplir le formulaire pour assister a l'audition  en cliquant sur le lien suivant</p>
         <a href=http://localhost:3000/api/Condidat/ConfirmMail2/${email}>
          Clique ici</a>
          <ul>+--
            <li> Votre nom d'utilisateur ${nom}  </li>
          </ul>
        </div>
      `,
      });
  
      console.log("Email envoyé avec succès !");
      return "env"; // Retourne "env" si l'email est envoyé avec succès
    } catch (err) {
      console.error("Erreur lors de l'envoi de l'email :", err);
      return err.message; // Retourne le message d'erreur en cas d'échec
    }
  };

  module.exports.sendUpdateRepetitionEmail = async (
    nom, prenom, email,lieu
    //confirmationCode,
  ) => {
    console.log("Email en train de s'envoyer...");
  
    try {
      // transport houwa jesr from chkoun to amal  html body message chnouwa f wostou
      await transport.sendMail({
        from: "mariemmhiri82@gmail.com",
        to: email,
        subject: "Information Urgante ",
        html: `q
        <div>
          <h1>Activation du compte </h1>
          <h2>Bonjour ${nom}</h2>
          <p>Le lieu de concert est changé le nouveau est : ${lieu} , faitte attention </p>
         
          <ul>+--
            <li> Votre nom d'utilisateur ${nom}  </li>
          </ul>
        </div>
      `,
      });
  
      console.log("Email envoyé avec succès !");
      return email; // Retourne "env" si l'email est envoyé avec succès
    } catch (err) {
      console.error("Erreur lors de l'envoi de l'email :", err);
      return err.message; // Retourne le message d'erreur en cas d'échec
    }
  };