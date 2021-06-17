/*
    path= api/login
*/

const {Router} = require('express');
const { check } = require('express-validator');
const { crearUsuario,login,renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();

router.post('/new',[
    check('nombre','Nombre es obligatorio').not().isEmpty(),
    check('email','Email es obligatorio').isEmail(),
    check('password','Password es obligatorio').not().isEmpty(),
    validarCampos
],crearUsuario);

router.post('/',[    
    check('email','Email es obligatorio').isEmail(),
    check('password','Password es obligatorio').not().isEmpty(),
    validarCampos
],login);

router.get('/renew',validarJWT,renewToken);



module.exports = router;