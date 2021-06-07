const { response } = require("express");
const bcrypt = require('bcryptjs')
const Usuario = require("../models/Usuario");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req,res= response) =>{ 
        
    const { email, password } = req.body;

    try {

        const existeEmail = await Usuario.findOne({email});
        if ( existeEmail ){
            return res.status(400).json({
                ok:false,
                msg:'El correo ya esta registrado'
            });
        }


        const usuario = new Usuario(req.body);

        //Encriptar Contraseña
        const salt = bcrypt.genSaltSync(10);
        usuario.password = bcrypt.hashSync(password,salt);

        await usuario.save();

        //Generar mi JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok:true,
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.json({
            ok:false,
            msg:'Hable con el administrador'
        });        
    }
}

const login = async (req,res= response) =>{ 
        
    const { email, password } = req.body;

    try {

        const usuarioDB = await Usuario.findOne({email});
        if ( !usuarioDB ){
            return res.status(404).json({
                ok:false,
                msg:'El correo no esta registrado'
            });
        }

        const validarPassword = bcrypt.compareSync(password,usuarioDB.password);
        if( !validarPassword ){
            return res.status(400).json({
                ok:false,
                msg:'Contraseña incorrecta'
            });
        }
        
        //Generar mi JWT
        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok:true,
            usuario:usuarioDB,
            token
        });        
    } catch (error) {
        console.log(error);
        res.json({
            ok:false,
            msg:'Hable con el administrador'
        });        
    }
}

const renewToken = async (req ,res = response) =>{
    const uid = req.uid;
    const token = await generarJWT(uid);
    const usuario = await Usuario.findById(uid);  

    res.json({
        ok:true,
        usuario,
        token
    });        
}

module.exports = {
    crearUsuario,
    login,
    renewToken
}