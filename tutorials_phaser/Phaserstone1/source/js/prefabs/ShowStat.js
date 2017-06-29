var Phaserstone = Phaserstone || {};

Phaserstone.ShowStat = function (game_state, name, position, properties) {
    "use strict";
    Phaserstone.TextPrefab.call(this, game_state, name, position, properties);

    this.prefab = this.game_state.prefabs[properties.prefab];
    this.stat = properties.stat;
    this.relative_position = properties.relative_position;
};

Phaserstone.ShowStat.prototype = Object.create(Phaserstone.TextPrefab.prototype);
Phaserstone.ShowStat.prototype.constructor = Phaserstone.ShowStat;

Phaserstone.ShowStat.prototype.update = function () {
    "use strict";
    this.text = this.prefab[this.stat];
    this.x = this.prefab.x + this.relative_position.x;
    this.y = this.prefab.y + this.relative_position.y;
};