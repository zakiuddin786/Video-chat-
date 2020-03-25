const express=require('express')
const app = express()
const http=require('http').Server(app)
const io = require('socket.io')(http)
const port=process.env.PORT || 3000

app.use(express.static(__dirname+"/public"))

let client=0

io.on('conection',function(socket){
    socket.on("NewClient",function(){
        if(clients<2){
            if(client==1){
                this.emit('createPeer')
            }
        }
        else
        this.emit("sessionActive")
    clients++;
    })
    socket.on("offer",sendOffer)
    socket.on("answer",sendAnswer)
    socket.on("disconnect",Disconnect)

})

function Disconnect(){
    if(clients>0)
    clients--;
}

function sendOffer(offer){
    this.broadcast.emit("BackOffer",offer)
}

function sendAnswer(data){
    this.broadcast.emit("backAnswer",data)
}

http.listen(port,()=>console.log(`Active on${port} port`))