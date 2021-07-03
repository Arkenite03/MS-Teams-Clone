const express = require('express'); 
const app = express(); 
const server = require('http').Server(app);
const io = require('socket.io')(server);
var PORT = process.env.PORT || 9090;
var otherNames = {};

app.set("view engine", "ejs"); 
  
app.use(express.static("public")); 

app.get('/' , (req,res)=>{
    res.render('main');
});

app.get('/room' , (req,res)=>{
    res.render('index');
});

io.on('connection' , (socket)=>{
    socket.on('newUser' , (id, name) => {        
        socket.join('/room');

        // Calling Purpose
        socket.emit('allNames', otherNames);
        otherNames[id] = name;
        socket.broadcast.emit("userJoined" , id, name);
        socket.on('disconnect', () => {
            socket.broadcast.emit('userDisconnected', id);
        }); 

        // Chatting
        socket.on('send', (message, myId) =>{
            socket.broadcast.emit('receive', {message: message, name: otherNames[myId]});
        });
        
    });
}); 
  
server.listen(PORT , ()=>{
    console.log("Server running on port 9090");
});