const express = require('express'); 
const app = express(); 
const server = require('http').Server(app);
const io = require('socket.io')(server);
var PORT = process.env.PORT || 9090;

app.set("view engine", "ejs"); 
  
app.use(express.static("public")); 

app.get('/' , (req,res)=>{
    res.render('main');
});

app.get('/room' , (req,res)=>{
    res.render('index');
});

io.on('connection' , (socket)=>{
    socket.on('newUser' , (id)=>{
        socket.broadcast.emit("userJoined" , id);
        socket.on('disconnect', () => {
            socket.broadcast.emit('userDisconnected', id);
        }); 
    });
}); 
  
server.listen(PORT , ()=>{
    console.log("Server running on port 9090");
});