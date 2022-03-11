//我方飞机对象
var myAircraft={
    fly:function(l,t){
        if (l >= parseInt(meAircraft.offsetWidth/2) && l <= parseInt(gameAreaWidth) - meAircraft.offsetWidth/2) {
            if (t <= parseInt(gameAreaHeight) - meAircraft.offsetHeight/2 && t >= parseInt(meAircraft.offsetHeight/2)) {
                meAircraft.style.left = (l - meAircraft.offsetWidth/2) + "px";
                meAircraft.style.top = (t - meAircraft.offsetHeight/2) + "px";
            }
        }
    },
    sendBullet:function(l,t){
        if(l>0 && l< parseInt(meAircraft.offsetWidth/2)){
            this.left = parseInt(meAircraft.offsetWidth/2)-5;
        }else if(l>(parseInt(gameAreaWidth)-meAircraft.offsetWidth/2) && l<parseInt(gameAreaWidth)){
            this.left = parseInt(gameAreaWidth - meAircraft.offsetWidth/2)-5;
        }else{
            this.left = l-5;
        }
        this.top = t -35-parseInt(meAircraft.offsetHeight/2);
        game.bulletArray.push(new Bullet(this.left,this.top));
    }
}
//游戏对象
var game={
    status:false,
    score:0,
    time:0,
    bulletArray:[],
    enemyAircraftArray:[],
    bulletFlyTime: 0,
    enemyAircraftFlyTime: 0,
    createEnemyAircraftTime: 0,
    timeClock:0,
    "gamestart":function(){
        this.status=true;
        this.score=0;
        this.time=0;
        this.bulletFly();
        this.createEnemyAircraft();
        this.enemyAircraftFly();
        this.getTime();
    },
    //每隔10ms所有子弹移动一次
    bulletFly:function(){
        this.bulletFlyTime=setInterval(function(){
            if(game.status){
                for(var i = game.bulletArray.length - 1; i>=0;i--){
                    game.bulletArray[i].fly();
                }
                game.isBoom();
            }
        },10);
    },
    //每隔800ms创建敌机
    createEnemyAircraft:function(){
    this.createEnemyAircraftTime=setInterval(function(){
            if(game.status){
                game.enemyAircraftArray.push(new EnemyAircraft());
            }
        },800);
    },
    //所有敌机每隔30ms移动一次
    enemyAircraftFly:function(){
        this.enemyAircraftFlyTime=setInterval(function(){
            if(game.status){
                for(var i = game.enemyAircraftArray.length - 1; i>=0;i--){
                    game.enemyAircraftArray[i].fly();
                }
            }
        },30);
    },
    //定义时钟
    getTime:function(){
        var timeNum=document.querySelector(".timeNum");
        this.timeClock=setInterval(function(){
            timeNum.innerHTML=(++game.time);
        },1000);
    },
    //计算分数
    getScore:function(s){
        game.score+=s;
        var scoreNum=document.querySelector(".scoreNum");
        var timeNum = document.querySelector(".timeNum");
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
    //游戏结束
    gameOver:function(){
        this.status=false;
        bulletId=0;
        enemyAircraftId=0;
        clearInterval(this.bulletFlyTime);
        clearInterval(this.createEnemyAircraftTime);
        clearInterval(this.enemyAircraftFlyTime);
        clearInterval(this.timeClock);
        var b = document.getElementsByClassName("bullet");
        var e = document.getElementsByClassName("enemyAircraft");
        for(var i =0,len=b.length;i<len;i++){
            gameArea.removeChild(b[0]);
        }
        for(var i =0,len=e.length;i<len;i++){
            gameArea.removeChild(e[0]);
        }
        this.bulletArray=[];
        this.enemyAircraftArray=[];
        var shadow=document.querySelector(".shadow");
        shadow.style.display="flex";
        var shadowCenter=document.querySelector(".shadowCenter");
        shadowCenter.style.display="flex";
        var btn=document.querySelector(".gamebtn");
        btn.style.display="none";
        var flyTimeNum=document.querySelector(".flyTimeNum");
        flyTimeNum.innerHTML=game.time;
        var rank = document.querySelector(".rank");
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
    //判读子弹数组中的子弹是否击中敌机，若击中，则返回击中敌机的数组下标，敌机出现爆炸效果
    isBoom:function(){
        for(var i = game.bulletArray.length-1;i>=0;i--){
            var pos = game.bulletArray[i].isHit();
            if(pos!=-1){
                game.enemyAircraftArray[pos].Hit();
                game.bulletArray[i].disappear();
            }
        }
    }
}
var bulletId = 0;
function Bullet(left,top){  //子弹构造函数
    this.id = "bullet" + (++bulletId);
    this.left = left;
    this.top = top;
    var thisbullet = document.createElement("div");
    thisbullet.id = this.id;
    thisbullet.className = "bullet";
    thisbullet.style.left = this.left + "px";
    thisbullet.style.top = this.top + "px";
    gameArea.appendChild(thisbullet);
}
//子弹飞
Bullet.prototype.fly = function(){
    this.top -= 5;
    var thisbullet = document.getElementById(this.id);
    if(this.top >= 0){
        thisbullet.style.top = this.top + "px";
    }else{
        this.disappear();
    }
}
//子弹消失
Bullet.prototype.disappear=function(){
    var thisbullet = document.getElementById(this.id);
    gameArea.removeChild(thisbullet);
    for(var i = game.bulletArray.length - 1; i >= 0;i--){
        if(game.bulletArray[i]==this){
            game.bulletArray.splice(i,1);
        }
    }
}
//判断子弹是否击中敌机
Bullet.prototype.isHit=function(){
    for(var i = game.enemyAircraftArray.length-1;i>=0;i--){
        var enemyAircraftWidth=document.getElementById(game.enemyAircraftArray[i].id).offsetWidth;
        var enemyAircraftHeight=document.getElementById(game.enemyAircraftArray[i].id).offsetHeight;
        if(this.left-game.enemyAircraftArray[i].left>0&&this.left-game.enemyAircraftArray[i].left<enemyAircraftWidth){
            if(this.top-game.enemyAircraftArray[i].top>0&&this.top-game.enemyAircraftArray[i].top<enemyAircraftHeight){
                return i;
            }
        }
    }
    return -1;
}
 //敌机构造函数
var enemyAircraftId = 0;
function EnemyAircraft(){
    this.id = "enemyAircraft" + (++enemyAircraftId);
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
    var thisEnemyAircraft = document.createElement("div");
    thisEnemyAircraft.id = this.id;
    thisEnemyAircraft.className = "enemyAircraft";
    thisEnemyAircraft.classList.add(color);
    thisEnemyAircraft.style.left = this.left + "px";
    thisEnemyAircraft.style.top = this.top + "px";
    gameArea.appendChild(thisEnemyAircraft);
}
//敌机飞
EnemyAircraft.prototype.fly = function(){
    this.top +=1;
    var thisEnemyAircraft = document.getElementById(this.id);
    if(this.top < parseInt(gameAreaHeight)){
        thisEnemyAircraft.style.top = this.top + "px";
    }else{  //敌机飞出游戏区域
        for(var i = game.enemyAircraftArray.length - 1; i>=0;i--){
            if(game.enemyAircraftArray[i] == this){
            game.enemyAircraftArray.splice(i,1);
            }
        }
        gameArea.removeChild(thisEnemyAircraft);
        game.getScore(this.score*(-5));
    }
}
//敌机被击中
EnemyAircraft.prototype.Hit=function(){
    var thisEnemyAircraft = document.getElementById(this.id);
    thisEnemyAircraft.style.background='url(./image/boom.gif)';
    thisEnemyAircraft.style.backgroundSize="cover";
    setTimeout(function(){
        gameArea.removeChild(thisEnemyAircraft);
    },500);
    for(var i = game.enemyAircraftArray.length - 1; i>=0;i--){
        if(game.enemyAircraftArray[i] == this){
        game.enemyAircraftArray.splice(i,1);
        }
    }
    game.getScore(this.score);
}
var meAircraft="";
var gameArea="";
var gameAreaWidth="";
var gameAreaHeight="";
window.onload=function(){
    meAircraft=document.getElementById("myAircraft");
    gameArea=document.querySelector(".gameArea");
    gameAreaWidth=document.defaultView.getComputedStyle(gameArea,null).width;
    gameAreaHeight=document.defaultView.getComputedStyle(gameArea,null).height
    gameArea.onmousemove=function(event){
        if(game.status){
            myAircraft.fly(event.offsetX,event.offsetY);
        }
    }
    gameArea.onmousedown=function(e){
        if(game.status){
            myAircraft.sendBullet(e.offsetX,e.offsetY);
        }
    }
}
//开始或重新开始按钮单击事件函数
function startGame(){
    var shadow=document.querySelector(".shadow");
    shadow.style.display="none";
    game.gamestart();
}