// @ts-ignore
const CategoryCongee = require('../Controllers/congee')

const express = require('express')
const RouterCongee= express.Router()



RouterCongee.post('/',CategoryCongee.ajouter_congee )

RouterCongee.put('/:id',CategoryCongee.modifier_congee)

RouterCongee.get('/',CategoryCongee.select_congee)

RouterCongee.delete('/:id',CategoryCongee.supprimer_congee )

RouterCongee.get('/notif/',CategoryCongee.select_congee_notif)


module.exports = RouterCongee;