/*
  Acts as an network interface between server asnd client.
*/

import {Socket} from "phoenix";
import { SOCKET_URL_DEV } from "../Constants";

export class NetworkManager {
    public static eventEmitter: Phaser.Events.EventEmitter;
    private static socket: Socket;
    private static playerId: string;
    private static worldChannel: any;
    public static init(): void {
        this.playerId = "watcher_anon_" + Math.floor(Math.random() * 1000);
        this.eventEmitter = new Phaser.Events.EventEmitter();
        this.socket = new Socket(SOCKET_URL_DEV, {userId: this.playerId}) 
        this.socket.connect();
    }

    public static joinWorld(): void {
        this.worldChannel = this.socket.channel("world:demo", {userId: this.playerId})
        this.worldChannel.on("new_msg", msg => console.log("Got message", msg) )
        
        this.worldChannel.join()
          .receive("ok", ({messages}) => console.log("Joined WorldChannel Success", messages) )
          .receive("error", ({reason}) => console.log("failed to join WorldChannel", reason) )
          .receive("timeout", () => console.log("Networking issue. Timeout."))
        
        this.registerEvents();
    }

    private static registerEvents() {
        this.worldChannel.on("player_joined", this.onPlayerJoined.bind(this))
    }

    private static onPlayerJoined(msg: any): void {
        console.log("On player joined", msg);
        this.eventEmitter.emit("player_joined", msg.position);
    }
}