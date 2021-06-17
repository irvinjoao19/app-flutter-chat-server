const response = require('express');
const { generarJWT } = require('../helpers/jwt');
const Mensaje = require("../models/mensaje");

const getMensajes = async (req,res = response) => {  
    
    //const desde = Number(req.query.desde) || 0;

    const miId = req.uid;
    const mensajesDe = req.params.de

    const mensajes = await Mensaje
    .find({ $or : [
        {de:miId,para:mensajesDe},{de:mensajesDe,para:miId},
    ]})
    .sort({createdAt: 'desc'})
    //.skip(desde)
    .limit(30); 
    

    res.json({
        ok:true,
        mensajes
    });        
}


module.exports = {
    getMensajes
}
