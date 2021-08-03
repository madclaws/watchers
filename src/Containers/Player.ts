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
    public constructor(scene: Scene, position: ICoords, tileIndex: WorldTiles) {
        super(scene, position.x, position.y);
        this.coords = position;
        this.create(tileIndex);
    }

    public updatePosition(position: ICoords): void {
        this.setPosition(position.x, position.y);
    }

    private create(tileIndex: WorldTiles): void {
        this.setSize(TILE_SIZE, TILE_SIZE);
        this.renderPlayer(tileIndex);
        this.scene.add.existing(this);
    }

    private renderPlayer(tileIndex: WorldTiles): void {
        const tileTexture: string = WorldManager.getTileTexture(tileIndex);
        this.playerTexture = this.scene.add.image(0, 0, tileTexture);
        this.add(this.playerTexture);
    }
}