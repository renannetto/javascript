var PathfindingExample = PathfindingExample || {};

var game = new Phaser.Game(320, 320, Phaser.CANVAS);
game.state.add("BootState", new PathfindingExample.BootState());
game.state.add("LoadingState", new PathfindingExample.LoadingState());
game.state.add("WorldState", new PathfindingExample.WorldState());
game.state.start("BootState", true, false, "assets/levels/level1.json", "WorldState");