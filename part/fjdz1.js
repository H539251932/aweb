//飞机可以飞
var meplane="";

var myplane={
    "fly":function(l,t){
        if(l>=parseInt(meplane.offsetWidth/2)&&l<=parseInt(gameAreaWidth)-meplane.offsetWidth/2){
            if(t>=parseInt(meplane.offsetHeight/2)&&t<=parseInt(gameAreaHeight)-meplane.offsetHeight/2){
                meplane.style.left=(l-meplane.offsetWidth/2)+"px";
                meplane.style.top=(t-meplane.offsetHeight/2)+"px";
            }
        }
    }
}

var game={
    status:0,
    "gamestatus":function(){
        game.status=1;
    }
}

window.onload=function(){
    meplane=document.querySelector(".myplane");
    gameArea=document.querySelector(".gameArea");
    gameAreaWidth=window.getComputedStyle(gameArea,null).width;
    gameAreaHeight=window.getComputedStyle(gameArea,null).height;
    gameArea.onmousemove=function(e){
        if(game.status){
            myplane.fly(e.offsetX,e.offsetY);
        }      
    }
}

function startGame(){
    var shadow=document.querySelector(".shadow");
    shadow.style.display="none";
    game.gamestatus();
}