var SignalExample = SignalExample || {};

SignalExample.Ship = function (game_state, name, position, properties) {
    "use strict";
    SignalExample.Prefab.call(this, game_state, name, position, properties);
    
    this.anchor.setTo(0.5);
    
    this.game_state.game.physics.arcade.enable(this);
    this.body.setSize(this.width * 0.3, this.height * 0.3);
    
    this.velocity = properties.velocity;
    this.bullet_velocity = properties.bullet_velocity;
    
    // create and start shoot timer
    this.shoot_timer = this.game_state.game.time.create();
    this.shoot_timer.loop(Phaser.Timer.SECOND / properties.shoot_rate, this.shoot, this);
    this.shoot_timer.start();
    
    // creating shooting event to be listened
    this.events.onShoot = new Phaser.Signal();
};

SignalExample.Ship.prototype = Object.create(Phaser.Sprite.prototype);
SignalExample.Ship.prototype.constructor = SignalExample.Ship;

SignalExample.Ship.prototype.update = function () {
    "use strict";
    var target_x;
    this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.enemy_bullets, this.kill, null, this);
    
    this.body.velocity.x = 0;
    // move the ship when the mouse is clicked
    if (this.game_state.game.input.activePointer.isDown) {
        // get the clicked position
        target_x = this.game_state.game.input.activePointer.x;
        if (target_x < this.x) {
            // if the clicked position is left to the ship, move left
            this.body.velocity.x = -this.velocity;
        } else if (target_x > this.x) {
            // if the clicked position is right to the ship, move right
            this.body.velocity.x = this.velocity;
        }
    }
};

SignalExample.Ship.prototype.kill = function () {
    "use strict";
    Phaser.Sprite.prototype.kill.call(this);
    // stop shoot timer
    this.shoot_timer.stop();
    // if the ship dies, it is game over
    this.game_state.game_over();
};

SignalExample.Ship.prototype.shoot = function () {
    "use strict";
    var bullet, bullet_position, bullet_name, bullet_properties;
    // check if there is a dead bullet to reuse
    bullet = this.game_state.groups.player_bullets.getFirstDead();
    bullet_position = new Phaser.Point(this.x, this.y);
    if (bullet) {
        // if there is a dead bullet reset it to the current position
        bullet.reset(bullet_position.x, bullet_position.y);
    } else {
        // if there is no dead bullet, create a new one
        bullet_name = this.name + "_bullet" + this.game_state.groups.player_bullets.countLiving();
        bullet_properties = {texture: "bullet_image", group: "player_bullets", direction: -1, velocity: this.bullet_velocity};
        bullet = new SignalExample.Bullet(this.game_state, bullet_name, bullet_position, bullet_properties);
    }
    
    // dispatch shoot event
    this.events.onShoot.dispatch(this);
};