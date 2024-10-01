// @ts-ignore
const congee = require('../Models/conger');

ajouter_congee = async (req, res) =>{
    const Congee = new congee(req.body)

try{
const resultat = await congee.save()

}
catch(e){

}
}








modifier_congee = (req, res)=>{

    congee.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}).then((cong)=>{
        if(!cong){
            res.status(404).json({message: "existe pas"})
        }
        res.status(200).json({message: "bien modifier le congée ", model:cong })
    })
    .catch((err)=>{
        res.status(404).json({err: err.message})  
    })
}


select_congee= (req ,res) =>{
    congee.find()
    .then((resultat)=>{
        if(!resultat){
            res.status(404).json({
                message: "congee non trouvé",})
                return}   
                res.status(200).json({
                    model: resultat,
                    message: "voilà les congées "
                })  
        } )
}

supprimer_congee = (req, res) =>{
    congee.findOneAndDelete({_id: req.params.id}).then((resultat)=>{
        if(!resultat){res.status(404).json({message: "n'exite pas le congée"})}
        res.status(404).json({message: "congée supprimer"})
    })
    .catch((err)=>{
        res.status(404).json({err: err.message})  
    })
}














select_congee_notif = (req, res) => {
    congee.find().then((resultat) => {
        if (!resultat) {
            res.status(404).json({
                message: "Aucun congé trouvé",
            });
            return;
        }
        // Transformer les congés en notifications
        const notifications = resultat.map(cong => {
            return {
                titre: "Congé",
                message: `Congé du ${cong.dateDebutConge} au ${cong.dateFinConge}`,
                // Ajoutez d'autres propriétés de congé selon vos besoins
            };
        });

        res.status(200).json({
            notifications: notifications,
            message: "Voici les congés sous forme de notifications"
        });
    }).catch((err) => {
        res.status(404).json({ err: err.message });
    });
}


//nouveau approuver congee admin 
const User = require("../Models/Utilisateur");





module.exports={
  
    ajouter_congee: ajouter_congee,
    modifier_congee: modifier_congee,
    select_congee: select_congee,
    supprimer_congee: supprimer_congee,
    select_congee_notif: select_congee_notif ,


}
