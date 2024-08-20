import { Server } from "socket.io";

const socketInit = (httpInstance)=>{
  const io = new Server(httpInstance)

  return io
}


export default socketInit