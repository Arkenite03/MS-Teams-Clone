# Teams-Time.com

_<h4>An <b>MS Teams Clone</b> created as a part of <b>Microsoft Engage 2021</b> program.</h4>_<br> 
The Web based project allows multiple users to connect through <b>One-on-One Video call,
On-call chatting, Screen-Sharing</b> and various other functionalities. 

### Table of Contents  
- [Demo](#demo)
- [Features](#features)
- [Technologies & Dependencies Used](#technologies--dependencies-used)    
- [Agile Methodology Followed](#agile-methodology-followed)    
- [Project Design](#project-design)
- [Setup on Local System](#setup-on-local-system)
- [References](#references)

## Demo

### Open the app by clicking on the link - _<a href = "https://teams-time.herokuapp.com">teams-time.herokuapp.com</a>_
#### Instructions
- Click on `Create Room` to create new room with unique ID
- Enter Your Name in the `prompt`
- Copy the `Room ID` clicking on the `copy icon`
- Share `Room ID` with others for them to join the room

## Features
1. Entirely *`browser`* based
2. Unlimited number of conference rooms without call time limitation
3. Optimized *`Room Url Sharing`* 
4. Screen Sharing to present documents, slides, and more...
5. Notification when someone *`joins/leaves`*.
6. Text messaging with other members, with the username being your display name.
7. Video and Audio *`Mute`* Option
8. Copy button functionality-automatically `copies` room link to clipboard.

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

## Agile Methodology Followed

- [Agile Methodology Used](https://docs.google.com/document/d/1Kkela4giEH20Q50l1LTZv6bawiLXgQ_qZz92-yqqA0A/edit?usp=sharing) 

## Project Design
- [Project Design](https://docs.google.com/document/d/1j6q8vKkyt4VXGI07H1KoglUitQQqiDrMKkBd76Vg57Y/edit?usp=sharing)

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

## References

- [Socket.io](http://socket.io/)
- [Peerjs](https://peerjs.com/)
- [Clever Programmer - YT](https://www.youtube.com/watch?v=ZVznzY7EjuY&t=6382s)
- [Express](https://expressjs.com/en/4x/api.html#res)
