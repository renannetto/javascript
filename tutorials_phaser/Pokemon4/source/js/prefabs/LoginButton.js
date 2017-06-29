var Pokemon = Pokemon || {};

Pokemon.LoginButton = function (game_state, name, position, properties) {
    "use strict";
    Pokemon.Prefab.call(this, game_state, name, position, properties);
    
    this.auth_providers = {
        google: firebase.auth.GoogleAuthProvider.prototype.constructor,
        facebook: firebase.auth.FacebookAuthProvider.prototype.constructor
    };
    
    this.auth_provider = properties.auth_provider;
    this.provider_scope = properties.provider_scope;
    
    // add input event to call game state method
    this.inputEnabled = true;
    this.events.onInputDown.add(this.login, this);
};

Pokemon.LoginButton.prototype = Object.create(Pokemon.Prefab.prototype);
Pokemon.LoginButton.prototype.constructor = Pokemon.LoginButton;

Pokemon.LoginButton.prototype.login = function () {
    "use strict";
    var provider, user;
    if (!firebase.auth().currentUser) {
        provider = new this.auth_providers[this.auth_provider]();
        provider.addScope(this.provider_scope);
        
        firebase.auth().signInWithPopup(provider).then(this.game_state.on_login.bind(this.game_state)).catch(Pokemon.handle_error);
    } else {
        firebase.database().ref("/users/" + firebase.auth().currentUser.uid).once("value").then(this.game_state.start_game.bind(this.game_state));
    }
};
