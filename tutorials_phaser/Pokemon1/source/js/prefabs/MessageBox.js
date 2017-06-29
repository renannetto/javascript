var Pokemon = Pokemon || {};

Pokemon.MessageBox = function (game_state, name, position, properties) {
    "use strict";
    Pokemon.Prefab.call(this, game_state, name, position, properties);
    
    // create TextPrefab to show the message
    this.message_text = new Pokemon.TextPrefab(this.game_state, this.name + "_text", Object.create(this.position), properties.text_properties);
    this.message_text.anchor.setTo(0.5);
    
    // add input event to call game state method
    this.inputEnabled = true;
    this.events.onInputDown.add(this.game_state[properties.callback], this.game_state);
};

Pokemon.MessageBox.prototype = Object.create(Pokemon.Prefab.prototype);
Pokemon.MessageBox.prototype.constructor = Pokemon.MessageBox;
