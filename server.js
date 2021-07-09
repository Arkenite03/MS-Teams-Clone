const express = require('express'); 
const app = express(); 
const server = require('http').Server(app);
const io = require('socket.io')(server);
const {v4:uuidv4} = require('uuid');
var PORT = process.env.PORT || 9090;
var otherNames = {};

app.set("view engine", "ejs"); 
  
app.use(express.static("public")); 

app.get('/' , (req,res)=>{
    res.render('main', {RoomId:uuidv4()});
});

app.get('/about' , (req,res)=>{
    res.render('about');
});

app.get('/more' , (req,res)=>{
    res.send('more');
});

app.get('/:room' , (req,res)=>{
    res.render('index', {RoomId:req.params.room});
});

io.on('connection' , (socket)=>{
    socket.on('newUser' , (id, name, roomID) => {        
        socket.join(roomID);

        // Calling Purpose
        socket.emit('allNames', otherNames);
        otherNames[id] = name;
        socket.to(roomID).emit("userJoined" , id, name);
        socket.on('disconnect', () => {
            socket.to(roomID).emit('userDisconnected', id);
        }); 

        // Chatting
        socket.on('send', (message, myId) =>{
            socket.to(roomID).emit('receive', {message: message, name: otherNames[myId]});
        });
        
        // Screen Closed

        socket.on("screenClosed", () => {
            socket.to(roomID).emit('closeScreen');
        })
        
    });
}); 
  
server.listen(PORT , ()=>{
    console.log("Server running on port 9090");
});