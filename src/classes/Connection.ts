import Peer from "peerjs";

export class Connection {
  peer: Peer;
  id: string;

  constructor() {
    this.id = '';
    this.peer = new Peer();
  }
}