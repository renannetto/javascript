var Phaserstone = Phaserstone || {};

Phaserstone.CardInHand = function (game_state, name, position, properties) {
    "use strict";
    Phaserstone.Card.call(this, game_state, name, position, properties);
    
    this.inputEnabled = true;
    this.events.onInputDown.add(this.play, this);
};

Phaserstone.CardInHand.prototype = Object.create(Phaserstone.Card.prototype);
Phaserstone.CardInHand.prototype.constructor = Phaserstone.CardInHand;

Phaserstone.CardInHand.prototype.play = function () {
    "use strict";
    var player_mana;
    player_mana = this.game_state.prefabs[this.owner + "_mana"];
    if (this.owner === this.game_state.current_player && this.cost <= player_mana.current_mana) {
        this.game_state.prefabs.board.play(this);
        player_mana.use_mana(this.cost);
    }
};