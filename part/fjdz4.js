var meplane = "";

var myplane = {
    "fly": function (l, t) {
        if (l >= 53 && l <= parseInt(gameAreaWidth) - 53) {
            if (t >= 38 && t <= parseInt(gameAreaHeight) - 38) {
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

// var myplane = {
//     fly: function (l, t) {
//         if (l >= parseInt(meplane.offsetWidth / 2) && l <= parseInt(gameAreaWidth) - meplane.offsetWidth / 2) {
//             if (t >= parseInt(meplane.offsetHeight / 2) && t <= parseInt(gameAreaHeight) - meplane.offsetHeight / 2) {
//                 meplane.style.left = (l - meplane.offsetWidth / 2) + "px";
//                 meplane.style.top = (t - meplane.offsetHeight / 2) + "px";
//             }
//         }
//     },
//     sendBullet: function (l, t) {
//         if (l > 0 && l < parseInt(meplane.offsetWidth / 2)) {
//             this.left = parseInt(meplane.offsetWidth / 2) - 5;
//         } else if (l > (parseInt(gameAreaWidth) - meplane.offsetWidth / 2) && l < parseInt(gameAreaWidth)) {
//             this.left = parseInt(gameAreaWidth - meplane.offsetWidth / 2) - 5;
//         } else {
//             this.left = l - 5;
//         }
//         this.top = t - 35 - parseInt(meplane.offsetHeight / 2);
//         game.BulletArray.push(new Bullet(this.left, this.top));
//     }
// }

var game = {
    status: false,
    BulletArray:[],
    bulletFlyTime:0,
    //
    score:0,
    time:0,
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
        this.createnemyplane();
        this.enemyplaneFly();
        this.getTime();
    },
    bulletFly: function () {
        this.bulletFlyTime = setInterval(function () {
            if (game.status) {
                for (var i = game.BulletArray.length - 1; i >= 0; i--) {
                    game.BulletArray[i].fly();
                }
                game.isBoom();
            }
        }, 10);
    },
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
    //获取时间
    getTime:function(){
        var timeNum=document.querySelector(".timeNum");
        this.timeClock=setInterval(function(){
            timeNum.innerHTML=(++game.time);      
        },1000);
    },

    getScore:function(s){
        game.score+=s;
        var scoreNum=document.querySelector(".scoreNum");
        var timeNum=document.querySelector(".timeNum");
        scoreNum.innerHTML=game.score;
        if(game.score>=500){
            game.score=0;
            scoreNum.innerHTML=0;
        }
        if(game.score<0){
            game.gameOver();
            scoreNum.innerHTML=0;
            timeNum.innerHTML=0;
        }
    },
    gameOver:function(){
        this.status=false;
        bulletId=0;
        enemyplaneId=0;
        clearInterval(this.bulletFlyTime);
        clearInterval(this.createnemyplaneTime);
        clearInterval(this.enemyplaneFlyTime);
        clearInterval(this.timeClock);
        var b=document.getElementsByClassName("bullet");
        var e=document.getElementsByClassName("enemyplane");
        for(var i=0,len=b.length;i<len;i++){
            gameArea.removeChild(b[0]);
        }
        for(var i=0,len=e.length;i<len;i++){
            gameArea.removeChild(e[0]);
        }
        this.BulletArray=[];
        this.enemyplaneArray=[];
        var shadow=document.querySelector(".shadow");
        shadow.style.display="flex";
        var shadowCenter=document.querySelector(".shadowCenter");
        shadowCenter.style.display="flex";
        var btn=document.querySelector(".gamebtn");
        btn.style.display="none";
        var flyTimeNum=document.querySelector(".flyTimeNum");
        flyTimeNum.innerHTML=game.time;
        var rank=document.querySelector(".rank");
        if(game.time<=30){
            rank.innerHTML="倔强青铜";
        }else if(game.time<=60){
            rank.innerHTML="秩序白银";
        }else if(game.time<=120){
            rank.innerHTML="荣耀黄金";
        }else if(game.time<=240){
            rank.innerHTML="尊贵铂金";
        }else if(game.time<=360){
            rank.innerHTML="永恒钻石";
        }else{
            rank.innerHTML="最强王者";
        }
    },
    //敌机爆炸
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
    game.getScore(this.score);
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

