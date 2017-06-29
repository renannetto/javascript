var RPG = RPG || {};

var config = {
    apiKey: "AIzaSyDeH6QKtjo-P3SvQ-kL0ry7-0wexoilSS4",
    authDomain: "phaser-rpg.firebaseapp.com",
    databaseURL: "https://phaser-rpg.firebaseio.com",
    projectId: "phaser-rpg",
    storageBucket: "phaser-rpg.appspot.com",
    messagingSenderId: "30038961490"
  };
firebase.initializeApp(config);

var game = new Phaser.Game(640, 480, Phaser.CANVAS);

game.inventory = new RPG.Inventory();

game.state.add("BootState", new RPG.BootState());
game.state.add("LoadingState", new RPG.LoadingState());
game.state.add("TitleState", new RPG.TitleState());
game.state.add("WorldState", new RPG.WorldState());
game.state.add("BattleState", new RPG.BattleState());
game.state.add("PauseState", new RPG.PauseState());
game.state.start("BootState", true, false, "assets/levels/title_screen.json", "TitleState");