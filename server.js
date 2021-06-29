const express = require('express'); 
const app = express(); 
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
let userName = "";

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs"); 
app.use(express.static("public")); 

app.get('/' , (req,res)=>{
    res.render('main');
});

app.post('/home', function (req, res) {
    // res.render('index', { name: req.body.name });
    res.render('index');
    userName = req.body.name;
    console.log(req.body.name);
});

// app.get('/home' , (req,res)=>{
//     res.render('index');
//     // console.log(req.body.name);
// });


io.on('connection' , (socket)=>{
    socket.on('newUser' , (id)=>{
        // socket.join('/home');
        socket.broadcast.emit("userJoined" , id, userName);
        socket.on('disconnect', () => {
            socket.broadcast.emit('userDisconnected', id);
        }); 
    });
}); 
  
server.listen(4000 , ()=>{
    console.log("Server running on port 4000");
});