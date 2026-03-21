import Peer, { type DataConnection } from "peerjs";
import { useState, useEffect, useRef } from "react";
import { ConnectionSource, ConnectionState } from "../types/Connection";
import { PlayerType } from "../types/Board";

const usePeer = (onConnOpen: (conn: DataConnection, sendData: (data: any) => void, source: ConnectionSource) => void) => {
  const peerInstance = useRef<Peer | null>(null);
  const connection = useRef<DataConnection | undefined>(undefined);
  const [peerId, setPeerId] = useState<string>('');
  const [connState, setConnState] = useState<ConnectionState>(ConnectionState.INITIALISING);

  const sendData = (data: unknown) => { connection.current?.send(data); }

  const connectId = (id: string) => { 
    const conn = peerInstance.current?.connect(id, {
      metadata: {
        player: PlayerType.CROSSES
    }}); 

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
      setConnState(ConnectionState.DISCONNECTED);  
    });
    
  }

  useEffect(() => {
    const peer = new Peer({debug: 3});
    
    peer.on('open', (id) => {
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

    peerInstance.current = peer;

    return () => { peer?.destroy(); }

  },[]);

  return { peerId, connState, connectId, sendData }
}

export default usePeer;