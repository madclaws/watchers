/* 
  Core gameplay rendering 
*/

import { Scene } from "phaser";

export default class GameplayScene extends Scene {
  public constructor() {
    super({
      key: "GameplayScene"
    });
  }

  public create(): void {
    console.log("Gameplay Scene");
  }  

}
