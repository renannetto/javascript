var Phaserstone = Phaserstone || {};

Phaserstone.TextPrefab = function (game_state, name, position, properties) {
    "use strict";
    Phaser.Text.call(this, game_state.game, position.x, position.y, properties.text, properties.style);
    
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

Phaserstone.TextPrefab.prototype = Object.create(Phaser.Text.prototype);
Phaserstone.TextPrefab.prototype.constructor = Phaserstone.TextPrefab;