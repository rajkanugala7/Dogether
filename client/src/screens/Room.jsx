import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import peer from "../service/peer";
import { useSocket } from "../context/SocketProvider";

const RoomPage = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [isSend, setIsSend] = useState(false);
  const [iscall, setIsCall] = useState(false);

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);
    

  useEffect(() => {
    if (remoteStream && !isSend)
    {
      sendStreams();
      setIsSend(true)
    }
  },[isSend,remoteStream])

  const handleCallUser = useCallback(async () => {
    setIsCall(true);
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });   
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);


  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
   async ({ from, ans }) => {
     await peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
   
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);

  return (
    <div className="room"> 
      <div className="room-info">
      <h1>Your Meeting Room</h1>
      <h4>{remoteSocketId ? "Room has member" : "No one in room" }       {remoteSocketId && !remoteStream&& <button onClick={handleCallUser} className="btn btn-light ms-5">Call now!<i class="fa-solid fa-phone" style={{color: "green"}}></i></button>}
      </h4>
     </div>
        <div className="streams p-5">
  {remoteStream && (
    <div style={{ borderRadius: "30px", overflow: "hidden", width: "700px", height: "500px" }}>
      <ReactPlayer
        playing
        
        height="100%"
        width="100%"
        url={remoteStream}
      />
    </div>
  )}
  {myStream && (
    <div style={{ borderRadius: "30px", overflow: "hidden", width: "300px", height: "220px" } } className="mt-5">
      <ReactPlayer
        playing={true}
        height="100%"
              width="100%"
              muted
        url={myStream}
      />
          </div>
          
        )} 
        
</div>

    </div>
  );
};

export default RoomPage;
