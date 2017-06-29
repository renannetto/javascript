var Engine = Engine || {};
var HUDExample = HUDExample || {};

HUDExample.ShowStatWithBar = function (game_state, name, position, properties) {
    "use strict";
    HUDExample.ShowStat.call(this, game_state, name, position, properties);
};

HUDExample.ShowStatWithBar.prototype = Object.create(HUDExample.ShowStat.prototype);
HUDExample.ShowStatWithBar.prototype.constructor = HUDExample.ShowStatWithBar;

HUDExample.ShowStatWithBar.prototype.update_stat = function (new_stat) {
    "use strict";
    HUDExample.ShowStat.prototype.update_stat.call(this, new_stat);
    // use the stat to define the bar size
    this.scale.setTo(this.stat, 2);
};
