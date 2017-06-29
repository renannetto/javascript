var StateMachineExample = StateMachineExample || {};

StateMachineExample.WalkingState = function (name, prefab, direction, walking_speed) {
    "use strict";
    StateMachineExample.State.call(this, name, prefab);
    
    this.walking_animation = this.prefab.animations.add("walking", [0, 1, 2, 1], 6, true);
    
    this.direction = direction;
    this.walking_speed = walking_speed;
};

StateMachineExample.WalkingState.prototype = Object.create(StateMachineExample.State.prototype);
StateMachineExample.WalkingState.prototype.constructor = StateMachineExample.WalkingState;

StateMachineExample.WalkingState.prototype.enter = function () {
    "use strict";
    // start animation and set velocity
    this.walking_animation.play();
    this.prefab.body.velocity.x = this.direction * this.walking_speed;
    
    if (this.direction === 1) {
        this.prefab.scale.setTo(-1, 1);
    } else {
        this.prefab.scale.setTo(1, 1);
    }
};

StateMachineExample.WalkingState.prototype.exit = function () {
    "use strict";
    // stop animation and set velocity to zero
    this.walking_animation.stop();
};

StateMachineExample.WalkingState.prototype.handle_input = function (command) {
    "use strict";
    switch (command.name) {
    case "stop":
        return "standing";
    case "jump":
        return "jumping";
    }
    StateMachineExample.State.prototype.handle_input.call(this, command);
};