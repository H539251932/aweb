var meplane = "";

var myplane = {
    "fly": function (l, t) {
        if (l >= 53 && l <= parseInt(gameAreaWidth) - 53) {
            if (t >= 38 && t <= parseInt(gameAreaWidth) - 38) {
                meplane.style.left = (l - 53) + "px";
                meplane.style.top = (t - 38) + "px";
            }
        }
    },
    sendBullet: function (l, t) {
        if (l > 0 && l < 53) {
            this.left = 53 - 5;
        } else if (l > parseInt(gameAreaWidth) - 53 && l < parseInt(gameAreaWidth)) {
            this.left = parseInt(gameAreaWidth) - 53 - 5;
        } else {
            this.left = l - 5;
        }
        this.top = t - 35 - 38;
        game.BulletArray.push(new Bullet(this.left, this.top));
    }
}


var game = {
    status: false,
    BulletArray:[],
    bulletFlyTime:0,
    //在子弹的基础上添加的内容[后面用——表示]
    enemyplaneArray:[],
    enemyplaneFlyTime:0,
    createnemyplaneTime:0,
    timeClock:0,
    //
    "gamestatus": function () {
        this.status = true;
        this.score=0;
        this.time=0;
        this.bulletFly();
        //——
        this.createnemyplane();
        this.enemyplaneFly();
    },
    bulletFly: function () {
        this.bulletFlyTime = setInterval(function () {
            if (game.status) {
                for (var i = game.BulletArray.length - 1; i >= 0; i--) {
                    game.BulletArray[i].fly();
                }
                //——
                game.isBoom();
            }
        }, 10);
    },
    //——
    createnemyplane:function(){
        this.createnemyplaneTime=setInterval(function(){
            if(game.status){
                game.enemyplaneArray.push(new enemyplane())
            }
        },800);
    },
    enemyplaneFly:function(){
        this.enemyplaneFlyTime=setInterval(function(){
            if(game.status){
                for(var i=game.enemyplaneArray.length-1;i>=0;i--){
                    game.enemyplaneArray[i].fly();
                }
            }
        },30);
    },
    isBoom:function(){
        for(var i=game.BulletArray.length-1;i>=0;i--){
            var pos=game.BulletArray[i].isHit();
            if(pos!=-1){
                game.enemyplaneArray[pos].Hit();
                game.BulletArray[i].disappear();
            }
        }
    }
}


//注意此处Bullet
var bulletId = 0;
function Bullet(left, top) {
    this.id = "Bullet" + (++bulletId)%10000;
    this.left = left;
    this.top = top;
    var thisBullet = document.createElement("div");
    thisBullet.id = this.id;
    thisBullet.className = "Bullet";
    thisBullet.style.left = this.left + "px";
    thisBullet.style.top = this.top + "px";
    gameArea.appendChild(thisBullet);

}

Bullet.prototype.fly = function () {
    this.top -= 5;
    var thisBullet = document.getElementById(this.id);
    if (this.top >= 0) {
        thisBullet.style.top = this.top + "px";
    } else {
        this.disappear();
    }

}

Bullet.prototype.disappear = function () {
    var thisBullet = document.getElementById(this.id);
    gameArea.removeChild(thisBullet);
    for (var  i = game.BulletArray.length-1;i >= 0; i--) {
        if (game.BulletArray[i] == this) {
            game.BulletArray.splice(i, 1);
        }
    }
}




//——
Bullet.prototype.isHit=function(){
    for(var i=game.enemyplaneArray.length-1;i>=0;i--){
        var enemyplaneWidth=document.getElementById(game.enemyplaneArray[i].id).offsetWidth;
        var enemyplaneHeight=document.getElementById(game.enemyplaneArray[i].id).offsetHeight;
        if(this.left-game.enemyplaneArray[i].left>0&&this.left-game.enemyplaneArray[i].left<enemyplaneWidth){
            if(this.top-game.enemyplaneArray[i].top>0&&this.top-game.enemyplaneArray[i].top<enemyplaneHeight){
                return i;
            }
        }
    }
    return -1;
}


var enemyplaneId=0;
function enemyplane(){
    this.id="enemyplane"+(++enemyplaneId);
    this.top = 0;
    var color = "";
    this.score = 0;
    this.left = Math.random()*(parseInt(gameAreaWidth)-100);
    switch(parseInt(Math.random()*3)){
        case 0:
            color = "e1"; 
            this.score =10;
            break;
        case 1:
            color = "e2";
            this.score =20;
            break;
        case 2:
            color = "e3";
            this.score =30;
            break;
    }
    var thisenemyplane=document.createElement("div");
    thisenemyplane.id=this.id;
    thisenemyplane.className="enemyplane";
    thisenemyplane.classList.add(color);
    thisenemyplane.style.left = this.left + "px";
    thisenemyplane.top = this.top + "px";
    gameArea.appendChild(thisenemyplane);
}

enemyplane.prototype.fly = function(){
    this.top +=1;
    var thisenemyplane = document.getElementById(this.id);
    if(this.top < parseInt(gameAreaHeight)){
        thisenemyplane.style.top = this.top + "px";
    }else{  //敌机飞出游戏区域
        for(var i = game.enemyplaneArray.length - 1; i>=0;i--){
            if(game.enemyplaneArray[i] == this){
            game.enemyplaneArray.splice(i,1);
            }
        }
        gameArea.removeChild(thisenemyplane);
        game.getScore(this.score*(-5));
    }
}

enemyplane.prototype.Hit=function(){
    var thisenemyplane=document.getElementById(this.id);
    thisenemyplane.style.background='url(../image/boom.gif)';
    thisenemyplane.style.backgroundSize="cover";
    setTimeout(function(){
        gameArea.removeChild(thisenemyplane);
    }, 500);
    for(var i=game.enemyplaneArray.length-1;i>=0;i--){
        if(game.enemyplaneArray[i]==this){
            game.enemyplaneArray.splice(i,1);
        }
    }
}




window.onload = function () {
    meplane = document.querySelector(".myplane");
    gameArea = document.querySelector(".gameArea");
    gameAreaWidth = document.defaultView.getComputedStyle(gameArea, null).width;
    gameAreaHeight = document.defaultView.getComputedStyle(gameArea, null).height;
    gameArea.onmousemove = function (event) {
        if (game.status) {
            myplane.fly(event.offsetX, event.offsetY);
        }
    }
    gameArea.onmousedown = function (e) {
        if (game.status) {
            myplane.sendBullet(e.offsetX, e.offsetY);
        }
    }
}

function startGame() {
    var shadow = document.querySelector(".shadow");
    shadow.style.display = "none";
    game.gamestatus();
}

