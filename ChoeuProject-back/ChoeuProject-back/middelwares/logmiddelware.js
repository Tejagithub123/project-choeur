const jwt = require("jsonwebtoken")
// @ts-ignore
const user = require("../Models/Utilisateur")


// hatha lkolo midllware


//dernier tache asma
module.exports.loggedMiddleware = (req, res, next) => {
    try {
      const authorizationHeader = req.headers.authorization;
  
      if (!authorizationHeader) {
        return res.status(401).json({ error: "Authorization header missing" });
      }
  
      const token = authorizationHeader.split(" ")[1];
      const decodedToken = jwt.verify(token, "your-secret-key-here");
      const userId = decodedToken.userId;
  
      user.findOne({ _id: userId })
        .then((rolegett) => {
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
  }
  

module.exports.isAdmin =  (req, res, next) =>{
    try {
        if(req.auth.role== "admin"){
            next()
    
    }
    else{
        res.status(403).json({error: "no acess to this route"})
    }

    }catch (e) {
        res.status(401).json({error : error.message})
    }
    
}


module.exports.isChoriste =  (req, res, next) =>{
    try {
        if(req.auth.role== "choriste"){
            next()
    
    }
    else{
        res.status(403).json({error: "no acess to this route"})
    }

    }catch (e) {
        res.status(401).json({error : error.message})
    }
    
}



module.exports.ischefPupitre =  (req, res, next) =>{
    try {
        if(req.auth.role== "chefPupitre"){
            next()
    
    }
    else{
        res.status(403).json({error: "no acess to this route"})
    }

    }catch (e) {
        res.status(401).json({error : error.message})
    }
    
}
