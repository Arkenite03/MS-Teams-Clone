const express = require('express'); 
const app = express(); 
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.set("view engine", "ejs"); 
  
app.use(express.static("public")); 
  

app.get('/' , (req,res)=>{
    res.render('index');
});

io.on('connection' , (socket)=>{
    socket.on('newUser' , (id)=>{
        socket.join('/');
        socket.broadcast.emit("userJoined" , id);   
    });
});
  
server.listen(4000 , ()=>{
    console.log("Server running on port 4000");
});