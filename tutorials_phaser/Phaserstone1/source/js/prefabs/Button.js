var Phaserstone = Phaserstone || {};

Phaserstone.Button = function (game_state, name, position, properties) {
    "use strict";
    Phaser.Button.call(this, game_state.game, position.x, position.y, properties.texture, this[properties.callback], this);
    
    this.game_state = game_state;
    
    this.name = name;
    
    this.game_state.groups[properties.group].add(this);
    this.frame = +properties.frame;
    
    if (properties.anchor) {
        this.anchor.setTo(properties.anchor.x, properties.anchor.y);
    }
    
    if (properties.scale) {
        this.scale.setTo(properties.scale.x, properties.scale.y);
    }
    
    this.game_state.prefabs[name] = this;
};

Phaserstone.Button.prototype = Object.create(Phaser.Button.prototype);
Phaserstone.Button.prototype.constructor = Phaserstone.Button;