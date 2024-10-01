const express = require("express");
const mongoConnection = require("./database");
const schedule = require("node-schedule");
const cors = require("cors");
const app = express();
const http = require("http").Server(app);

//aziz
const { io } = require("./utils/socket");
const { userSocketMap } = require("./utils/socket");
///

var path = require("path");
//swagger
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
//allow

app.use(
  cors({
    origin: "http://localhost:3001",
  })
);

const RouteCompositeur = require("./Routes/compositeur");
const Arrangeurroutes = require("./Routes/arrangeur");
const Oeuvreroutes = require("./Routes/oeuvre");
const auditionRouter = require("./Routes/auditionrouter");
const Condidatroutes = require("./Routes/condidat");

const concertRouter = require("./Routes/concertrouter");
//const concertRouter= require('./Routes/concert2')
const concertRouter2 = require("./Routes/concert2");
const concertroute2 = require("./Routes/concert2");
const Routeutilisateur = require("./Routes/Utilisateur");
const socketIo = require("socket.io");

const RouterRepetition = require("./Routes/repetition");
/*const RouterPlanning = require('./Routes/planning')*/

app.use(express.json());
const moment = require("moment");
const Congee = require("./Models/conger");
const Utilisateur = require("./Models/Utilisateur");
const choriste = require("./Models/Utilisateur");
const Repetition = require("./Models/Repetition");
const qr = require("qrcode");
const CandidatRoute = require("./Routes/Candidat");

const notifie = require("./Controllers/Candidat");

//aziz
const sendNotificationMiddleware = require("./middelwares/sendNotificationMiddleware");
///

const concert = require("./Routes/concert");

const RouteUser = require("./Routes/Utilisateur");

const { userInfo } = require("os");
const auth = require("./middelwares/auth");

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.io = io;
io.listen(5000);

app.set("view engine", "html");

/*const RouterPlanning = require('./Routes/planning')*/

mongoConnection();
const conce = require("./Routes/concert");
const RouterCongee = require("./Routes/congee");
const RouterAbsences = require("./Routes/absences");
const cron = require("node-cron");

app.use(express.json());
app.use("/api", CandidatRoute);

app.use("/api", RouteUser);

app.use("/", CandidatRoute);
app.use("/", RouteUser); //choriste ou USer

app.use("/", concert);
app.use("/api/Comp", RouteCompositeur);
app.use("/api/Arrg", Arrangeurroutes);
app.use("/api/Oeuv", Oeuvreroutes);
app.use("/auditions", auditionRouter);
app.use("/concerts", concertRouter);
app.use("/api/concert2", concertRouter2);
app.use("/api/Condidat", Condidatroutes);
app.use("/api/utilisateur", Routeutilisateur);

app.use("/api/repetition", RouterRepetition);
/*app.use('/api/planning', RouterPlanning);*/

app.use("/api/congee", RouterCongee);
app.use("/api/absences", RouterAbsences);
app.use("/api/concert", conce);

app.get("/asma/pagehtml", (req, res) => {
  try {
    const indexPath = path.join(__dirname, "index.html");
    res.sendFile(indexPath);
  } catch (error) {
    console.log(error);
  }
});

// notification de  demande de conger asma
/*
app.post("/ajouteconger/:id",auth.loggedMiddleware,auth.isChoriste,async (req, res) =>{
    try{
        const conge = new Congee({
            enConge: false,   //par défaut 
            dateDebutConge: req.body.dateDebutConge,
            dateFinConge: req.body.dateFinConge,
            demande: req.body.demande,
            Choriste: req.params.id,
        })
       const resultat = await  conge.save();
       const utli=  await Utilisateur.findById({_id: req.params.id})
       if(resultat){
       
            io.emit("new_notification",`vous avez une nouvelle congée de ${utli.nom} ${utli.prenom}`)
            
      
    }
    await Utilisateur.findByIdAndUpdate({_id:req.params.id},
        {
         $addToSet: {
            Conges: resultat._id
         }   
        },
        {
            new: true
        }
        )

    res.status(200).json({
        message: "bien retourner",
        resesponse: resultat
    })
}
    catch(e){
console.log(e);
    }
})

*/
app.post(
  "/ajouteconger",
  auth.loggedMiddleware3,
  auth.isChoriste,
  async (req, res) => {
    try {
      const conge = new Congee({
        dateDebutConge: req.body.dateDebutConge,
        dateFinConge: req.body.dateFinConge,
        demande: req.body.demande,
        Choriste: req.auth.userId, // Utilisez req.auth.userId pour récupérer l'ID du choriste authentifié
      });

      const resultat = await conge.save();
      const utli = await Utilisateur.findById({ _id: req.auth.userId });

      if (resultat) {
        io.emit(
          "new_notification",
          `vous avez une nouvelle congée de ${utli.nom} ${utli.prenom}`
        );
      }

      await Utilisateur.findByIdAndUpdate(
        { _id: req.auth.userId },
        {
          $addToSet: {
            Conges: resultat._id,
          },
        },
        {
          new: true,
        }
      );

      res.status(200).json({
        message: "bien retourner",
        resesponse: resultat,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

io.on("connection", (socket) => {
  schedule.scheduleJob("* * * * *", async () => {
    try {
      const tab = [];
      const existcongee = await Congee.find({ enConge: false }).populate(
        "Choriste"
      );
      console.log(existcongee);

      socket.emit("list", existcongee);
    } catch (e) {
      console.error("Une erreur s'est produite :", e);
    }
  });
});

// notif 2

schedule.scheduleJob("*/02 * * * *", async () => {
  try {
    const date = moment(new Date()).toISOString();
    let today = moment();
    console.log(today);
  } catch (error) {
    console.error("An error occurred in the first schedule job:", error);
  }
});

// modifier status d'un choriste en inactif asma
schedule.scheduleJob("*/2 * * * *", async () => {
  // Toutes les deux minutes
  try {
    const date = moment();
    const today = moment();

    const existe_congées = await Congee.find({
      enConge: true,
      dateFinConge: { $gt: date },
    }).populate("Choriste");

    existe_congées.map(async (elem) => {
      console.log(elem);
      console.log(elem.dateDebutConge);
      console.log(today);

      const diff = moment(elem.dateDebutConge).diff(today, "minutes"); // Calculer la différence en minutes

      console.log(diff);

      if (
        diff === 0 ||
        (diff > 0 && diff < 3 && elem.Choriste.etat === "Actif")
      ) {
        console.log("succes");
        try {
          await Utilisateur.findByIdAndUpdate(
            { _id: elem.Choriste._id },
            { etat: "Inactif" }
          );
        } catch (error) {
          console.error("Erreur lors de la mise à jour du statut :", error);
        }
        io.emit("notif_congé", `congée de maintenant a ${elem.dateFinConge}`);
        io.emit(
          "notif_user",
          `  ${elem.Choriste.nom} ${elem.Choriste.prenom} votre statut est inactif avec id : ${elem.Choriste._id}`
        );
      }
    });
  } catch (e) {
    console.error("Une erreur s'est produite :", e);
  }
});
//aziz
app.get("/api/utilisateur/rappelrepetition", async (req, res) => {
  try {
    const { userId } = req.query;
    const aujourdHui = new Date();
    // Calculez la date de demain
    const demain = new Date();
    demain.setDate(aujourdHui.getDate() + 1);
    const dateDemain = demain.toISOString().split("T")[0];
    // Vérifiez s'il y a une répétition demain
    const rehearsalsTomorrow = await repetition.find({ date: dateDemain });

    if (rehearsalsTomorrow.length > 0) {
      // Si des répétitions sont prévues aujourd'hui, demain ou après-demain, envoyez un rappel à tous les utilisateurs non en congé
      const usersNotOnLeave = await Utilisateur.find({
        _id: userId,
        etat: { $ne: "EnConge" },
        role: { $ne: "admin" },
      });
      console.log("user", usersNotOnLeave);
      // // console.log(usersNotOnLeave.length);
      if (usersNotOnLeave.length > 0) {
        // if (false) {
        process.setMaxListeners(15);
        // Envoyez un rappel 1 jours avant la répétition
        usersNotOnLeave.forEach(async (utilisateur) => {
          // console.log("socketid",utilisateur._id)
          const userSocketId = userSocketMap[utilisateur._id];
          // // console.log("test1", userSocketId);
          if (userSocketId) {
            req.notificationData = {
              userId: utilisateur._id,
              notificationMessage: `Vous avez une répétition demain.`,
            };
            // // console.log("test2", req.notificationData);
            await sendNotificationMiddleware(req, res, () => {});
            return res.status(200).json("Sucess");
          }
        });
      } else {
        return res
          .status(200)
          .json("Aucun utilisateur non en congé pour envoyer un rappel");
      }
    } else {
      return res.status(200).json("Aucune répétition demain");
    }

    lastCronRun = aujourdHui;
  } catch (error) {
    console.error(
      "Erreur lors de la notification des utilisateurs :",
      error.message
    );
  }
});
////

http.listen(3000, "localhost", () => {
  console.log("Application connected sur le port 3000...");
});
