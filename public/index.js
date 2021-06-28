const socket = io('/');
const peer = new Peer();
const videoDiv = document.getElementById('videoDiv');

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
        callObj.answer(stream);
        const newUserVid = document.createElement('video');
        callObj.on('stream', userStream => {
            addVideo(newUserVid, userStream);
        })
    })
    
    socket.on('userJoined', (userid) =>{
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