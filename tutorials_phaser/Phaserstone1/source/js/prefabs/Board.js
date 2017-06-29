var Phaserstone = Phaserstone || {};

Phaserstone.Board = function (game_state, name, position, properties) {
    "use strict";
    Phaserstone.Prefab.call(this, game_state, name, position, properties);
    
    this.REGIONS = {
        player1: {
            x: 10,
            y: 590,
            width: 1000
        },
        player2: {
            x: 10,
            y: 360,
            width: 1000
        }
    };
    
    this.minions = {
        player1: [],
        player2: []
    };
};

Phaserstone.Board.prototype = Object.create(Phaserstone.Prefab.prototype);
Phaserstone.Board.prototype.constructor = Phaserstone.Board;

Phaserstone.Board.prototype.play = function (card) {
    "use strict";
    var minion_prefab_data, minion;
    minion_prefab_data = {
        type: "minion",
        position: {x: 0, y: 0},
        properties: {
            group: "minions",
            texture: card.texture,
            cost: card.cost,
            owner: card.owner,
            damage: card.damage,
            health: card.health
        }
    };
    minion = this.game_state.create_prefab(card.name + "_minion", minion_prefab_data);
    
    this.minions[card.owner].push(minion);
    Phaserstone.place_prefabs_in_region(this.minions[card.owner], this.REGIONS[card.owner]);
    
    card.kill();
};