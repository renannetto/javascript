var StateMachineExample = StateMachineExample || {};

StateMachineExample.Hero = function (game_state, name, position, properties) {
    "use strict";
    StateMachineExample.Prefab.call(this, game_state, name, position, properties);
    
    this.anchor.setTo(0.5);
    
    this.walking_speed = +properties.walking_speed;
    this.jumping_speed = +properties.jumping_speed;

    this.game_state.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    
    // create state machine and add states
    this.state_machine = new StateMachineExample.StateMachine();
    this.state_machine.add_state("standing", new StateMachineExample.StandingState("standing", this, 3));
    this.state_machine.add_state("walking_left", new StateMachineExample.WalkingState("walking_left", this, -1, this.walking_speed));
    this.state_machine.add_state("walking_right", new StateMachineExample.WalkingState("walking_left", this, 1, this.walking_speed));
    this.state_machine.add_state("jumping", new StateMachineExample.JumpingState("jumping", this, this.jumping_speed));
    this.state_machine.set_initial_state("standing");
    
    // add callbacks to keyboard events
    this.game_state.game.input.keyboard.addCallbacks(this, this.process_on_down_input, this.process_on_up_input, null);
};

StateMachineExample.Hero.prototype = Object.create(StateMachineExample.Prefab.prototype);
StateMachineExample.Hero.prototype.constructor = StateMachineExample.Hero;

StateMachineExample.Hero.prototype.update = function () {
    "use strict";
    this.game_state.game.physics.arcade.collide(this, this.game_state.layers.collision);
    
    // touching ground tile
    if (this.body.blocked.down) {
        this.state_machine.handle_input(new StateMachineExample.Command("fall", {}));
    }
};

StateMachineExample.Hero.prototype.process_on_down_input = function (event) {
    "use strict";
    switch (event.keyCode) {
    case Phaser.Keyboard.LEFT:
        // walk left
        this.state_machine.handle_input(new StateMachineExample.Command("walk", {direction: "left"}));
        break;
    case Phaser.Keyboard.RIGHT:
        // walk right
        this.state_machine.handle_input(new StateMachineExample.Command("walk", {direction: "right"}));
        break;
    case Phaser.Keyboard.UP:
        // jump
        this.state_machine.handle_input(new StateMachineExample.Command("jump", {}));
        break;
    }
};

StateMachineExample.Hero.prototype.process_on_up_input = function (event) {
    "use strict";
    switch (event.keyCode) {
    case Phaser.Keyboard.LEFT:
        this.state_machine.handle_input(new StateMachineExample.Command("stop", {}));
        break;
    case Phaser.Keyboard.RIGHT:
        this.state_machine.handle_input(new StateMachineExample.Command("stop", {}));
        break;
    }
};