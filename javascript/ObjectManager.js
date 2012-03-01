

function ObjectManager(sonicManager) {

    this.sonicManager = sonicManager;
    window.objectManager = this;
    this.metaObjectFrameworks = [];
    this.objectFrameworks = [];

    this.init = function () {

    }; 
} 

function LevelObject(key) {
    this.assets = [];
    this.key = key?key:"";
    this.pieces = [];
    this.paths = [];
    this.projectiles = [];
    this.initScript = "";
    this.tickScript = "";
    this.collideScript = "";
    this.hurtScript = "";

    this.init = function (level, sonic) {
    };
    this.tick = function (level, sonic) {
    };
    this.onCollide = function (level, sonic) {
    };
    this.onHurtSonic = function (level, sonic, sensor) {
    };
}
function LevelObjectAsset(name) {
    this.frames = [];
    this.name = name?name:"";
}
function LevelObjectAssetFrame(name) {
    this.offsetX = 0;
    this.width = 0;
    this.height = 0;
    this.offsetY = 0;
    this.hurtSonicMap = [];
    this.collisionMap = [];
    this.colorMap = [];
    this.palette = [];
    this.name = name ? name : "";

    this.drawUI = function (canvas, pos, scale, showOutline) {
        canvas.strokeStyle = "#000000";
        canvas.lineWidth = 1;

        for (var x = 0; x < this.colorMap.length; x++) {
            for (var y = 0; y < this.colorMap[x].length; y++) {
                var ex = x;
                var ey = y;
                var color = this.palette[this.colorMap[ex][ey]];
                //  var negative = _H.negateColor(color);
                if (canvas.fillStyle != "#" + color)
                    canvas.fillStyle = "#" + color;

                //if (canvas.strokeStyle != "#" + negative)
                //    canvas.strokeStyle = "#" + negative; 
                canvas.fillRect(pos.x + ex * scale.x, pos.y + ey * scale.y, scale.x, scale.y);
                if (showOutline)
                    canvas.strokeRect(pos.x + ex * scale.x, pos.y + ey * scale.y, scale.x, scale.y);
            }
        }
    };
    this.draw = function (canvas, pos, scale) {

    };
}
function LevelObjectPiece(name) {
    this.assetIndex = 0;
    this.frameIndex = 0;
    this.collided = false;
    this.xflip = false;
    this.yflip = false;
    this.name = name?name:"";
}
function LevelObjectPath(name) {
    this.pieces = [];
    this.name = name ? name : "";
}
function LevelObjectInfo() {
    this.x = 0;
    this.y = 0;
    this.xsp = 0;
    this.ysp = 0;
    this.xflip = 0;
    this.yflip = 0;
    this.subdata = undefined;
    this.key = undefined;
}
function LevelProjectile(name) {
    this.x = 0;
    this.y = 0;
    this.xsp = 0;
    this.ysp = 0;
    this.xflip = 0;
    this.yflip = 0;
    this.subdata = undefined;
    this.assets = [];
    this.name = name ? name : "";
    this.init = function (level, sonic) {
    };
    this.tick = function (level, sonic) {
    };
    this.onCollide = function (level, sonic) {
    };
    this.onHurtSonic = function (level, sonic, sensor) {
    };
}

function LevelEvent() {
    this.triggered = false;
    this.state = {};
    this.tick = function (level, sonic) {
    };
    this.trigger = function (state) {
        this.state = state;
    };
}
