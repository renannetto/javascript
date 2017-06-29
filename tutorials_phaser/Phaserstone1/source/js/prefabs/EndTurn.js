var Phaserstone = Phaserstone || {};

Phaserstone.EndTurn = function (game_state, name, position, properties) {
    "use strict";
    Phaserstone.Button.call(this, game_state, name, position, properties);
};

Phaserstone.EndTurn.prototype = Object.create(Phaserstone.Button.prototype);
Phaserstone.EndTurn.prototype.constructor = Phaserstone.EndTurn;

Phaserstone.EndTurn.prototype.end_turn = function () {
    "use strict";
    this.game_state.end_turn();
};