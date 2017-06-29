var SignalExample = SignalExample || {};

var game = new Phaser.Game(360, 640, Phaser.CANVAS);
game.state.add("BootState", new SignalExample.BootState());
game.state.add("LoadingState", new SignalExample.LoadingState());
game.state.add("LevelState", new SignalExample.LevelState());
game.state.start("BootState", true, false, "assets/levels/level1.json", "LevelState");