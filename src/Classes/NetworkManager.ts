/*
  Acts as an network interface between server asnd client.
*/

import {Socket} from "phoenix";
import { SOCKET_URL_DEV } from "../Constants";

export class NetworkManager {
    public static eventEmitter: Phaser.Events.EventEmitter;
    private static socket: Socket;
    public static playerId: string;
    private static worldChannel: any;
    public static isInputEnabled: boolean = true;
    public static init(): void {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());
        this.playerId = "w_" + Math.floor(Math.random() * 1000);
        if (params.name) {
            this.playerId = params.name;
        }
        this.eventEmitter = new Phaser.Events.EventEmitter();
        this.socket = new Socket(SOCKET_URL_DEV, {params: {userId: this.playerId}}); 
        this.socket.connect();
    }

    public static joinWorld(): void {
        this.worldChannel = this.socket.channel("world:demo", {userId: this.playerId})
        
        this.worldChannel.join()
          .receive("ok", ({messages}) => console.log("Joined WorldChannel Success", messages) )
          .receive("error", ({reason}) => console.log("failed to join WorldChannel", reason) )
          .receive("timeout", () => console.log("Networking issue. Timeout."))
        
        this.registerEvents();
    }

    public static sendMessage(event: string, msg: any): void {
        this.worldChannel.push(event, msg);
    }

    private static registerEvents() {
        this.worldChannel.on("player_joined", this.onPlayerJoined.bind(this))
        this.worldChannel.on("move_updated", this.onMoveUpdated.bind(this))
        this.worldChannel.on("player_died", this.onPlayerDied.bind(this));
        this.worldChannel.on("player_respawned", this.onPlayerRespawn.bind(this));
        this.worldChannel.on("player_left", this.onPlayerLeft.bind(this));
        window.addEventListener("beforeunload", this.onClientUnload.bind(this));
        window.addEventListener("unload", this.onClientUnload.bind(this));
    }

    private static onPlayerJoined(msg: any): void {
        // console.log("On player joined", msg);
        this.eventEmitter.emit("player_joined", msg.players);
    }

    private static onMoveUpdated(msg: any): void {
        // console.log("On move updated", msg);
        this.eventEmitter.emit("move_updated", msg);
    }

    private static onPlayerDied(msg: any): void {
        // console.log("On player died", msg);
        this.eventEmitter.emit("player_died", msg.id);
    }

    private static onPlayerRespawn(msg: any): void {
        // console.log("On player respawn", msg);
        this.eventEmitter.emit("player_respawn", msg);
    }

    private static onPlayerLeft(msg: any): void {
        // console.log("On player left", msg);
        this.eventEmitter.emit("player_left", msg.id);
    }

    private static onClientUnload(): void {
        this.worldChannel.leave();
    }
}