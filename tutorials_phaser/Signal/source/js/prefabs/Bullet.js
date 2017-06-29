var SignalExample = SignalExample || {};

SignalExample.Bullet = function (game_state, name, position, properties) {
    "use strict";
    SignalExample.Prefab.call(this, game_state, name, position, properties);
    
    this.anchor.setTo(0.5);
    
    this.game_state.game.physics.arcade.enable(this);
    
    this.body.velocity.y = properties.direction * properties.velocity;
};

SignalExample.Bullet.prototype = Object.create(Phaser.Sprite.prototype);
SignalExample.Bullet.prototype.constructor = SignalExample.Bullet;