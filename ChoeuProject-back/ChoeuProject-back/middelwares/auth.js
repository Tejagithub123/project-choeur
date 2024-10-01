const jwt = require("jsonwebtoken");

const user = require("../Models/Utilisateur");

// hatha lkolo midllware
/*
module.exports.loggedMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]
    const decodedToken = jwt.verify(token, "your-secret-key-here")
    const userId = decodedToken.userId
    // find the user with userId
    /// if exist

   
      user.findOne({_id:userId})
        .then((rolegett)=>{
           if(rolegett){
            req.auth ={
                userId : userId,
                role : rolegett.role
            }
          next()
           }
           else{
            res.status(401).json({error: "user dosen't exist"})
           }    
           
        })
       
      
  } catch (error) {
    res.status(401).json({ error: error.message})
  }
}*/

//dernier tache asma
module.exports.loggedMiddleware3 = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }

    const token = authorizationHeader.split(" ")[1];

    const decodedToken = jwt.verify(token, "your-secret-key-here");

    const userId = decodedToken.userId;

    user.findOne({ _id: userId }).then((rolegett) => {
      if (rolegett) {
        req.auth = {
          userId: userId,
          role: rolegett.role,
        };
        next();
      } else {
        res.status(401).json({ error: "User doesn't exist" });
      }
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

//dernier tache asma
module.exports.loggedMiddleware = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }

    const token = authorizationHeader.split(" ")[1];

    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");

    const userId = decodedToken.userId;

    user.findOne({ _id: userId }).then((rolegett) => {
      if (rolegett) {
        req.auth = {
          userId: userId,
          role: rolegett.role,
        };
        next();
      } else {
        res.status(401).json({ error: "User doesn't exist" });
      }
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

/*module.exports.isAdmin = (req, res, next) => {
    try {
        if (req.auth.role === "admin") {
            next();
        } else {
            res.status(403).json({ error: "Seule l'administrateur peut faire cette tâche" });
        }
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};*/

module.exports.isAdmiin = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const users = await user.findOne({ _id: decoded.userId });

    if (!users || users.role !== "admin") {
      throw new Error(
        "Unauthorized  ,Only the administrator can perform this task"
      );
    }

    req.auth = users;
    next();
  } catch (error) {
    console.error(error.message);
    res.status(403).json({
      message: "Unauthorized  ,Only the administrator can perform this task",
    });
  }
};

module.exports.isChef_Pupitre = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const users = await user.findOne({ _id: decoded.userId });
    console.log(users.role);
    if (!users || users.role !== "chefPupitre") {
      throw new Error(
        "Unauthorized  ,Only the chef pupitre can perform this task"
      );
    }

    req.auth = users;
    next();
  } catch (error) {
    console.error(error.message);
    res.status(403).json({
      message: "Unauthorized  ,Only the chef pupitre can perform this task",
    });
  }
};

module.exports.isChoristee = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const users = await user.findOne({ _id: decoded.userId });

    if (!users || users.role !== "choriste") {
      throw new Error(
        "Unauthorized  ,Only the  choriste can perform this task"
      );
    }

    req.auth = users;
    next();
  } catch (error) {
    console.error(error.message);
    res.status(403).json({
      message: "Unauthorized  ,Only the  choriste can perform this task",
    });
  }
};

//dernier tache duplic modif secret key
module.exports.loggedMiddlewares = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }

    const token = authorizationHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;

    user.findOne({ _id: userId }).then((rolegett) => {
      if (rolegett) {
        req.auth = {
          userId: userId,
          role: rolegett.role,
        };
        next();
      } else {
        res.status(401).json({ error: "User doesn't exist" });
      }
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports.isAdmin = (req, res, next) => {
  try {
    if (req.auth.role == "admin") {
      next();
    } else {
      res.status(403).json({
        error:
          "No access to this route; this route is accessible only for the admin",
      });
    }
  } catch (e) {
    res.status(401).json({ error: error.message });
  }
};

module.exports.isChoriste = (req, res, next) => {
  try {
    if (req.auth.role == "choriste") {
      next();
    } else {
      res.status(403).json({
        error:
          "No access to this route; this route is accessible only for the chorist",
      });
    }
  } catch (e) {
    res.status(401).json({ error: error.message });
  }
};

module.exports.ischefPupitre = (req, res, next) => {
  try {
    if (req.auth.role == "chefPupitre") {
      next();
    } else {
      res.status(403).json({ error: "no acess to this route" });
    }
  } catch (e) {
    res.status(401).json({ error: error.message });
  }
};

module.exports.isManagerChoeur = (req, res, next) => {
  try {
    if (req.auth.role == "ManagerChoeur") {
      next();
    } else {
      res.status(403).json({ error: "no acess to this route" });
    }
  } catch (e) {
    res.status(401).json({ error: error.message });
  }
};

module.exports.isAdminOrManagerChoeur = (req, res, next) => {
  try {
    const allowedRoles = ["admin", "ManagerChoeur"];

    if (allowedRoles.includes(req.auth.role)) {
      next();
    } else {
      res.status(403).json({ error: "No access to this route" });
    }
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
};

module.exports.isChoristehim = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userFromToken = await user.findOne({ _id: decoded.userId });

    if (
      !userFromToken ||
      (userFromToken.role !== "choriste" && userFromToken.role !== "admin")
    ) {
      throw new Error(
        "Unauthorized, Only the choriste or admin can perform this task"
      );
    }

    if (
      userFromToken.role === "choriste" &&
      userFromToken._id.toString() !== req.params.userId
    ) {
      throw new Error(
        "Unauthorized, Only the specified choriste can perform this task"
      );
    }

    req.auth = userFromToken;
    next();
  } catch (error) {
    console.error(error.message);
    res.status(403).json({ message: error.message });
  }
};

module.exports.ischoriste_admin = (req, res, next) => {
  try {
    if (req.auth.role === "ManagerChoeur" || req.auth.role === "admin") {
      next();
    } else {
      res.status(403).json({
        error:
          "No access to this route; this route is accessible only for the admin and the Manager of the choeur",
      });
    }
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
