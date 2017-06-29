var Phaserstone = Phaserstone || {};

Phaserstone.Minion = function (game_state, name, position, properties) {
    "use strict";
    Phaserstone.Card.call(this, game_state, name, position, properties);
    
    this.inputEnabled = true;
    this.events.onInputDown.add(this.select, this);
};

Phaserstone.Minion.prototype = Object.create(Phaserstone.Card.prototype);
Phaserstone.Minion.prototype.constructor = Phaserstone.Minion;

Phaserstone.Minion.prototype.select = function () {
    "use strict";
    if (this.owner === this.game_state.current_player) {
        if (this.game_state.selected_minion) {
            this.tint = 0xffffff;
        }
        this.tint = 0xff0000;
        this.game_state.selected_minion = this;
    } else if (this.game_state.selected_minion) {
        this.game_state.selected_minion.attack(this);
        this.game_state.selected_minion = null;
    }
};

Phaserstone.Minion.prototype.attack = function (target) {
    "use strict";
    this.health -= target.damage;
    target.health -= this.damage;
    
    if (this.health <= 0) {
        this.kill();
    }
    if (target.health <= 0) {
        target.kill();
    }
    
    this.inputEnabled = false;
    this.tint = 0xffffff;
};