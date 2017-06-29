var Bomberboy = Bomberboy || {};

var firebase = new Firebase("https://bomberboy.firebaseio.com/");

var game = new Phaser.Game(240, 240, Phaser.CANVAS);
game.state.add("BootState", new Bomberboy.BootState());
game.state.add("LoadingState", new Bomberboy.LoadingState());
game.state.add("TitleState", new Bomberboy.TitleState());
game.state.add("TiledState", new Bomberboy.TiledState());
game.state.add("LobbyState", new Bomberboy.LobbyState());
game.state.add("BattleState", new Bomberboy.BattleState());
game.state.start("BootState", true, false, "assets/levels/title_screen.json", "TitleState");