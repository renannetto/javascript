var HUDExample = HUDExample || {};

HUDExample.Item = function (game_state, name, position, properties) {
    "use strict";
    HUDExample.Prefab.call(this, game_state, name, position, properties);
    
    this.anchor.setTo(0.5);
    
    this.stats = {
        health: +properties.health,
        defense: +properties.defense,
        attack: +properties.attack,
        money: +properties.money
    };

    this.game_state.game.physics.arcade.enable(this);
    this.body.immovable = true;
};

HUDExample.Item.prototype = Object.create(HUDExample.Prefab.prototype);
HUDExample.Item.prototype.constructor = HUDExample.Item;

HUDExample.Item.prototype.update = function () {
    "use strict";
    // when colliding with hero the item is collected
    this.game_state.game.physics.arcade.collide(this, this.game_state.groups.heroes, this.collect_item, null, this);
};

HUDExample.Item.prototype.collect_item = function (item, hero) {
    "use strict";
    var stat;
    // update hero stats according to item
    for (stat in this.stats) {
        // update only if the stat is defined for this item
        if (this.stats.hasOwnProperty(stat) && this.stats[stat]) {
            hero.stats[stat] += this.stats[stat];
        }
    }
    this.kill();
};