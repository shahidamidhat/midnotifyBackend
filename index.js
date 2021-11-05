
import { Server } from "socket.io";

const io = new Server({ 
    cors:{
        origin:"https://notifymidapp.herokuapp.com/"
    }
 });

let onlineUsers = [] 

const addNewuser = (username,socketId)=>{
    !onlineUsers.some((user)=> user.username=== username) &&
    onlineUsers.push({username,socketId})
};

const removeUser = (socketId)=>{
    onlineUsers = onlineUsers.filter((user)=> user.socketId !== socketId)
}

const getUser = (username)=>{
    return onlineUsers.find((user)=> user.username === username)
}

io.on("connection", (socket) => {
    
  socket.on("newUser",(username)=>{
      addNewuser(username,socket.id);
  });

  socket.on("sendNotification",({senderName,recieverName,type})=>{
      const reciever = getUser(recieverName)
      io.to(reciever.socketId).emit("getNotification",{
          senderName,
          type
      })
  })

  socket.on("disconnect", ()=>{
      removeUser(socket.id)
      console.log("someone has left")
  })
});




io.listen(process.env.PORT || 5000);