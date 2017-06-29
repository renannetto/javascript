var Tactics = Tactics || {};

var firebase = new Firebase("https://tactics-a6625.firebaseio.com/");

var game = new Phaser.Game(240, 240, Phaser.CANVAS);
game.state.add("BootState", new Tactics.BootState());
game.state.add("LoadingState", new Tactics.LoadingState());
game.state.add("TitleState", new Tactics.TitleState());
game.state.add("LobbyState", new Tactics.LobbyState());
game.state.add("PreparationState", new Tactics.PreparationState());
game.state.add("BattleState", new Tactics.BattleState());
game.state.start("BootState", true, false, "assets/levels/title_screen.json", "TitleState");