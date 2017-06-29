var Pokemon = Pokemon || {};

Pokemon.Prefab = function (game_state, name, position, properties) {
    "use strict";
    Phaser.Sprite.call(this, game_state.game, position.x, position.y, properties.texture);
    
    this.game_state = game_state;
    
    this.name = name;
    
    this.game_state.groups[properties.group].add(this);
    this.frame = +properties.frame;
    if (properties.anchor) {
        this.anchor.setTo(properties.anchor.x, properties.anchor.y);
    }
    
    this.game_state.prefabs[name] = this;
};

Pokemon.Prefab.prototype = Object.create(Phaser.Sprite.prototype);
Pokemon.Prefab.prototype.constructor = Pokemon.Prefab;