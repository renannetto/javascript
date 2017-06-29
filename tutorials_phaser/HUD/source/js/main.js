var HUDExample = HUDExample || {};

var game = new Phaser.Game(600, 600, Phaser.CANVAS);
game.state.add("BootState", new HUDExample.BootState());
game.state.add("LoadingState", new HUDExample.LoadingState());
game.state.add("WorldState", new HUDExample.WorldState());
game.state.start("BootState", true, false, "assets/levels/world_level.json", "WorldState");