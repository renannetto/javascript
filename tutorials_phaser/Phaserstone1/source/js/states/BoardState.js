var Phaserstone = Phaserstone || {};

Phaserstone.BoardState = function () {
    "use strict";
    Phaser.State.call(this);
    
    this.TEXT_STYLE = {font: "bold 24pt Arial", fill: "#ffffff"};
    
    this.prefab_classes = {
        board: Phaserstone.Board.prototype.constructor,
        end_turn: Phaserstone.EndTurn.prototype.constructor,
        card_in_hand: Phaserstone.CardInHand.prototype.constructor,
        minion: Phaserstone.Minion.prototype.constructor,
        mana: Phaserstone.Mana.prototype.constructor,
        hero: Phaserstone.Hero.prototype.constructor
    };
};

Phaserstone.BoardState.prototype = Object.create(Phaser.State.prototype);
Phaserstone.BoardState.prototype.constructor = Phaserstone.BoardState;

Phaserstone.BoardState.prototype.init = function (level_data) {
    "use strict";
    this.level_data = level_data;
    
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
};

Phaserstone.BoardState.prototype.create = function () {
    "use strict";
    var group_name, prefab_name;
    
    // create groups
    this.groups = {};
    this.level_data.groups.forEach(function (group_name) {
        this.groups[group_name] = this.game.add.group();
    }, this);
    
    // create prefabs
    this.prefabs = {};
    for (prefab_name in this.level_data.prefabs) {
        if (this.level_data.prefabs.hasOwnProperty(prefab_name)) {
            // create prefab
            this.create_prefab(prefab_name, this.level_data.prefabs[prefab_name]);
        }
    }
    
    this.current_player = "player1";
};

Phaserstone.BoardState.prototype.create_prefab = function (prefab_name, prefab_data) {
    "use strict";
    var prefab_position, prefab;
    // create object according to its type
    if (this.prefab_classes.hasOwnProperty(prefab_data.type)) {
        if (prefab_data.position.x > 0 && prefab_data.position.x <= 1) {
            // position as percentage
            prefab_position = new Phaser.Point(prefab_data.position.x * this.game.world.width,
                                              prefab_data.position.y * this.game.world.height);
        } else {
            // position as absolute number
            prefab_position = prefab_data.position;
        }
        prefab = new this.prefab_classes[prefab_data.type](this, prefab_name, prefab_position, prefab_data.properties);
    }
    return prefab;
};

Phaserstone.BoardState.prototype.end_turn = function () {
    "use strict";
    if (this.current_player === "player1") {
        this.current_player = "player2";
    } else {
        this.current_player = "player1";
    }
    
    this.prefabs[this.current_player + "_mana"].gain_mana(1);
    this.prefabs[this.current_player + "_mana"].reset_mana();
    
    this.groups.minions.forEach(function(minion) {
        minion.inputEnabled = true;
    }, this);
};

Phaserstone.BoardState.prototype.end_match = function (loser) {
    "use strict";
    console.log(loser + " lost!");
    this.game.state.start("BootState", true, false, "assets/levels/board_level.json", "BoardState");
};
