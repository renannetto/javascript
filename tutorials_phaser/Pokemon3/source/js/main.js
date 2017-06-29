var Pokemon = Pokemon || {};


var game = new Phaser.Game(320, 640, Phaser.CANVAS);

game.caught_pokemon = this.game.caught_pokemon || [];
game.number_of_pokeballs = this.game.number_of_pokeballs || {pokeball: 0, greatball: 1, ultraball: 2};

game.state.add("BootState", new Pokemon.BootState());
game.state.add("LoadingState", new Pokemon.LoadingState());
game.state.add("TitleState", new Pokemon.TitleState());
game.state.add("WorldState", new Pokemon.WorldState());
game.state.add("CatchState", new Pokemon.CatchState());
game.state.start("BootState", true, false, "assets/levels/title_screen.json", "TitleState");