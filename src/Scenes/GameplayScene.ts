/* 
  Core gameplay rendering 
*/

import { Scene } from "phaser";
import { NetworkManager } from "../Classes/NetworkManager";
import { WorldManager } from "../Classes/WorldManager";
import { GAME_HEIGHT, GAME_WIDTH, TILE_SIZE, WORLD_HEIGHT, WORLD_WIDTH } from "../Constants";
import { Button } from "../Containers/button";
import { Player } from "../Containers/Player";
import { WorldTiles } from "../Utils/Enum";
import { ICoords } from "../Utils/Interfaces";

export default class GameplayScene extends Scene {
  private gridTileMatrix: Phaser.GameObjects.Image[][] = [];
  private player: Player = undefined;
  private enemyObj = {};
  public constructor() {
    super({
      key: "GameplayScene"
    })
  }

  public create(): void {
    // console.log("Gameplay Scene");
    NetworkManager.init();
    NetworkManager.joinWorld();
    NetworkManager.eventEmitter.on("player_joined", this.onPlayerJoined, this);
    NetworkManager.eventEmitter.on("move_updated", this.onMoveUpdated, this);
    NetworkManager.eventEmitter.on("player_died", this.onPlayerDied, this)
    NetworkManager.eventEmitter.on("player_respawn", this.onPlayerRespawn, this);
    NetworkManager.eventEmitter.on("player_left", this.onPlayerLeft, this)


    this.renderWorld();
    this.renderButtons();
  }  
  
  private renderWorld(): void {
    // console.log("Rendering world...");
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

  private getActualPositoin(row: number, col: number): ICoords {
    return {x: this.gridTileMatrix[row][col].x, y:this.gridTileMatrix[row][col].y} 
  }

  private onPlayerJoined(playersData: any[]) {
    for(let i = 0; i < playersData.length; i++) {
      const pos = playersData[i].position;
      if(playersData[i].id === NetworkManager.playerId) {
        if (!this.player) {
          this.player = new Player(this, this.getActualPositoin(pos.row, pos.col), WorldTiles.Player,
          playersData[i].id);
        }
      } else {
        if (!this.enemyObj[playersData[i].id]) {
          const enemy = new Player(this, this.getActualPositoin(pos.row, pos.col), WorldTiles.Enemy,
          playersData[i].id);
          this.enemyObj[playersData[i].id] = enemy;
        }
      }
    }
  }

  private renderButtons(): void {
    const leftButton = new Button(this, {x: 100 + 20, y: 980}, "Left");
    const rightButton = new Button(this, {x: 220 + 20, y: 980}, "Right");
    const upButton = new Button(this, {x: 340 + 20, y: 980}, "Up");
    const downButton = new Button(this, {x: 460 + 20, y: 980}, "Down");
    const attackButton = new Button(this, {x: 580 + 20, y: 980}, "Attack");
  }

  private onMoveUpdated(playerData: any): void {
    const position = playerData.position;
    if (playerData.id === NetworkManager.playerId) {
      this.player.updatePosition(this.getActualPositoin(position.row, position.col))
    } else {
      const enemy = this.enemyObj[playerData.id] as Player;
      if (enemy) {
        enemy.updatePosition(this.getActualPositoin(position.row, position.col));
      }
    }
    this.player.setDepth(100);
  }

  private onPlayerDied(id: string): void {
    if (id === NetworkManager.playerId) {
      this.player.visible = false;
      NetworkManager.isInputEnabled = false;
    } else {
      const enemy = this.enemyObj[id] as Player;
      if (enemy) {
        enemy.visible = false;
      }
    }
  }

  private onPlayerRespawn(playerData: any): void {
    const position = playerData.position;
    if (playerData.id === NetworkManager.playerId) {
      this.player.updatePosition(this.getActualPositoin(position.row, position.col))
      this.player.visible = true;
      NetworkManager.isInputEnabled = true;
    } else {
      const enemy = this.enemyObj[playerData.id] as Player;
      if (enemy) {
        enemy.updatePosition(this.getActualPositoin(position.row, position.col));
        enemy.visible = true;
      }
    }
  }

  private onPlayerLeft(id: string): void {
      const enemy = this.enemyObj[id] as Player;
      if (enemy) {
        enemy.visible = false;
      }
  }

}
