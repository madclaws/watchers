/* 
    Handles rendering of buttons
*/

import { Scene } from "phaser";
import { NetworkManager } from "../Classes/NetworkManager";
import { WorldManager } from "../Classes/WorldManager";
import { TILE_SIZE } from "../Constants";
import { WorldTiles } from "../Utils/Enum";
import { ICoords } from "../Utils/Interfaces";

export class Button extends Phaser.GameObjects.Container {
    private buttonTexture: Phaser.GameObjects.Image;
    private coords: ICoords;
    private action: string;
    public constructor(scene: Scene, position: ICoords, action: string) {
        super(scene, position.x, position.y);
        this.coords = position;
        this.action = action;
        this.create();
    }

    private create(): void {
        this.setSize(68 * 1.5, 34 * 1.5);
        this.renderBtn();
        this.renderText()
        this.scene.add.existing(this);
    }

    private renderBtn(): void {
        let texture: string = "btn_normal";
        if(this.action === "Attack") {
            texture = "btn_attack";
        }
        this.buttonTexture = this.scene.add.image(0, 0, texture);
        this.setInteractive();
        this.on("pointerup", this.onClick.bind(this));
        this.buttonTexture.setScale(1.5, 1.5);
        this.add(this.buttonTexture);
    }

    private renderText(): void {

        let color = "#000000";
        if(this.action === "Attack") {
            color = "#ffffff";
        }
        const text: Phaser.GameObjects.Text = this.scene.add.text(0, 0, this.action,
        {fontFamily: "FORVERTZ", fontSize: "20px", color: color});
        text.setOrigin(0.5);
        this.add(text);
    }

    private onClick(): void {
        console.log(this.action);
        NetworkManager.sendMessage("player_move", this.action);
    }
}