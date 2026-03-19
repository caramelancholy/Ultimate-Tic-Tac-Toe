import Peer, { type DataConnection } from "peerjs";
import { useState, useEffect, useRef } from "react";
import { ConnectionState } from "../types/Connection";
import { PlayerType } from "../types/Board";

const usePeer = (onConnOpen: (conn: DataConnection) => void) => {
  const peerInstance = useRef<Peer | null>(null);
  const connection = useRef<DataConnection | undefined>(undefined);
  const [peerId, setPeerId] = useState<string>('');
  const [connState, setConnState] = useState<ConnectionState>(ConnectionState.INITIALISING);

  const sendData = (data: any) => { connection.current?.send(data); }

  const connectId = (id: string) => { 
    const conn = peerInstance.current?.connect(id, {
      metadata: {
        player: PlayerType.CROSSES
    }}); 

    connection.current = conn;

    if(conn) {
      setupConnection(conn);
    }

  }

  const setupConnection = (conn: DataConnection) => {
    console.log(conn);
    conn.on('open', () => {
      onConnOpen(conn);
      setConnState(ConnectionState.CONNECTED);
    })
    conn.on('close', () => {
      setConnState(ConnectionState.DISCONNECTED);  
    });
    
  }

  useEffect(() => {
    console.log(onConnOpen);
    const peer = new Peer({ debug: 3 })
    
    peer.on('open', (id) => {
      setPeerId(id);
      setConnState(ConnectionState.DISCONNECTED);
    })

    peer.on('connection', (conn) => {
      setupConnection(conn);
    });

    peer.on('close', () => { 
      setPeerId('');
      setConnState(ConnectionState.INITIALISING); 
    });

    peerInstance.current = peer;

    return () => { peer?.destroy(); }

  },[]);

  return { peerId, connState, connectId, sendData }
}

export default usePeer;