var DEBUG = false;


var WireColor = "#FFF";
function Vector2D() { }

Vector2D.Add = function (vc, v) {
    return { x: vc.x + v.x, y: vc.y + v.y };
};
Vector2D.Sub = function (vc, v) {
    return { x: vc.x - v.x, y: vc.y - v.y };
};
Vector2D.Mul = function (vc, v) {
    return { x: vc.x * v, y: vc.y * v };
};
Vector2D.Div = function (vc, v) {
    return { x: vc.x / v, y: vc.y / v };
};
Vector2D.Neg = function (vc) {
    return { x: -vc.x, y: -vc.y };
};

Vector2D.length = function (vt) {
    return Math.sqrt(vt.x * vt.x + vt.y * vt.y);
};


function Mass(m) {
    this.m = m;
    this.pos = { x: 0, y: 0 };
    this.vel = { x: 0, y: 0 };
    this.force = { x: 0, y: 0 };

    this.applyForce = function (force) {
        this.force = Vector2D.Add(this.force, force);
    };
    this.applyVelocity = function (force) {
        this.vel = Vector2D.Add(this.vel, force);
    };
    this.init = function () {
        this.force.x = 0;
        this.force.y = 0;
    };
    this.simulate = function (dt) {

        this.vel.x += ((this.force.x / this.m) * dt);
        this.vel.y += ((this.force.y / this.m) * dt);

        this.pos = { x: this.pos.x + this.vel.x * dt, y: this.pos.y + this.vel.y * dt };
    };

    return this;
};


function Spring(mass1, mass2, springConstant, springLength, frictionConstant) {
    this.mass1 = mass1;
    this.mass2 = mass2;
    this.springConstant = springConstant;
    this.springLength = springLength;
    this.frictionConstant = frictionConstant; 
    this.tiz = 0;
    this.solve = function () {
        var m1 = this.mass1;
        var m2 = this.mass2;

        var springVector = [m1.pos.x - m2.pos.x, m1.pos.y - m2.pos.y];


        var r = Math.sqrt(springVector[0] * springVector[0] + springVector[1] * springVector[1]);

        var xx = (((((springVector[0] / r) * (r - this.springLength)) * -this.springConstant))) + -((m1.vel.x - m2.vel.x) * this.frictionConstant);
        var yy = (((((springVector[1] / r) * (r - this.springLength)) * -this.springConstant))) + -((m1.vel.y - m2.vel.y) * this.frictionConstant);
        m1.force.x += xx;
        m1.force.y += yy;
        m2.force.x += -xx;
        m2.force.y += -yy;

    };

    return this;
};

function Simulation(numOfMasses, m,
        springC,
        springFrictionConstant,
        gravitation,
        airFrictionConstant, startPos, endPos, render) {
    this.render = render;
    this.remove = false;
    this.numOfMasses = numOfMasses;
    this.masses = [];
    this.endPos = endPos ? endPos : { x: 0, y: 0 };
    var a;
    for (a = 0; a < numOfMasses; ++a) {
        this.masses[a] = new Mass(m);
    }

    this.springConstant = 0.0001;

    this.getMass = function (index) {
        if (index < 0 || index >= this.numOfMasses)		// if the index is not in the array
            return null; // then return NULL
        return this.masses[index]; // get the mass at the index
    };
    this.init = function () {
        for (var b = 0; b < numOfMasses; ++b)		// We will init() every mass
            this.masses[b].init();
    };
    this.tiz = 0;
    this.skipping = true;
    this.operate = function (dt) {

        var b;



        var xx;
        var yy;

        xx = 0;
        yy = 0;

        for (b = 0; b < this.numOfMasses; ++b) {
            xx += this.masses[b].force.x;
            yy += this.masses[b].force.y;
        }
        if (!this.message[1]) this.message[1] = 0;
        if (!this.message[2]) this.message[2] = 0;
        this.message[0] = "";

        if (yy > -0.005 && yy < 0.0005 && xx > -0.005 && xx < 0.0005 && !this.skipping && (this.startPos.x == this.lastStartPos.x && this.startPos.y == this.lastStartPos.y && this.endPos.x == this.lastEndPos.x && this.endPos.y == this.lastEndPos.y)) {
            //&& this.tiz++ % 6 > 0
            this.message[0] = "good";
            this.message[2]++;
            return false;
        }
        this.message[1]++;

        if (!this.skipping)
            this.init(); // Step 1: reset forces to zero 
        this.skipping = false;
        this.solve(); // Step 2: apply forces
        this.simulate(dt);
        return true;
    };
    this.springs = [];
    this.gravitation = gravitation;
    this.startPos = startPos ? startPos : { x: 0, y: 0 };

    this.airFrictionConstant = airFrictionConstant;


    this.springOffset = 0;
    var springLength = (this.springConstant + 0) * Math.sqrt((Math.pow(this.endPos.x - this.startPos.x, 2) + Math.pow(this.endPos.y - this.startPos.y, 2)));
    var resX = (endPos.x - startPos.x) / this.numOfMasses;
    var resY = (endPos.y - startPos.y) / this.numOfMasses;

    for (a = 0; a < this.numOfMasses; ++a) {


        this.masses[a].pos.x = startPos.x + a * resX;
        this.masses[a].pos.y = startPos.y + a * resY;
    }


    for (a = 0; a < this.numOfMasses - 1; ++a) {
        this.springs[a] = new Spring(this.masses[a], this.masses[a + 1],
              springC, springLength, springFrictionConstant);
    }

    this.solve = function () {
        var b;
        for (b = 0; b < this.numOfMasses - 1; ++b) {
            this.springs[b].solve();
        }
        for (b = 0; b < numOfMasses; ++b) {
            var dd = this.masses[b];
            var mc = dd.m;
            dd.force.x += ((this.gravitation.x) * mc);
            dd.force.y += ((this.gravitation.y) * mc);

            dd.force.x += (-dd.vel.x) * this.airFrictionConstant;
            dd.force.y += (-dd.vel.y) * this.airFrictionConstant;
        }
    };

    this.message = [];
    this.lastStartPos = this.startPos;
    this.lastEndPos = this.endPos;

    this.simulate = function (dt) {

        var b;



        this.masses[0].vel = Vector2D.Add(this.masses[0].vel, Vector2D.Sub(this.startPos, this.lastStartPos));

        this.masses[this.numOfMasses - 1].vel = Vector2D.Add(this.masses[this.numOfMasses - 1].vel, Vector2D.Sub(this.endPos, this.lastEndPos));

        this.lastStartPos = this.startPos;
        this.lastEndPos = this.endPos;

        for (b = 0; b < this.numOfMasses; ++b)
            this.masses[b].simulate(dt);

        var sc = (this.springConstant + this.springOffset) * Math.sqrt((Math.pow(this.endPos.x - this.startPos.x, 2) + Math.pow(this.endPos.y - this.startPos.y, 2)));
        for (b = 0; b < this.numOfMasses - 1; ++b) {
            this.springs[b].springLength = sc;
        }

        this.masses[0].pos = this.startPos;
        this.masses[this.numOfMasses - 1].pos = this.endPos;



    };

    this.tick = function () {
        if (this.remove) {
            clearInterval(this.intervalTick);
            return false;
        }
        for (var b = 0; b < 60; ++b)								// We Need To Iterate Simulations "numOfIterations" Times
            if (!this.operate(0.004)) return true;
    };
    if (this.render) {
        this.intervalTick = setInterval(function (th) { th.tick(); },1000/60, this);

    }


    this.draw = function (canv) {

        canv.lineWidth = 0.5;
        canv.strokeStyle = "#000";
        canv.beginPath();
        var b;
        for (b = 0; b < this.numOfMasses; ++b) {
            var mass1 = this.getMass(b);
            var pos1 = mass1.pos;



            if (b == 0) {
                canv.moveTo(pos1.x, pos1.y);
            } else {
                
                canv.lineTo(pos1.x, pos1.y); 
            }


        }
        canv.stroke();


        if (DEBUG) {
        canv.fillStyle = "#334";
        canv.font = "13pt Arial bold";
            for (var i = 0; i < this.message.length; i++) {
                canv.fillText(this.message[i], 10, 10 + i * 30);
            }
        }



    };

    return this;
};


 