var HUDExample = HUDExample || {};

HUDExample.Prefab = function (game_state, name, position, properties) {
    "use strict";
    Phaser.Sprite.call(this, game_state.game, position.x, position.y, properties.texture);
    
    this.game_state = game_state;
    
    this.name = name;
    
    this.game_state.groups[properties.group].add(this);
    this.frame = +properties.frame;
    
    if (properties.scale) {
        this.scale.setTo(properties.scale.x, properties.scale.y);
    }
    
    if (properties.anchor) {
        this.anchor.setTo(properties.anchor.x, properties.anchor.y);
    }
    
    this.game_state.prefabs[name] = this;
};

HUDExample.Prefab.prototype = Object.create(Phaser.Sprite.prototype);
HUDExample.Prefab.prototype.constructor = HUDExample.Prefab;