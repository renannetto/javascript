var Pokemon = Pokemon || {};

Pokemon.TitleState = function () {
    "use strict";
    Pokemon.JSONLevelState.call(this);
    
    this.prefab_classes = {
        "text": Pokemon.TextPrefab.prototype.constructor
    };
};

Pokemon.TitleState.prototype = Object.create(Pokemon.JSONLevelState.prototype);
Pokemon.TitleState.prototype.constructor = Pokemon.TitleState;

Pokemon.TitleState.prototype.create = function () {
    "use strict";
    var pokemon_data;
    Pokemon.JSONLevelState.prototype.create.call(this);
    
    this.game.input.onDown.add(this.start_game, this);
};

Pokemon.TitleState.prototype.start_game = function () {
    "use strict";
    this.game.state.start("BootState", true, false, "assets/levels/world_level.json", "WorldState");
};