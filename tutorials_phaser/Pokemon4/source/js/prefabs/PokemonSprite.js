var Pokemon = Pokemon || {};

Pokemon.PokemonSprite = function (game_state, name, position, properties) {
    "use strict";
    Pokemon.Prefab.call(this, game_state, name, position, properties);
    var text_position;
    
    this.anchor.setTo(0.5);
    this.scale.setTo(0.25);
    
    text_position = new Phaser.Point(this.x, this.y + (this.height / 2) + 10);
    this.message_text = new Pokemon.TextPrefab(this.game_state, this.name + "_text", text_position, properties.text_properties);
    this.message_text.anchor.setTo(0.5);
};

Pokemon.PokemonSprite.prototype = Object.create(Pokemon.Prefab.prototype);
Pokemon.PokemonSprite.prototype.constructor = Pokemon.PokemonSprite;

Pokemon.PokemonSprite.prototype.kill = function () {
    "use strict";
    Phaser.Sprite.prototype.kill.call(this);
    this.message_text.kill();
};