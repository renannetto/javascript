var Pokemon = Pokemon || {};

Pokemon.BootState = function () {
    "use strict";
    Phaser.State.call(this);
};

Pokemon.BootState.prototype = Object.create(Phaser.State.prototype);
Pokemon.BootState.prototype.constructor = Pokemon.BootState;

Pokemon.BootState.prototype.init = function (level_file, next_state) {
    "use strict";
    this.level_file = level_file;
    this.next_state = next_state;
};

Pokemon.BootState.prototype.preload = function () {
    "use strict";
    // load the level file
    this.load.text("level1", this.level_file);
};

Pokemon.BootState.prototype.create = function () {
    "use strict";
    var level_text, level_data;
    // parse the level file as a JSON object and send its data to LoadingState
    level_text = this.game.cache.getText("level1");
    level_data = JSON.parse(level_text);
    this.game.state.start("LoadingState", true, false, level_data, this.next_state);
};