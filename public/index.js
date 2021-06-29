const socket = io('/');
const peer = new Peer();
const videoDiv = document.getElementById('videoDiv');
const myVideo = document.getElementById('myVideo');
const nameContainer = document.getElementById('names');
let guserName;

let otherUsers = {}, otherVid = {};

peer.on('open' , (id)=>{
    socket.emit("newUser" , id);
});

navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
  }).then((stream)=>{

    const myVid = document.createElement('video');
    myVid.muted = true;
    myVid.srcObject = stream;
    myVid.addEventListener('loadedmetadata', () => {
      myVid.play()
    })
    myVideo.append(myVid);

    peer.on('call', callObj => {
        nameContainer.innerText = guserName;
        callObj.answer(stream);
        otherUsers[callObj.peer] = callObj;
        const newUserVid = document.createElement('video');
        const newDisconnect = document.createElement('p');
        newDisconnect.innerText = "Disconnecting...";
        otherVid[callObj.peer] = [newUserVid, newDisconnect];
        callObj.on('stream', userStream => {
            addVideo(newUserVid, userStream);
        })
    })
    
    socket.on('userJoined', (userid, userName) =>{
        nameContainer.innerText = userName;
        guserName = userName;
        const call = peer.call(userid, stream);
        otherUsers[userid] = call;
        const newUserVid = document.createElement('video');
        const newDisconnect = document.createElement('p');
        newDisconnect.innerText = "Disconnecting...";
        otherVid[userid] = [newUserVid, newDisconnect];
        call.on('stream', userStream => {
            addVideo(newUserVid, userStream);
        })
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

  function addVideo(vidElement, stream){
    vidElement.srcObject = stream;
    vidElement.addEventListener('loadedmetadata', () => {
      vidElement.play()
    })
    videoDiv.append(vidElement);
  }