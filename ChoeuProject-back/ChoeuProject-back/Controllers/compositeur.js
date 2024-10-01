const compositeur= require("../Models/compositeur")

const fetchcompositeur = (req,res) => {
    compositeur.find()
    .then((compositeurs)=>{
    res.status(200).json({
        model: compositeurs, 
        message: "success"
    })})
.catch((error) => {
    res.status(400).json({
    error: error.message,
    message: "probleme d'extraction"
})})
}

const addcompositeur = (req,res) => {
    console.log(req.body)
    const newComp = new compositeur(req.body) 
    newComp.save().then(()=>{
    res.status(201).json({
        model: newComp, 
        message: "objet crée !"
    })}
    )
    .catch((error) => {
        res.status(400).json({
        error: error.message,
        message: "Donnée invalides"
    })})
}

const updatecompositeur = (req, res) => {
    compositeur.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        .then((comp) => {
            if (!comp) {
                return res.status(404).json({
                    message: "Object non trouvé",
                });
            }
            res.status(200).json({
                model: comp,
                message: "Object modifié",
            });
        })
        .catch((error) => {
            res.status(400).json({
                message: "Données invalides",
            });
        });
};

const deletecompositeur =(req,res) => {
    compositeur.deleteOne({_id:req.params.id}).then (()=> {
        res.status(200).json({
            message : "suppremé avec succes"
        });
    })
    .catch((error) => {
        res.status(400).json({
        error:error.message,
        message : "erreur de suppression"
    })
    })
    
}

const fetchById =(req,res)=> {
    compositeur.findOne({_id:req.params.id})
    .then((Onecomp) => {
     if(!Onecomp){
         res.status(404).json({
             message: "objet non trouvé",})
             return}  
     res.status(200).json({
         model:Onecomp,
         message:"object trouvé"
     });
    })
    
 }
module.exports = {
    fetchcompositeur:fetchcompositeur,
    addcompositeur:addcompositeur,
    updatecompositeur:updatecompositeur,
    deletecompositeur:deletecompositeur,
    fetchById:fetchById

}