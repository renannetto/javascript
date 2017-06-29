var Phaserstone = Phaserstone || {};

var game = new Phaser.Game(1024, 1150, Phaser.CANVAS);
game.state.add("BootState", new Phaserstone.BootState());
game.state.add("LoadingState", new Phaserstone.LoadingState());
game.state.add("BoardState", new Phaserstone.BoardState());
game.state.start("BootState", true, false, "assets/levels/board_level.json", "BoardState");