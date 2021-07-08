const socket = io('/');
const peer = new Peer();
// Calling Elements
const videoDiv = document.getElementById('videoDiv');
const myVideo = document.getElementById('myVideo');
// Chatting Elements
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector(".container")

let otherUsers = {}, otherVid = {}, otherNames = {};
let mediaList = {};                 // For handling media recieving twice
let myRoomUsers = [];

// Name Prompt
const name = prompt("Enter your name to join");

// Global var for ID
var myId = 0, myMedia = 0;      

peer.on('open' , (id)=>{
    myId = id;
    socket.emit("newUser" , id, name, roomID);
});

// Recieving allNames Object from Server
socket.on('allNames', (namesObj) => {
  otherNames = namesObj;            
});

// for messaging
socket.on('receive', data =>{
  append(`${data.name}: ${data.message}`, 'left');
  messageContainer.scrollTop = messageContainer.scrollHeight;
})


navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
  }).then((stream)=>{

    myMedia = stream;

    // Adding myVideo Element
    addMyVideo(stream);

    // Receiving Call
    peer.on('call', callObj => {
      if(!myRoomUsers.includes(callObj.peer)){
        myRoomUsers.push(callObj.peer);
      }

      let flag = -1;
      
      callObj.answer(stream);
      
      callObj.on('stream', remoteStream => {
          flag = remoteStream.getAudioTracks().length;
          
          if(flag == 0){
            addScreenStream(remoteStream);
          }else if(flag == 1){
            addUserMedia(callObj.peer, callObj, otherNames[callObj.peer]);
          }else{
            console.log(`${flag} err`);
          }
      })
    })
    
    // Calling upon New user
    socket.on('userJoined', (userid, userName) =>{
        otherNames[userid] = userName;

        // Message Appending
        append(`${userName} joined the room!`, 'left');
        messageContainer.scrollTop = messageContainer.scrollHeight;
        
        const call = peer.call(userid, stream);
        myRoomUsers.push(userid);
        addUserMedia(userid, call, userName);
    })

  }).catch(err=>{
      alert(err.message)
  })

  
  // Listening to disconnect event
  socket.on('userDisconnected', (userId) => {

    if(otherUsers[userId]){

      // Message Appending
      append(`${otherNames[userId]} left the room!`, 'left');
      messageContainer.scrollTop = messageContainer.scrollHeight;

      otherUsers[userId].close();

      otherVid[userId][0].parentNode.replaceChild(otherVid[userId][1], otherVid[userId][0]);
      
      setTimeout(() => {
          otherVid[userId][1].remove();
      }, 1500)

    }

  });

// -----------------------Media Functions----------------------

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

// -------------------------Chatting Functions------------------------------

  const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
  }


  form.addEventListener('submit', (e) => {
    e.preventDefault();  // Don't reload the page
    const message = messageInput.value;  
    append(`You: ${message}`, 'right');
    messageContainer.scrollTop = messageContainer.scrollHeight;
    socket.emit('send', message, myId);
    messageInput.value = ''   // Again inp empty
  })

// ---------------------Button Functions-------------------
  
  // Disconnect Call

  function disconnectCall(){
    peer.destroy();
    location.replace("/")
  }

  // Mute Video

  function toggleVideo(btnObj) {
	  btnObj.classList.toggle("fa-video-slash");
    myMedia.getVideoTracks()[0].enabled = !(myMedia.getVideoTracks()[0].enabled);
  }

  // Mute Audio
  
  function toggleAudio(btnObj) {
	  btnObj.classList.toggle("fa-microphone-slash");
    myMedia.getAudioTracks()[0].enabled = !(myMedia.getAudioTracks()[0].enabled);
  }

  // -----------------Screen Sharing----------------------------------------

  function addScreenStream(remoteStream) {
      // Emptying Container
      const screenContainer = document.getElementById('screenContainer');
      screenContainer.innerHTML = "";

      // Getting vid ready
      const myVid = document.createElement('video');
      myVid.muted = true;
      myVid.srcObject = remoteStream;
      myVid.addEventListener('loadedmetadata', () => {
        myVid.play();
      })

      // Appending in container again
      screenContainer.append(myVid);
  }

  // Button onclick
  async function screenToggle() {
      // Screen Media
      const screenStream = await navigator.mediaDevices.getDisplayMedia(
        {
          video: { frameRate: 5, width: 1280, height: 720 },
        }
      );
      // Looping for all members in room
      for(let user in myRoomUsers){ 
        const call = peer.call(myRoomUsers[user], screenStream);
      }
  }