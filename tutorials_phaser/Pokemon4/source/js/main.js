var Pokemon = Pokemon || {};

var config = {
    apiKey: "AIzaSyAx4NNN2oIYxHWS8H4Uhom4EgN0VpugWlc",
    authDomain: "phasermon-go.firebaseapp.com",
    databaseURL: "https://phasermon-go.firebaseio.com",
    storageBucket: "phasermon-go.appspot.com",
    messagingSenderId: "375905605428"
};
firebase.initializeApp(config);

var game = new Phaser.Game(320, 640, Phaser.CANVAS);

game.state.add("BootState", new Pokemon.BootState());
game.state.add("LoadingState", new Pokemon.LoadingState());
game.state.add("TitleState", new Pokemon.TitleState());
game.state.add("WorldState", new Pokemon.WorldState());
game.state.add("CatchState", new Pokemon.CatchState());
game.state.start("BootState", true, false, "assets/levels/title_screen.json", "TitleState");