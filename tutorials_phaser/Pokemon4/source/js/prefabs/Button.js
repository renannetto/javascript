var Pokemon = Pokemon || {};

Pokemon.Button = function (game_state, name, position, properties) {
    "use strict";
    Phaser.Button.call(this, game_state.game, position.x, position.y, properties.texture, game_state[properties.callback], game_state);
    
    this.game_state = game_state;
    
    this.name = name;
    
    this.game_state.groups[properties.group].add(this);
    
    if (properties.anchor) {
        this.anchor.setTo(properties.anchor.x, properties.anchor.y);
    }
    if (properties.scale) {
        this.scale.setTo(properties.scale.x, properties.scale.y);
    }
    
    this.game_state.prefabs[name] = this;
};

Pokemon.Button.prototype = Object.create(Phaser.Button.prototype);
Pokemon.Button.prototype.constructor = Pokemon.Button;