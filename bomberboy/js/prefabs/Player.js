var Bomberboy = Bomberboy || {};

Bomberboy.Player = function (game_state, name, position, properties) {
    "use strict";
    Bomberboy.Prefab.call(this, game_state, name, position, properties);
    
    this.anchor.setTo(0.5);
    
    this.walking_speed = +properties.walking_speed;
    this.number_of_lives = +properties.number_of_lives;
    
    this.animations.add("walking_down", [1, 2, 3], 10, true);
    this.animations.add("walking_left", [4, 5, 6, 7], 10, true);
    this.animations.add("walking_right", [4, 5, 6, 7], 10, true);
    this.animations.add("walking_up", [0, 8, 9], 10, true);
    
    this.stopped_frames = [1, 4, 4, 0, 1];

    this.game_state.game.physics.arcade.enable(this);
    this.body.setSize(14, 12, 0, 4);
    
    this.movement = {left: false, right: false, up: false, down: false};
    
    this.initial_position = new Phaser.Point(this.x, this.y);
    
    this.current_bomb_index = 0;
    this.MAXIMUM_NUMBER_OF_BOMBS = 3;
};

Bomberboy.Player.prototype = Object.create(Bomberboy.Prefab.prototype);
Bomberboy.Player.prototype.constructor = Bomberboy.Player;

Bomberboy.Player.prototype.update = function () {
    "use strict";
    this.game_state.game.physics.arcade.collide(this, this.game_state.layers.walls);
    this.game_state.game.physics.arcade.collide(this, this.game_state.layers.blocks);
    this.game_state.game.physics.arcade.collide(this, this.game_state.groups.bombs);
    this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.explosions, this.die, null, this);
    this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.enemies, this.die, null, this);
    
    if (this.movement.left && this.body.velocity.x <= 0) {
        // move left
        this.body.velocity.x = -this.walking_speed;
        if (this.body.velocity.y === 0) {
            // change the scale, since we have only one animation for left and right directions
            this.scale.setTo(-1, 1);
            this.animations.play("walking_left");
        }
    } else if (this.movement.right && this.body.velocity.x >= 0) {
        // move right
        this.body.velocity.x = +this.walking_speed;
        if (this.body.velocity.y === 0) {
            // change the scale, since we have only one animation for left and right directions
            this.scale.setTo(1, 1);
            this.animations.play("walking_right");
        }
    } else {
        this.body.velocity.x = 0;
    }

    if (this.movement.up && this.body.velocity.y <= 0) {
        // move up
        this.body.velocity.y = -this.walking_speed;
        if (this.body.velocity.x === 0) {
            this.animations.play("walking_up");
        }
    } else if (this.movement.down && this.body.velocity.y >= 0) {
        // move down
        this.body.velocity.y = +this.walking_speed;
        if (this.body.velocity.x === 0) {
            this.animations.play("walking_down");
        }
    } else {
        this.body.velocity.y = 0;
    }
    
    if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
        // stop current animation
        this.animations.stop();
        this.frame = this.stopped_frames[this.body.facing];
    }
};

Bomberboy.Player.prototype.change_movement = function (direction_x, direction_y, move) {
    "use strict";
    if (direction_x < 0) {
        this.movement.left = move;
    } else if (direction_x > 0) {
        this.movement.right = move;
    }
    
    if (direction_y < 0) {
        this.movement.up = move;
    } else if (direction_y > 0) {
        this.movement.down = move;
    }
};

Bomberboy.Player.prototype.try_dropping_bomb = function () {
    "use strict";
    var colliding_bombs;
    // if it is possible to drop another bomb, try dropping it
    if (this.current_bomb_index < this.MAXIMUM_NUMBER_OF_BOMBS) {
        colliding_bombs = this.game_state.game.physics.arcade.getObjectsAtLocation(this.x, this.y, this.game_state.groups.bombs);
        // drop the bomb only if it does not collide with another one
        if (colliding_bombs.length === 0) {
            this.drop_bomb(this.position);
        }
    }
};

Bomberboy.Player.prototype.drop_bomb = function (position) {
    "use strict";
    var bomb, bomb_name, bomb_properties;
    // get the first dead bomb from the pool
    bomb_name = this.name + "_bomb_" + this.game_state.groups.bombs.countLiving();
    bomb_properties = {"texture": "bomb_spritesheet", "group": "bombs", bomb_radius: 3, owner: this};
    bomb = Bomberboy.create_prefab_from_pool(this.game_state.groups.bombs, Bomberboy.Bomb.prototype.constructor, this.game_state, bomb_name, position, bomb_properties);
    this.current_bomb_index += 1;
};

Bomberboy.Player.prototype.die = function () {
    "use strict";
    // decrease the number of lives
    this.number_of_lives -= 1;
    if (this.number_of_lives <= 0) {
        // if there are no more lives, it's game over
        this.kill();
        this.game_state.game_over();
    } else {
        // if there are remaining lives, restart the player position
        this.reset(this.initial_position.x, this.initial_position.y);
    }
};
