/* 
    Handles rendering of Player
*/

import { Scene } from "phaser";
import { WorldManager } from "../Classes/WorldManager";
import { TILE_SIZE } from "../Constants";
import { WorldTiles } from "../Utils/Enum";
import { ICoords } from "../Utils/Interfaces";

export class Player extends Phaser.GameObjects.Container {
    private playerTexture: Phaser.GameObjects.Image;
    private coords: ICoords;
    private playerId: string;
    private tileIndex: WorldTiles;
    public constructor(scene: Scene, position: ICoords, tileIndex: WorldTiles, playerId: string) {
        super(scene, position.x, position.y);
        this.coords = position;
        this.playerId = playerId;
        this.tileIndex = tileIndex;
        this.create(tileIndex);
    }

    public updatePosition(position: ICoords): void {
        this.setPosition(position.x, position.y);
    }

    public getId(): string {
        return this.playerId;
    }

    private create(tileIndex: WorldTiles): void {
        this.setSize(TILE_SIZE, TILE_SIZE);
        this.renderPlayer(tileIndex);
        this.renderText();
        this.scene.add.existing(this);
    }

    private renderPlayer(tileIndex: WorldTiles): void {
        const tileTexture: string = WorldManager.getTileTexture(tileIndex);
        this.playerTexture = this.scene.add.image(0, 0, tileTexture);
        this.add(this.playerTexture);
    }

    private renderText(): void {
        const text: Phaser.GameObjects.Text = this.scene.add.text(0, 0, this.playerId,
        {fontFamily: "FORVERTZ", fontSize: "20px", color: "#000000"});
        text.setOrigin(0.5);
        this.add(text);
    }
}