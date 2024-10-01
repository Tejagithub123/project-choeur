/*// @ts-ignore
const planning = require('../Models/planning');

ajouter_planning = (req, res) =>{
    const Planning = new planning(req.body)
    Planning.save().then((resultat)=>{
        res.status(201).json({
          model :resultat,
          message : " le planning est bien crée"
        })

    })
    .catch((err)=>{
        res.status(400).json({err: err.message})
    })
}

supprimer_planning = (req, res) =>{
    planning.findOneAndDelete({_id: req.params.id}).then((resultat)=>{
        if(!resultat){res.status(404).json({message: "n'exite pas"})}
        res.status(404).json({message: "planing supprimer"})
    })
    .catch((err)=>{
        res.status(404).json({err: err.message})  
    })
}




modifier_planning = (req, res)=>{

    planning.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}).then((pl)=>{
        if(!pl){
            res.status(404).json({message: "existe pas"})
        }
        res.status(200).json({message: "bien modifier", model:pl })
    })
    .catch((err)=>{
        res.status(404).json({err: err.message})  
    })
}



select_planning= (req ,res) =>{
    planning.find()
    .then((resultat)=>{
        if(!resultat){
            res.status(404).json({
                message: "planning non trouvé",})
                return}   
                res.status(200).json({
                    model: resultat,
                    message: "voilà les planning "
                })  
        } )
}



module.exports={
  
    ajouter_planning: ajouter_planning,
    supprimer_planning: supprimer_planning,
    modifier_planning: modifier_planning,
    select_planning: select_planning
}
*/