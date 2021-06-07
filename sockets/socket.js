const {io} = require('../index');


//Mensajes de Socket
io.on('connection', client => {
  console.log("Se conecto al servidor");

  client.on('disconnect', () => {
    console.log("Se perdio la conexion");

  });

 /*   client.on('mensaje',(payload)=>{
    console.log('Mensaje!!',payload);
    io.emit('mensaje',{admin:'Nuevo Mensaje'});
   }) */
}); 
