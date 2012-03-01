

function ObjectManager(sonicManager) {

    this.sonicManager = sonicManager;
    window.objectManager = this;
    this.metaObjectFrameworks= [];
    this.objectFrameworks = [];

    this.init = function () {
        this.objectFrameworks[""] = new LevelObject();
    };
    
}


var broken = _H.loadSprite("assets/Sprites/broken.png");

function LevelObject() {
    this.assets = [];
    this.key = '';
    this.pieces = [];
    this.paths = [];
    this.projectiles = [];

    this.init = function (level, sonic) {
    };
    this.tick = function (level, sonic) {
    };
    this.onCollide = function (level, sonic) {
    };
    this.onHurtSonic = function (level, sonic, sensor) {
    };
}
function LevelObjectAsset() {
    this.frames = [];
}
function LevelObjectAssetFrame() {
    this.offsetX = 0;
    this.offsetY = 0;
    this.hurtSonicMap = [];
    this.collisionMap = [];
    this.colorMap = [];
    this.palette = [];
}
function LevelObjectPiece() {
    this.assetIndex = 0;
    this.frameIndex = 0;
    this.collided = false;
    this.xflip = false;
    this.yflip = false;
}
function LevelObjectPath() {
    this.pieces = [];
}
function LevelObjectInfo() {
    this.x = 0;
    this.y = 0;
    this.xsp = 0;
    this.ysp = 0;
    this.xflip = 0;
    this.yflip = 0;
    this.subdata = undefined;
}
function LevelProjectile() {
    this.x = 0;
    this.y = 0;
    this.xsp = 0;
    this.ysp = 0;
    this.xflip = 0;
    this.yflip = 0;
    this.subdata = undefined;
    this.assets = [];
    this.init = function (level, sonic) {
    };
    this.tick = function (level, sonic) {
    };
    this.onCollide = function (level, sonic) {
    };
    this.onHurtSonic = function (level, sonic, sensor) {
    };

}