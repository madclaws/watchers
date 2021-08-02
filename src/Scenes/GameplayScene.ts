/* 
  Core gameplay rendering 
*/

import { Scene } from "phaser";
import { NetworkManager } from "../Classes/NetworkManager";
import { WorldManager } from "../Classes/WorldManager";
import { GAME_HEIGHT, GAME_WIDTH, TILE_SIZE, WORLD_HEIGHT, WORLD_WIDTH } from "../Constants";
import { Player } from "../Containers/Player";
import { WorldTiles } from "../Utils/Enum";
import { ICoords } from "../Utils/Interfaces";

export default class GameplayScene extends Scene {
  private gridTileMatrix: Phaser.GameObjects.Image[][] = [];
  public constructor() {
    super({
      key: "GameplayScene"
    })
  }

  public create(): void {
    console.log("Gameplay Scene");
    NetworkManager.init();
    NetworkManager.joinWorld();
    NetworkManager.eventEmitter.on("player_joined", this.onPlayerJoined, this);
    this.renderWorld();
  }  
  
  private renderWorld(): void {
    console.log("Rendering world...");
    const worldGrid = WorldManager.createWorldGrid(this);
    const startY: number = (WORLD_HEIGHT/2) - (TILE_SIZE / 2);
    const startX: number = (GAME_WIDTH - WORLD_WIDTH) / 2 + (TILE_SIZE / 2 - 9);
    for (let i = 0; i < worldGrid.length; i++) {
      this.gridTileMatrix[i] = [];
      for (let j = 0; j < worldGrid[i].length; j++) {
        const tileTexture = WorldManager.getTileTexture(worldGrid[i][j]); 
        const tile: Phaser.GameObjects.Image = this.add.image(startX + (j * 66), startY + (i * 66), tileTexture);
        this.gridTileMatrix[i][j] = tile;
      }
    }
  }

  private renderPlayer(row: number, col: number): void {
    const player = new Player(this, this.getActualPositoin(row, col), WorldTiles.Player);
  }

  private getActualPositoin(row: number, col: number): ICoords {
    return {x: this.gridTileMatrix[row][col].x, y:this.gridTileMatrix[row][col].y} 
  }

  private onPlayerJoined(position: any) {
    this.renderPlayer(position.row, position.col)
  }


  


}
