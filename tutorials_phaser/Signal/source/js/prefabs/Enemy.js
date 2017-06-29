var SignalExample = SignalExample || {};

SignalExample.Enemy = function (game_state, name, position, properties) {
    "use strict";
    SignalExample.Prefab.call(this, game_state, name, position, properties);
    
    this.anchor.setTo(0.5);
    
    this.game_state.game.physics.arcade.enable(this);
    
    this.velocity = properties.velocity;
    this.body.velocity.y = this.velocity;
    
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    
    this.bullet_velocity = properties.bullet_velocity;
    
    // create and start shoot timer
    this.shoot_timer = this.game_state.game.time.create();
    this.shoot_timer.loop(Phaser.Timer.SECOND / properties.shoot_rate, this.shoot, this);
    this.shoot_timer.start();
};

SignalExample.Enemy.prototype = Object.create(Phaser.Sprite.prototype);
SignalExample.Enemy.prototype.constructor = SignalExample.Enemy;

SignalExample.Enemy.prototype.update = function () {
    "use strict";
    // die if touches player bullets
    this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.player_bullets, this.kill, null, this);
};

SignalExample.Enemy.prototype.kill = function () {
    "use strict";
    Phaser.Sprite.prototype.kill.call(this);
    // stop shooting
    this.shoot_timer.pause();
};

SignalExample.Enemy.prototype.reset = function (x, y) {
    "use strict";
    Phaser.Sprite.prototype.reset.call(this, x, y);
    this.body.velocity.y = this.velocity;
    this.shoot_timer.resume();
};

SignalExample.Enemy.prototype.shoot = function () {
    "use strict";
    var bullet, bullet_position, bullet_name, bullet_properties;
    // check if there is a dead bullet to reuse
    bullet = this.game_state.groups.enemy_bullets.getFirstDead();
    bullet_position = new Phaser.Point(this.x, this.y);
    if (bullet) {
        // if there is a dead bullet reset it to the current position
        bullet.reset(bullet_position.x, bullet_position.y);
    } else {
        // if there is no dead bullet, create a new one
        bullet_name = this.name + "_bullet" + this.game_state.groups.enemy_bullets.countLiving();
        bullet_properties = {texture: "bullet_image", group: "enemy_bullets", direction: 1, velocity: this.bullet_velocity};
        bullet = new SignalExample.Bullet(this.game_state, bullet_name, bullet_position, bullet_properties);
    }
};