const { header } = require('express-validator');
const { comprobarJWT } = require('../helpers/jwt');
const {io} = require('../index');
const { usuarioConectado,usuarioDesconectado, grabarMensaje } = require('../controllers/socket');


//Mensajes de Socket
io.on('connection', (client) => {
  console.log("Se conecto al servidor");
  
  const [valido,uid] = comprobarJWT(client.handshake.headers['x-token'])


  //Verificar autenticación
   if (!valido){
    return client.disconnect();
  }

  //Cliente autenticado
  usuarioConectado(uid);
  //Ingresar al usuario a una sala en particula
  //sala global,client.id, 60bd36d58f92bb2450d6478a
  client.join(uid);
  //Escuchar del cliente el mensaje-personal
  client.on('mensaje-personal',async (payload) => {
    //Grabar mensaje
    await grabarMensaje(payload);
    console.log(payload);
    io.to(payload.para).emit('mensaje-personal',payload);
  });

  client.on('disconnect', () => {
    usuarioDesconectado(uid);
  });

 /*   client.on('mensaje',(payload)=>{
    console.log('Mensaje!!',payload);
    io.emit('mensaje',{admin:'Nuevo Mensaje'});
   }) */
}); 
