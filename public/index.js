const socket = io('/');
const peer = new Peer();
const videoDiv = document.getElementById('videoDiv');
const myVideo = document.getElementById('myVideo');

let otherUsers = {}, otherVid = {};

const name = prompt("Enter your name to join");

peer.on('open' , (id)=>{
    socket.emit("newUser" , id);
});

navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
  }).then((stream)=>{

    addMyVideo(stream);

    peer.on('call', callObj => {
        callObj.answer(stream);
        addUserMedia(callObj.peer, callObj);
    })
    
    socket.on('userJoined', (userid) =>{
        const call = peer.call(userid, stream);
        addUserMedia(userid, call);
    })

  }).catch(err=>{
      alert(err.message)
  })

  socket.on('userDisconnected', (userId) => {
    if(otherUsers[userId]){
      otherUsers[userId].close();
      otherVid[userId][0].parentNode.replaceChild(otherVid[userId][1], otherVid[userId][0]);
      setTimeout(() => {
        otherVid[userId][1].remove();
      }, 1500)
    }
  });

  function addUserMedia(userId, callObj) {
    otherUsers[userId] = callObj;
    const newUserVid = document.createElement('video');
    const newDisconnect = document.createElement('p');
    newDisconnect.innerText = "Disconnecting...";
    otherVid[userId] = [newUserVid, newDisconnect];
    callObj.on('stream', userStream => {
        addVideo(newUserVid, userStream);
    })
  };

  function addVideo(vidElement, stream){
    vidElement.srcObject = stream;
    vidElement.addEventListener('loadedmetadata', () => {
      vidElement.play()
    })
    videoDiv.append(vidElement);
  }

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