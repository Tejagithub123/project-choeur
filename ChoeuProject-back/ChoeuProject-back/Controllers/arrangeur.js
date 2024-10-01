const arrangeur= require("../Models/arrangeur")

const fetcharrangeur = (req,res) => {
    arrangeur.find()
    .then((arrangeurs)=>{
    res.status(200).json({
        model: arrangeurs, 
        message: "success"
    })})
.catch((error) => {
    res.status(400).json({
    error: error.message,
    message: "probleme d'extraction"
})})
}

const addArrang = (req,res) => {
    const newArrang = new arrangeur(req.body) 
    newArrang.save().then(()=>{
    res.status(201).json({
        model: newArrang, 
        message: "objet crée !"
    })}
    )
    .catch((error) => {
        res.status(400).json({
        error: error.message,
        message: "Donnée invalides"
    })})
}

const updateArr = (req, res) => {
    arrangeur.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        .then((Arrg) => {
            if (!Arrg) {
                return res.status(404).json({
                    message: "Object non trouvé",
                });
            }
            res.status(200).json({
                model: Arrg,
                message: "Object modifié",
            });
        })
        .catch((error) => {
            res.status(400).json({
                message: "Données invalides",
            });
        });
};


const deleteArrangeur =(req,res) => {
    arrangeur.deleteOne({_id : req.params.id}).then (()=> {
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
    arrangeur.findOne({_id:req.params.id})
    .then((OneArr) => {
     if(!OneArr){
         res.status(404).json({
             message: "objet non trouvé",})
             return}  
     res.status(200).json({
         model:OneArr,
         message:"object trouvé"
     });
    })
    
 }

module.exports = {
    fetcharrangeur:fetcharrangeur,
    addArrang:addArrang,
    fetchById:fetchById,
    deleteArrangeur:deleteArrangeur,
    updateArr:updateArr
}