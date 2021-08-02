/* 
  Entry Scene of the game.
  All event handlings and sdk initialization happens here.
*/

import { Scene } from "phaser";
export default class BootScene extends Scene {

  private crossHiddenString: string;
  private crossVisibilityString: string;
  public constructor() {
    super({
      key: "BootScene",
    });
  }

  public preload(): void {
    this.loadFont();
    this.load.image("logo", "assets/images_dev/logo.png");
    this.load.image("loader", "assets/images_dev/loader.png");
  }

  public create() {
	  this.scene.start("LoadScene");
  }

  
  private loadFont() {
	const loadLabel: Phaser.GameObjects.Text = this.add.text(-200,
	0, "B", {color: "#ffffff", fontFamily: "FORVERTZ",
	fontSize: "40px"});
 }
  
}
