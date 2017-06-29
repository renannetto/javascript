var Bomberboy = Bomberboy || {};

Bomberboy.Enemy = function (game_state, name, position, properties) {
    "use strict";
    Bomberboy.Prefab.call(this, game_state, name, position, properties);
    
    this.anchor.setTo(0.5);
    
    this.walking_speed = +properties.walking_speed;
    this.moving_radius = +properties.moving_radius;
    
    this.game_state.game.physics.arcade.enable(this);
    this.body.setSize(12, 12);
    
    this.animations.add("walking_down", [1, 2, 3], 10, true);
    this.animations.add("walking_left", [4, 5, 6, 7], 10, true);
    this.animations.add("walking_right", [4, 5, 6, 7], 10, true);
    this.animations.add("walking_up", [0, 8, 9], 10, true);
    
    this.stopped_frames = [1, 4, 4, 0, 1];
    
    this.path = [];
};

Bomberboy.Enemy.prototype = Object.create(Bomberboy.Prefab.prototype);
Bomberboy.Enemy.prototype.constructor = Bomberboy.Enemy;

Bomberboy.Enemy.prototype.update = function () {
    "use strict";
    var current_target, velocity;
    this.game_state.game.physics.arcade.collide(this, this.game_state.layers.walls);
    this.game_state.game.physics.arcade.collide(this, this.game_state.layers.blocks);
    this.game_state.game.physics.arcade.collide(this, this.game_state.groups.bombs);
    this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.explosions, this.kill, null, this);
    
    if (this.path.length === 0) {
        this.stop();
        this.move();
    } else {
        current_target = this.path[0];
        if (current_target.distance(this.position) < 0.1) {
            this.path.shift();
        } else {
            velocity = Phaser.Point.subtract(current_target, this.position);
            velocity.normalize();
            this.body.velocity.x = velocity.x * this.walking_speed;
            this.body.velocity.y = velocity.y * this.walking_speed;
        }
    }
    
    this.play_animation();
};

Bomberboy.Enemy.prototype.move = function () {
    "use strict";
    var movement, target_position;
    movement = new Phaser.Point(this.game_state.game.rnd.between(-this.moving_radius, this.moving_radius),
                                this.game_state.game.rnd.between(-this.moving_radius, this.moving_radius));
    target_position = new Phaser.Point(this.position.x + movement.x, this.position.y + movement.y);
    this.move_to_target(target_position);
};

Bomberboy.Enemy.prototype.move_to_target = function (position) {
    "use strict";
    this.game_state.pathfinding.find_path(this.position, position, function (path) {
        this.path = path;
    }, this);
};

Bomberboy.Enemy.prototype.stop = function () {
    "use strict";
    this.path = [];
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;    
};

Bomberboy.Enemy.prototype.play_animation = function () {
    "use strict";
    if (Math.abs(this.body.velocity.x) > Math.abs(this.body.velocity.y)) {    
        if (this.body.velocity.x < 0) {
            // walking left
            this.scale.setTo(-1, 1);
            this.animations.play("walking_left");
        } else if (this.body.velocity.x > 0) {
            // walking right
            this.scale.setTo(1, 1);
            this.animations.play("walking_right");
        }
    } else {   
        if (this.body.velocity.y < 0) {
            // walking up
            this.animations.play("walking_up");
        } else if (this.body.velocity.y > 0) {
            // walking down
            this.animations.play("walking_down");
        }
    }
    
    
    if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
        // stop current animation
        this.animations.stop();
        this.frame = this.stopped_frames[this.body.facing];
    }
};