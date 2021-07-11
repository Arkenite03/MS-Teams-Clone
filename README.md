# Teams-Time.com

_<h4>An <b>MS Teams Clone</b> created as a part of <b>Microsoft Engage 2021</b> program.</h4>_<br> 
The Web based project allows multiple users to connect through <b>One-on-One Video call,
On-call chatting, Screen-Sharing</b> and various other functionalities. 

### Table of Contents  
- [Demo](#Demo)  
- [Technologies & Dependencies Used](#technologies--dependencies-used)
- [Setup on Local System](#setup-on-local-system)

## Demo

### Open the app by clicking on the link - _<a href = "https://teams-time.herokuapp.com">teams-time.herokuapp.com</a>_
#### Instructions
- Click on `Create Room` to create new room with unique ID
- Enter Your Name in the `prompt`
- Copy the `Room ID` clicking on the `copy icon`
- Share `Room ID` with others for them to join the room

## Technologies & Dependencies Used

#### Technologies
- Node Js
- Express Js Server
- WebRTC
#### Dependencies
- Peerjs Library
- socket.io
- UUID
- Nodemon
- body-parser
- EJS

## Setup on Local System
The master branch contains the complete implementations.
###### Clone
<p>Clone this repo to your local machine using <a href="https://github.com/Arkenite03/MS-Teams-Clone">this link</a></p>
<pre><code>git clone https://github.com/Arkenite03/MS-Teams-Clone</code></pre>
<pre><code>npm install -g nodemon</code></pre>

---

###### Sever Setup
<pre><code>npm install -g nodemon</code></pre>
<pre><code>nodemon ./server.js localhost 9090</code></pre>

- Open `http://localhost:9090/` on your browser and get started
