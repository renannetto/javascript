var Phaserstone = Phaserstone || {};

Phaserstone.Mana = function (game_state, name, position, properties) {
    "use strict";
    Phaserstone.Prefab.call(this, game_state, name, position, properties);
    
    this.total_mana = properties.total_mana;
    this.current_mana = properties.current_mana;
    
    this.mana_text = new Phaserstone.TextPrefab(this.game_state, this.name + "_text", {x: this.x + 60, y: this.y + 20}, {group: "hud", text: "", style: this.game_state.TEXT_STYLE, anchor: {x: 0.5, y: 0.5}});
};

Phaserstone.Mana.prototype = Object.create(Phaserstone.Prefab.prototype);
Phaserstone.Mana.prototype.constructor = Phaserstone.Mana;

Phaserstone.Mana.prototype.update = function () {
    "use strict";
    this.mana_text.text = this.current_mana + "/" + this.total_mana;
}

Phaserstone.Mana.prototype.gain_mana = function (amount) {
    "use strict";
    this.total_mana += amount;
};

Phaserstone.Mana.prototype.use_mana = function (amount) {
    "use strict";
    this.current_mana -= amount;
};

Phaserstone.Mana.prototype.reset_mana = function () {
    "use strict";
    this.current_mana = this.total_mana;
};