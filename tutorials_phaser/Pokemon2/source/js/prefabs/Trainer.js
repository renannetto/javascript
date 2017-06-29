var Pokemon = Pokemon || {};

Pokemon.Trainer = function (game_state, name, position, properties) {
    "use strict";
    var rotate_tween;
    Pokemon.Prefab.call(this, game_state, name, position, properties);
    
    this.walking_speed = +properties.walking_speed;
    
    this.animations.add("walking_down", [0, 1, 2, 3], 10, true);
    this.animations.add("walking_up", [4, 5, 6, 7], 10, true);
    this.animations.add("walking_right", [8, 9, 10, 11], 10, true);
    this.animations.add("walking_left", [12, 13, 14, 15], 10, true);
    
    this.stopped_frames = [0, 8, 12, 4, 0];
    
    this.game_state.game.physics.p2.enable(this);
    
    this.game_state.game.input.onDown.add(this.move_to, this);
    
    this.target_position = new Phaser.Point(this.position.x, this.position.y);
};

Pokemon.Trainer.prototype = Object.create(Pokemon.Prefab.prototype);
Pokemon.Trainer.prototype.constructor = Pokemon.Trainer;

Pokemon.Trainer.prototype.update = function () {
    "use strict";
    var direction_y, direction_x;
    
    if (Math.abs(this.position.y - this.target_position.y) > 1) {
        direction_y = (this.position.y < this.target_position.y) ? 1 : -1;
        this.body.velocity.x = 0;
        this.body.velocity.y = direction_y * this.walking_speed;
    } else if (Math.abs(this.position.x - this.target_position.x) > 1) {
        direction_x = (this.position.x < this.target_position.x) ? 1 : -1;
        this.body.velocity.x = direction_x * this.walking_speed;
        this.body.velocity.y = 0;
    } else {
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
    }
    
    if (this.body.velocity.y > 0) {
        this.animations.play("walking_down");
    } else if (this.body.velocity.y < 0) {
        this.animations.play("walking_up");
    } else if (this.body.velocity.x > 0) {
        this.animations.play("walking_right");
    } else if (this.body.velocity.x < 0) {
        this.animations.play("walking_left");
    } else {
        this.animations.stop();
        this.frame = this.stopped_frames[this.body.facing];
    }
};

Pokemon.Trainer.prototype.move_to = function (pointer) {
    "use strict";
    this.target_position.x = Math.round(pointer.position.x);
    this.target_position.y = Math.round(pointer.position.y);
};
