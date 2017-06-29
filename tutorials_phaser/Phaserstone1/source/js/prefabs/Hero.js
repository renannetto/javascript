var Phaserstone = Phaserstone || {};

Phaserstone.Hero = function (game_state, name, position, properties) {
    "use strict";
    Phaserstone.Prefab.call(this, game_state, name, position, properties);
    
    this.owner = properties.owner;
    this.damage = properties.damage;
    this.health = properties.health;
    
    this.health_text = new Phaserstone.ShowStat(this.game_state, this.name + "_health", {x: this.x, y: this.y}, {group: "hud", anchor: {x: 0.5, y: 0.5}, text: this.health, style: this.game_state.TEXT_STYLE, prefab: this.name, stat: "health", relative_position: {x: 50, y: 50}});
    
    this.inputEnabled = true;
    this.events.onInputDown.add(this.select, this);
};

Phaserstone.Hero.prototype = Object.create(Phaserstone.Prefab.prototype);
Phaserstone.Hero.prototype.constructor = Phaserstone.Hero;

Phaserstone.Hero.prototype.kill = function () {
    "use strict";
    this.game_state.end_match(this.owner);
};

Phaserstone.Hero.prototype.select = function () {
    "use strict";
    if (this.game_state.selected_minion) {
        this.game_state.selected_minion.attack(this);
        this.game_state.selected_minion = null;
    }
};

Phaserstone.Hero.prototype.attack = function (target) {
    "use strict";
    this.health -= target.damage;
    target.health -= this.damage;
    
    if (this.health <= 0) {
        this.kill();
    }
    if (target.health <= 0) {
        target.kill();
    }
};