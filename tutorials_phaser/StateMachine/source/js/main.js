var StateMachineExample = StateMachineExample || {};

var game = new Phaser.Game(720, 350, Phaser.CANVAS);
game.state.add("BootState", new StateMachineExample.BootState());
game.state.add("LoadingState", new StateMachineExample.LoadingState());
game.state.add("DemoState", new StateMachineExample.DemoState());
game.state.start("BootState", true, false, "assets/levels/demo_level.json", "DemoState");