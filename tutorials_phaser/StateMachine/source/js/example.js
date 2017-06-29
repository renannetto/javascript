Hero = function (game_state, walking_speed, jumping_speed) {
    Phaser.Sprite.call(this);
    this.game_state = game_state;
    
    this.walking_speed = walking_speed;
    this.jumping_speed = jumping_speed;
    this.is_jumping = false;
    
    this.game_state.physics.arcade.enable(this);
    
    this.cursors = this.game_state.input.keyboard.createCursorKeys();
};

Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;

Hero.prototype.update = function () {
    if (this.cursors.left.isDown) {
        this.body.velocity.x = -this.walking_speed;
    } else if (this.cursors.right.isDown) {
        this.body.velocity.x = this.walking_speed;
    } else {
        this.body.velocity.x = 0;
    }
    
    if (this.cursros.up.isDown && !this.is_jumping) {
        this.body.velocity.y = -this.jumping_speed;
        this.is_jumping = true;
    }
    
    if (this.game_state.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && !this.is_jumping) {
        this.attack();
    }
};