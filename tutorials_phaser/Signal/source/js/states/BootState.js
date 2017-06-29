var SignalExample = SignalExample || {};

SignalExample.BootState = function () {
    "use strict";
    Phaser.State.call(this);
};

SignalExample.BootState.prototype = Object.create(Phaser.State.prototype);
SignalExample.BootState.prototype.constructor = SignalExample.BootState;

SignalExample.BootState.prototype.init = function (level_file, next_state, extra_parameters) {
    "use strict";
    this.level_file = level_file;
    this.next_state = next_state;
    this.extra_parameters = extra_parameters;
};

SignalExample.BootState.prototype.preload = function () {
    "use strict";
    this.load.text("level1", this.level_file);
};

SignalExample.BootState.prototype.create = function () {
    "use strict";
    var level_text, level_data;
    level_text = this.game.cache.getText("level1");
    level_data = JSON.parse(level_text);
    this.game.state.start("LoadingState", true, false, level_data, this.next_state, this.extra_parameters);
};