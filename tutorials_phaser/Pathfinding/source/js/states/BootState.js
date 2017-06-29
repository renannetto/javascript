var PathfindingExample = PathfindingExample || {};

PathfindingExample.BootState = function () {
    "use strict";
    Phaser.State.call(this);
};

PathfindingExample.BootState.prototype = Object.create(Phaser.State.prototype);
PathfindingExample.BootState.prototype.constructor = PathfindingExample.BootState;

PathfindingExample.BootState.prototype.init = function (level_file, next_state) {
    "use strict";
    this.level_file = level_file;
    this.next_state = next_state;
};

PathfindingExample.BootState.prototype.preload = function () {
    "use strict";
    this.load.text("level1", this.level_file);
};

PathfindingExample.BootState.prototype.create = function () {
    "use strict";
    var level_text, level_data;
    level_text = this.game.cache.getText("level1");
    level_data = JSON.parse(level_text);
    this.game.state.start("LoadingState", true, false, level_data, this.next_state);
};