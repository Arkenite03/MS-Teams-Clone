const socket = io('/');
const peer = new Peer();
const videoDiv = document.getElementById('videoDiv');
<<<<<<< HEAD
const myVideo = document.getElementById('myVideo');
const nameContainer = document.getElementById('names');
let guserName;

let otherUsers = {}, otherVid = {};
=======
>>>>>>> parent of ee9c3b3 (Positioned Video Containers and Disconnetion on leaving)

peer.on('open' , (id)=>{
    socket.emit("newUser" , id);
});

navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
  }).then((stream)=>{

    const myVid = document.createElement('video');
    myVid.muted = true;
    addVideo(myVid, stream);

    peer.on('call', callObj => {
        nameContainer.innerText = guserName;
        callObj.answer(stream);
        const newUserVid = document.createElement('video');
        callObj.on('stream', userStream => {
            addVideo(newUserVid, userStream);
        })
    })
    
    socket.on('userJoined', (userid, userName) =>{
        nameContainer.innerText = userName;
        guserName = userName;
        const call = peer.call(userid, stream);
        const newUserVid = document.createElement('video');
        call.on('stream', userStream => {
            addVideo(newUserVid, userStream);
        })
    })

  }).catch(err=>{
      alert(err.message)
  })

  function addVideo(vidElement, stream){
    vidElement.srcObject = stream;
    vidElement.addEventListener('loadedmetadata', () => {
      vidElement.play()
    })
    videoDiv.append(vidElement);
  }