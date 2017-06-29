var Bomberboy = Bomberboy || {};

Bomberboy.TitleState = function () {
    "use strict";
    Bomberboy.JSONLevelState.call(this);
    
    this.prefab_classes = {
        "title": Bomberboy.TextPrefab.prototype.constructor,
        "start_state_item": Bomberboy.StartStateItem.prototype.constructor
    };
};

Bomberboy.TitleState.prototype = Object.create(Bomberboy.JSONLevelState.prototype);
Bomberboy.TitleState.prototype.constructor = Bomberboy.TitleState;

Bomberboy.TitleState.prototype.create = function () {
    "use strict";
    var menu_position, menu_items, menu_properties, menu;
    Bomberboy.JSONLevelState.prototype.create.call(this);
    
    this.game.current_upgrades = this.game.current_upgrades || [];    
    
    // adding menu
    menu_position = new Phaser.Point(0, 0);
    menu_items = [];
    this.groups.menu_items.forEach(function (menu_item) {
        menu_items.push(menu_item);
    }, this);
    menu_properties = {texture: "", group: "background", menu_items: menu_items};
    menu = new Bomberboy.Menu(this, "menu", menu_position, menu_properties);
};