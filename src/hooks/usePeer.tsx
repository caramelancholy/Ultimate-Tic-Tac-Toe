import Peer, { type DataConnection } from "peerjs";
import { useState, useEffect, useRef } from "react";
import { ConnectionSource, ConnectionState, type ConnectionData } from "../types/Connection";

const usePeer = (onPeerOpen: (connectId: (id: string) => void) => void, onConnOpen: (conn: DataConnection, sendData: (data: ConnectionData) => void, source: ConnectionSource) => void, onConnClose: () => void) => {
  const peerInstance = useRef<Peer | null>(null);
  const connection = useRef<DataConnection | undefined>(undefined);
  const [peerId, setPeerId] = useState<string>('');
  const [connState, setConnState] = useState<ConnectionState>(ConnectionState.INITIALISING);

  const sendData = (data: unknown) => { connection.current?.send(data); }

  const connectId = (id: string) => { 
    const conn = peerInstance.current?.connect(id); 

    connection.current = conn;

    if(conn) {
      setupConnection(conn, ConnectionSource.LOCAL);
    }

  }

  const setupConnection = (conn: DataConnection, source: ConnectionSource) => {
    conn.on('open', () => {
      onConnOpen(conn, sendData, source);
      setConnState(ConnectionState.CONNECTED);
    })
    conn.on('close', () => {
      console.log('closing connection');
      onConnClose();
      setConnState(ConnectionState.DISCONNECTED);  
    });
    conn.on('error', (err) => {
      console.log(err);
    })
    
  }

  useEffect(() => {
    const peer = new Peer();
    
    peer.on('open', (id) => {
      onPeerOpen(connectId);
      setPeerId(id);
      setConnState(ConnectionState.DISCONNECTED);
    })

    peer.on('connection', (conn) => {
      setupConnection(conn, ConnectionSource.REMOTE);
      connection.current = conn;
    });

    peer.on('close', () => { 
      setPeerId('');
      setConnState(ConnectionState.INITIALISING); 
    });

    const handleBeforeUnload = () => { connection.current?.close() }

    window.addEventListener('beforeunload', handleBeforeUnload);

    peerInstance.current = peer;

    return () => { peer?.destroy(); connection.current?.close(); window.removeEventListener('beforeunload', handleBeforeUnload); }

  },[]);

  return { peerId, connState, connectId, sendData }
}

export default usePeer;