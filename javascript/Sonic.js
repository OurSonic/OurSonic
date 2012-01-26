function Sonic() {
    this.x = 0;
    this.y = 0;
    this.sprite = new Image();
    var sprite1 = this.sprite;
    this.sprite.onload = function () {
        sprite1.loaded = true;
    };
    var j = "assets/Sprites/sonic.png";
    this.sprite.src = j;



    this.draw = function (canvas, scale) {
        if (this.sprite.loaded)
            canvas.drawImage(this.sprite, this.x, this.y, scale.x * this.sprite.width, scale.y * this.sprite.height);
    };
    this.tick = function () {

    };
    this.pressJump = function () {
        this.y -= 5;
    };
    this.pressCrouch = function () {
        this.y += 5;
    };
    this.pressLeft = function () {
        this.x -= 5;
    };
    this.pressRight = function () {
        this.x += 5;
    };
}