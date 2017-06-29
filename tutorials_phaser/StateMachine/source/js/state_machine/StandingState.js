var StateMachineExample = StateMachineExample || {};

StateMachineExample.StandingState = function (name, prefab, frame) {
    "use strict";
    StateMachineExample.State.call(this, name, prefab);
    this.frame = frame;
};

StateMachineExample.StandingState.prototype = Object.create(StateMachineExample.State.prototype);
StateMachineExample.StandingState.prototype.constructor = StateMachineExample.StandingState;

StateMachineExample.StandingState.prototype.enter = function () {
    "use strict";
    // set standing frame and velocity to 0
    this.prefab.frame = this.frame;
    this.prefab.body.velocity.x = 0;
};

StateMachineExample.StandingState.prototype.handle_input = function (command) {
    "use strict";
    switch (command.name) {
    case "walk":
        if (command.direction === "left") {
            return "walking_left";
        } else {
            return "walking_right";
        }
    case "jump":
        return "jumping";
    }
    StateMachineExample.State.prototype.handle_input.call(this, command);
};