var Engine = Engine || {};
var HUDExample = HUDExample || {};

HUDExample.ShowStatWithText = function (game_state, name, position, properties) {
    "use strict";
    HUDExample.ShowStat.call(this, game_state, name, position, properties);
    this.text_style = properties.text_style;
    this.stats_group = properties.stats_group;
};

HUDExample.ShowStatWithText.prototype = Object.create(HUDExample.ShowStat.prototype);
HUDExample.ShowStatWithText.prototype.constructor = HUDExample.ShowStatWithText;

HUDExample.ShowStatWithText.prototype.reset = function (position_x, position_y) {
    "use strict";
    Phaser.Sprite.prototype.reset.call(this, position_x, position_y);
    // create the text to show the stat value
    this.text = new Phaser.Text(this.game_state.game, this.x + this.width, this.y, "", this.text_style);
    this.text.fixedToCamera = true;
    this.game_state.groups[this.stats_group].add(this.text);
};

HUDExample.ShowStatWithText.prototype.update_stat = function (new_stat) {
    "use strict";
    HUDExample.ShowStat.prototype.update_stat.call(this, new_stat);
    // update the text to show the new stat value
    this.text.text = this.stat;
};
