var Tactics = Tactics || {};

Tactics.TitleState = function () {
    "use strict";
    Tactics.JSONLevelState.call(this);
    
    this.prefab_classes = {
        "text": Tactics.TextPrefab.prototype.constructor
    };
};

Tactics.TitleState.prototype = Object.create(Tactics.JSONLevelState.prototype);
Tactics.TitleState.prototype.constructor = Tactics.TitleState;

Tactics.TitleState.prototype.create = function () {
    "use strict";
    Tactics.JSONLevelState.prototype.create.call(this);
    this.game.input.onDown.add(this.start_battle, this);
};

Tactics.TitleState.prototype.start_battle = function () {
    "use strict";
    this.game.state.start("BootState", true, false, "assets/levels/lobby.json", "LobbyState");
};