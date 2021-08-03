/* 
    Manages the world, its entites and gameplay.
*/

import { Scene } from "phaser";

export class WorldManager {
    private static worldGrid: number[][] = [];

    public static createWorldGrid(scene: Scene): number[][] {
        let data = scene.cache.json.get("world_level");
        // TODO -> Idealy we should fetch the world from server,
        // or atleast the other player positions.
        this.worldGrid = data.world;
        // console.log("World Level data => ", this.worldGrid);
        return this.worldGrid;
    }

    public static getTileTexture(tileIndex: number): string {
        let tileTexture: string = "";
        switch (tileIndex) {
            case 1:
                tileTexture = "wall";
                break;
            case 2:
                tileTexture = "walkable";
                break;
            case 3:
                tileTexture = "hero";
                break;
            case 4: 
                tileTexture = "enemy";
                break;
            default:
                throw new Error("Invalid tileIndex => " + tileIndex,);
                break;
        }
        return tileTexture;
    }
}

