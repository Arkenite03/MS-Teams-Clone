const express = require('express'); 
const app = express(); 
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.set("view engine", "ejs"); 
  
app.use(express.static("public")); 

app.get('/' , (req,res)=>{
    res.render('main');
});

app.get('/home' , (req,res)=>{
    res.render('index');
});

io.on('connection' , (socket)=>{
    socket.on('newUser' , (id)=>{
        // socket.join('/home');
        socket.broadcast.emit("userJoined" , id);
        socket.on('disconnect', () => {
            socket.broadcast.emit('userDisconnected', id);
        }); 
    });
}); 
  
server.listen(9090 , ()=>{
    console.log("Server running on port 9090");
});