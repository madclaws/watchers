/* 
  Scene that manages Core game asset loading.
*/

import { Scene } from "phaser";
import { GAME_HEIGHT, GAME_WIDTH } from "../Constants";

export default class LoadScene extends Scene {
  private progressBar: Phaser.GameObjects.Image;
  public constructor() {
    super({
      key: "LoadScene"
    });
  }

  public preload(): void {
    console.log("On loadscene preload")
    this.renderLoader();
		this.load.crossOrigin = "anonymous";
		// this.loadImages();
		// this.loadAudio();
		this.load.on("progress", this.onFileComplete.bind(this));
		this.load.on("complete", this.onAllFilesLoaded.bind(this));
    this.onAllFilesLoaded();
  }

  private loadImages(): void {
    console.log("load images");
    // TODO => Remove the temp asset
    this.load.image("logo", "assets/images_dev/logo.png");
    // this.load.atlas("atlas", "assets/images/atlas.png", "assets/images/atlas.json");
  }

  private loadAudio(): void {
  }

  private onFileComplete(progress: number): void {
    console.log("On file complete");
    if (this.progressBar.scaleX < progress) {
      this.progressBar.scaleX = progress;
    }
  }

  private onAllFilesLoaded(): void {
    this.scene.start("GameplayScene");
  }

  private renderLoader(): void {
    const logo: Phaser.GameObjects.Image = this.add.image(GAME_WIDTH / 2,
      GAME_HEIGHT / 2 - 150, "logo");
    this.progressBar = this.add.image(GAME_WIDTH / 2 - 250,
      GAME_HEIGHT / 2 + 100, "loader");
    const powered: Phaser.GameObjects.Text = this.add.text(GAME_WIDTH / 2,
      GAME_HEIGHT / 2 + 200, "powered by Garuda", {fontFamily: "FORVERTZ", fontSize: "50px",
    color: "#ffffff"});
    powered.setOrigin(0.5);
    this.progressBar.scaleX = 0;
    this.progressBar.scaleY = 0.8;
    this.progressBar.setOrigin(0, 0.5);
  }
  
  
}
