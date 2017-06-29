var Bomberboy = Bomberboy || {};

Bomberboy.BootState = function () {
    "use strict";
    Phaser.State.call(this);
};

Bomberboy.BootState.prototype = Object.create(Phaser.State.prototype);
Bomberboy.BootState.prototype.constructor = Bomberboy.BootState;

Bomberboy.BootState.prototype.init = function (level_file, next_state, extra_parameters) {
    "use strict";
    this.level_file = level_file;
    this.next_state = next_state;
    this.extra_parameters = extra_parameters;
};

Bomberboy.BootState.prototype.preload = function () {
    "use strict";
    this.load.text("level1", this.level_file);
};

Bomberboy.BootState.prototype.create = function () {
    "use strict";
    var level_text, level_data;
    level_text = this.game.cache.getText("level1");
    level_data = JSON.parse(level_text);
    this.game.state.start("LoadingState", true, false, level_data, this.next_state, this.extra_parameters);
};