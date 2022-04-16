var meplane = "";

//飞机包括飞和发射子弹的功能
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

//从此处开始
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

//游戏对象有游戏开始和控制子弹飞的功能
var game = {
    status: false,
    BulletArray:[],
    bulletFlyTime:0,
    "gamestatus": function () {
        this.status = true;
        this.bulletFly();
    },
    bulletFly: function () {
        this.bulletFlyTime = setInterval(function () {
            if (game.status) {
                for (var i = game.BulletArray.length - 1; i >= 0; i--) {
                    game.BulletArray[i].fly();
                }
            }
        }, 10);
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

//子弹飞行
Bullet.prototype.fly = function () {
    this.top -= 5;
    var thisBullet = document.getElementById(this.id);
    if (this.top >= 0) {
        thisBullet.style.top = this.top + "px";
    } else {
        this.disappear();
    }
}

//子弹出界面消失
Bullet.prototype.disappear = function () {
    var thisBullet = document.getElementById(this.id);
    gameArea.removeChild(thisBullet);
    for (var  i = game.BulletArray.length-1;i >= 0; i--) {
        if (game.BulletArray[i] == this) {
            game.BulletArray.splice(i, 1);
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