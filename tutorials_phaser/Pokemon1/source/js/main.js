var Pokemon = Pokemon || {};

var game = new Phaser.Game(320, 640, Phaser.CANVAS);
game.state.add("BootState", new Pokemon.BootState());
game.state.add("LoadingState", new Pokemon.LoadingState());
game.state.add("WorldState", new Pokemon.WorldState());
game.state.add("CatchState", new Pokemon.CatchState());
game.state.start("BootState", true, false, "assets/levels/world_level.json", "WorldState");