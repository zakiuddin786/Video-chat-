

let peer =require('simple-peer')
let socket=io()
const video=document.querySelector('video')
let client={}

navigator.mediaDevices.getUserMedia({video:true,audio:true}).then(stream=>{
    socket.emit('NewClient')
    video.srcObject=stream
    video.play()

    function initPeer(type){
        let peer= new peer({initiator:(type=='init')?true:false,stream:stream,trickle:false})
        peer.on('stream',function(stream){
            createVideo(stream)
        })
        peer.on('close',function(){
            document.getElementById("peervideo").remove();
            peer.destroy()
        })
        return peer
    }

    function makePeer(){
        client.gotAnswer=false
        let peer=initPeer('init')
        peer.on('signal',function(data){
            if(!client.gotAnswer){
                socket.emit('offer',data)
            }
        })
        client.peer=peer
    }

    function frontAnswer(offer){
        let peer=initPeer('notInt')
        peer.on('signal',(data)=>{
            socket.emit('Answer',data)
        })
        peer.signal(offer)
    }

    function signalAnswer(answer){
        client.gotAnswer=true
        let peer=client.peer
        peer.signal(answer)
    }

    function createVideo(stream){
        let video=document.createElement('video')
        video.id='peervideo'
        video.srcObject=stream
        video.class="embed-responsive-item"
        document.querySelector('#peerDiv').appendChild(video)
        video.play()
    }

    function SessionActive(){
        document.write("Session is Going on please try later!!!")
    }

    socket.on('backOffer',frontAnswer)
    socket.on('backAnswer',signalAnswer)
    socket.on('sessionActive',SessionActive)
    socket.on('createPeer',makePeer)



}).catch(err=>document.write(err))
