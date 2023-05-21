
$(document).ready(()=>{
    setTimeout(
        function()
        {
            $('.visible').css({display:'none'})
            $('.para').css({display: 'block'})
        }, 100);
})

$(window).scroll(()=>{

    if ($(window).scrollTop()>100){
        $('.nav-bar').css({opacity:'1'})
    }else {
        $('.nav-bar').css({opacity:'0'})
    }

});
//moon animation---------------------
 // Variable to track if the target element has been passed

$(window).scroll(function() {
    var projectSection = $("#projects");

    var scrollProject = projectSection.offset().top - $(window).scrollTop();
    console.log(scrollProject)
    var moon = $('.moon');
    moon.css({ marginTop: -scrollProject/2});

});


//==============================================================
$(document).ready()
let c = init("canvas"),
    w = (canvas.width = window.innerWidth),
    h = (canvas.height = window.innerHeight);
//initiation

class firefly{
    constructor(){
        this.x = Math.random()*w;
        this.y = Math.random()*h;
        this.s = Math.random()*2;
        this.ang = Math.random()*2*Math.PI;
        this.v = this.s*this.s/4;
    }
    move(){
        this.x += this.v*Math.cos(this.ang);
        this.y += this.v*Math.sin(this.ang);
        this.ang += Math.random()*20*Math.PI/180-10*Math.PI/180;
    }
    show(){
        c.beginPath();
        c.arc(this.x,this.y,this.s,0,2*Math.PI);
        c.fillStyle="#fddba3";
        c.fill();
    }
}

let f = [];

function draw() {
    if(f.length < 100){
        for(let j = 0; j < 10; j++){
            f.push(new firefly());
        }
    }
    //animation
    for(let i = 0; i < f.length; i++){
        f[i].move();
        f[i].show();
        if(f[i].x < 0 || f[i].x > w || f[i].y < 0 || f[i].y > h){
            f.splice(i,1);
        }
    }
}

let mouse = {};
let last_mouse = {};

canvas.addEventListener(
    "mousemove",
    function(e) {
        last_mouse.x = mouse.x;
        last_mouse.y = mouse.y;

        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
    },
    false
);
function init(elemid) {
    let canvas = document.getElementById(elemid),
        c = canvas.getContext("2d"),
        w = (canvas.width = window.innerWidth),
        h = (canvas.height = window.innerHeight);
    c.fillStyle = "rgba(30,30,60,1)";
    c.fillRect(0, 0, w, h);
    return c;
}

window.requestAnimFrame = (function() {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback);
        }
    );
});

function loop() {
    window.requestAnimFrame(loop);
    c.clearRect(0, 0, w, h);
    draw();
}

window.addEventListener("resize", function() {
    (w = canvas.width = window.innerWidth),
        (h = canvas.height = window.innerHeight);
    loop();
});

loop();
setInterval(loop, 1000 / 60);


//===================================

var Vector = function(x, y){
    'use strict';

    this.x = x || 0;
    this.y = y || 0;

    var dx, dy;

    this.add = function(v){
        this.x += v.x;
        this.y += v.y;
        return this;
    };

    this.sub = function(v){
        this.x -= v.x;
        this.y -= v.y;
        return this;
    };

    this.nor = function(){
        var d = this.len();
        if(d > 0) {
            this.x = this.x / d;
            this.y = this.y / d;
        }
        return this;
    };

    this.dot = function(v){
        return this.x * v.x + this.y * v.y;
    };


    this.len2 = function(){
        return this.dot(this);
    };

    this.len = function(){
        return Math.sqrt(this.len2());
    };

    this.mul = function(v){
        if(typeof v === 'object'){
            this.x *= v.x;
            this.y *= v.y;
        } else {
            this.x *= v;
            this.y *= v;
        }

        return this;
    };

    this.copyFrom = function(v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    };

    this.distance = function(v){
        dx = this.x - v.x;
        dy = this.y - v.y;
        return Math.sqrt(dx * dx + dy * dy);
    };
};

var Particle = function(x, y){
    this.position = new Vector(x, y);
    this.velocity = new Vector();
    this.speed = 0;
    this.childs = [];
    this.linked = false;
    this.distance = false;
    this.alpha = 0.3;

    this.jointAlpha = this.alpha;
    this.linkAlpha = this.alpha;

    var acceleration = new Vector(),
        i = 0;

    this.update = function(delta){
        acceleration = acceleration.copyFrom(this.velocity);
        acceleration.mul(this.speed * delta);
        this.position.add(acceleration);

        this.jointAlpha -= 0.01;
        this.linkAlpha -= 0.015;

        if(this.jointAlpha >= this.alpha){
            this.jointAlpha = this.alpha;
        } else if(this.jointAlpha <= 0){
            this.jointAlpha = 0;
        }

        if(this.linkAlpha >= this.alpha){
            this.linkAlpha = this.alpha;
        } else if(this.linkAlpha <= 0){
            this.linkAlpha = 0;
        }

        if(this.linkAlpha <= 0){
            this.childs = [];
        }
    }

    this.addChild = function(link){
        for(i = 0; i < this.childs.length; i++){
            if(this.childs[i] === link){
                return false;
            }
        }
        this.childs.push(link);
    }
};



var ParticleNet = function($canvas){
    'use strict';

    var particleSpeed = 2.5,
        mouseRadius = 200,
        particleRadius = 100,
        mouseLive = 1;

    var context,
        width,
        height,
        particles = [],
        mousePos = false,
        mouseTTL = 0,
        time = 0,
        newTime = 0,
        delta,
        i, y,
        particle;

    var init = function(){
        if(!$canvas){
            return false;
        }

        time = getCurrentTime();
        context = $canvas.getContext('2d');

        addEvent(window, 'resize', initCanvas);
        addEvent($canvas, 'mousemove', setMousePos);
        addEvent($canvas, 'mouseleave', removeMousePos);

        initCanvas();
        loop();
    };

    var loop = function(){
        newTime = getCurrentTime();
        delta = (newTime - time) / 100;
        time = newTime;

        if(delta > 0.2){
            delta = 0.2;
        }

        update(delta);
        draw();
        getAnimationFrame(loop);
    };

    var initCanvas = function(){
        width = $canvas.width = window.innerWidth;
        height = $canvas.height = window.innerHeight;
        generateParticles(width * height / 4000 );

    };

    var setMousePos = function(evt){
        mousePos = new Vector(evt.offsetX, evt.offsetY);
        mouseTTL = mouseLive;
    };

    var removeMousePos = function(evt){
        mousePos = false;
    };

    var addEvent = function($el, eventType, handler) {
        if($el == null){
            return;
        }
        if ($el.addEventListener) {
            $el.addEventListener(eventType, handler, false);
        } else if ($el.attachEvent) {
            $el.attachEvent('on' + eventType, handler);
        } else {
            $el['on' + eventType] = handler;
        }
    };

    var generateParticles = function(count){
        particles = [];
        var x = 0,
            y = 0;
        for(var i = 0; i < count; i++){
            x = Math.random() * window.innerWidth;
            y = Math.random() * window.innerHeight;

            var particle = new Particle(x, y);
            particle.velocity.x = Math.random() -0.5;
            particle.velocity.y = Math.random() -0.5;
            particle.velocity.nor();
            particle.speed = particleSpeed;
            particles.push(particle);
        }

    };

    var draw = function(){
        context.clearRect ( 0 , 0 , width , height );
        context.lineWidth = 1;
        particle = {};
        for(i = 0; i < particles.length; i++){
            particle = particles[i];
            context.fillStyle = 'rgba(255, 255, 255, ' +particle.jointAlpha.toPrecision(3) + ')';
            context.strokeStyle = 'rgba(255, 255, 255, ' + particle.linkAlpha.toPrecision(3) + ')';
            context.fillRect(particle.position.x, particle.position.y, 3, 3);


            for(y = 0; y < particle.childs.length; y++){
                context.beginPath();
                context.moveTo(particle.position.x, particle.position.y);
                context.lineTo(particle.childs[y].position.x, particle.childs[y].position.y);
                context.stroke();
            }
        }
    };

    var getAnimationFrame = function(callback){
        if(window.requestAnimationFrame){
            window.requestAnimationFrame(callback);
        } else if( window.webkitRequestAnimationFrame){
            window.webkitRequestAnimationFrame(callback);
        } else if (window.mozRequestAnimationFrame){
            window.mozRequestAnimationFrame(callback);
        } else {
            window.setTimeout(callback, 1000 / 60);
        }
    };

    var update = function(delta){

        if(mouseTTL <= 0){
            mousePos = false;
        } else {
            mouseTTL -= delta;
        }

        for(i = 0; i < particles.length; i++){
            particles[i].update(delta);

            if(particles[i].position.x > width){
                particles[i].velocity.x *= -1;
                particles[i].position.x = width;
            }

            if(particles[i].position.x < 0){
                particles[i].velocity.x *= -1;
                particles[i].position.x = 0;
            }

            if(particles[i].position.y > height){
                particles[i].velocity.y *= -1;
                particles[i].position.y = height;
            }

            if(particles[i].position.y < 0){
                particles[i].velocity.y *= -1;
                particles[i].position.y = 0;
            }

            for(var y = i + 1; y < particles.length; y++){
                var other = particles;
                getDistance(particles[i], other[y]);
            }
        }
    };

    var getDistance = function(p1, p2){
        var distance = p1.position.distance(p2.position);
        var mouseDist = p1.position.distance(mousePos);

        if(distance <= particleRadius && mouseDist <= mouseRadius){
            p1.linked = true;
            p2.linked = true;
            p1.addChild(p2);

            p1.linkAlpha += 0.01;
            p1.jointAlpha += 0.02;

        } else {
            if(p1.linkAlpha <= 0){
                p1.linked = false;
                p2.linked = false;
            }
        }
    }

    var getCurrentTime = function(){
        var date = new Date();
        return date.getTime();
    };

    init();
};



$canvas = document.querySelector('.particle-net');
new ParticleNet($canvas);