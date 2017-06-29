var Phaserstone = Phaserstone || {};

Phaserstone.Card = function (game_state, name, position, properties) {
    "use strict";
    Phaserstone.Prefab.call(this, game_state, name, position, properties);
    
    this.owner = properties.owner;
    this.cost = properties.cost;
    this.damage = properties.damage;
    this.health = properties.health;
    
    this.cost_text = new Phaserstone.ShowStat(this.game_state, this.name + "_cost", {x: this.x, y: this.y}, {group: "hud", anchor: {x: 0.5, y: 0.5}, text: this.cost, style: this.game_state.TEXT_STYLE, prefab: this.name, stat: "cost", relative_position: {x: 20, y: 20}});
    
    this.damage_text = new Phaserstone.ShowStat(this.game_state, this.name + "_damage", {x: this.x, y: this.y}, {group: "hud", anchor: {x: 0.5, y: 0.5}, text: this.damage, style: this.game_state.TEXT_STYLE, prefab: this.name, stat: "damage", relative_position: {x: 15, y: 185}});
    
    this.health_text = new Phaserstone.ShowStat(this.game_state, this.name + "_health", {x: this.x, y: this.y}, {group: "hud", anchor: {x: 0.5, y: 0.5}, text: this.health, style: this.game_state.TEXT_STYLE, prefab: this.name, stat: "health", relative_position: {x: 135, y: 185}});
};

Phaserstone.Card.prototype = Object.create(Phaserstone.Prefab.prototype);
Phaserstone.Card.prototype.constructor = Phaserstone.Card;

Phaserstone.Card.prototype.kill = function () {
    Phaser.Sprite.prototype.kill.call(this);
    this.cost_text.kill();
    this.damage_text.kill();
    this.health_text.kill();
}