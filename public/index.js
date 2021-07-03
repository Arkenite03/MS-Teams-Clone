const socket = io('/');
const peer = new Peer();
const videoDiv = document.getElementById('videoDiv');
const myVideo = document.getElementById('myVideo');
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector(".container")

let otherUsers = {}, otherVid = {}, otherNames = {};
let mediaList = {};                 // For handling media recieving twice

const name = prompt("Enter your name to join");
var myId = 0;

peer.on('open' , (id)=>{
    myId = id;
    socket.emit("newUser" , id, name);
});

// Recieving allNames Object from Server
socket.on('allNames', (namesObj) => {
  otherNames = namesObj;            
});

// for messaging
socket.on('receive', data =>{
  append(`${data.name}: ${data.message}`, 'left')
  console.log(`${data.name}: ${data.message}`);
})

navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
  }).then((stream)=>{

    // Adding myVideo Element
    addMyVideo(stream);

    // Receiving Call
    peer.on('call', callObj => {
        callObj.answer(stream);
        addUserMedia(callObj.peer, callObj, otherNames[callObj.peer]);
    })
    
    // Calling upon New user
    socket.on('userJoined', (userid, userName) =>{
        const call = peer.call(userid, stream);
        addUserMedia(userid, call, userName);
    })

  }).catch(err=>{
      alert(err.message)
  })

  
  // Listening to disconnect event
  socket.on('userDisconnected', (userId) => {

    if(otherUsers[userId]){

      otherUsers[userId].close();

      otherVid[userId][0].parentNode.replaceChild(otherVid[userId][1], otherVid[userId][0]);
      
      setTimeout(() => {
          otherVid[userId][1].remove();
      }, 1500)

    }

  });


  function addUserMedia(userId, callObj, userName) {
    // for closing object on disconnection
    otherUsers[userId] = callObj;
    
    const newUserVid = document.createElement('video');
    const newDisconnect = document.createElement('p');
    const newName = document.createElement('div');

    // Adding Disconnect data
    newDisconnect.innerText = "Disconnecting...";

    // Adding name data
    newName.innerText = userName;
    newName.className = 'myNameCSS';
    
    // Receiving Media from object
    callObj.on('stream', userStream => {
      if(!mediaList[userStream.id]){
        // Adding for twice issue 
        mediaList[userStream.id] = callObj;
        // Adding media to containers
        addVideo(userId, newUserVid, newName, newDisconnect, userStream);
      }
    })
  };


  function addVideo(userId, vidElement, newName, newDisconnect, stream){

    // Playing video
    vidElement.srcObject = stream;
    vidElement.addEventListener('loadedmetadata', () => {
      vidElement.play()
    })

    // Making Container
    const nameVid = document.createElement('div');
    nameVid.id = "nameVid";

    // Adding both elements
    nameVid.append(vidElement);
    nameVid.append(newName);

    // Appending Container
    videoDiv.append(nameVid);

    // Adding for Disconnection
    otherVid[userId] = [nameVid, newDisconnect];
  }


  // Adding my Video
  function addMyVideo(stream){
    const myVid = document.createElement('video');
    myVid.muted = true;
    myVid.srcObject = stream;
    myVid.addEventListener('loadedmetadata', () => {
      myVid.play();
    })
    myVideo.append(myVid);
    const myName = document.createElement('div');
    myName.className = 'myNameCSS';
    myName.innerText = name;
    myVideo.append(myName);
  }


  function disconnectCall(){
    peer.destroy();
    location.replace("/")
  }

  const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    // if(position =='left'){ 
    //     audio.play();
    // }
  }


  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message, myId);
    messageInput.value = ''
  })