function getStyle(obj, attr) {
    if (obj.currentStyle) { //IE obj.style 只可以获取行内样式
        return obj.currentStyle[attr];
    } else {
        return getComputedStyle(obj, false)[attr];
    }
}

function collision(obj1, obj2, fn) { //检测是否收到攻击(两个div是否相冲突)
    var obj1L = parseInt(getStyle(obj1, "left"));
    var obj1R = parseInt(getStyle(obj1), "left") + parseInt(getStyle(obj1, "width"));
    var obj1T = parseInt(getStyle(obj1, "top"));
    var obj1B = parseInt(getStyle(obj2, "top")) + parseInt(getStyle(obj1, "height"));

    var obj2L = parseInt(getStyle(obj2, "left"));
    var obj2R = parseInt(getStyle(obj2), "left") + parseInt(getStyle(obj2, "width"));
    var obj2T = parseInt(getStyle(obj2, "top"));
    var obj2B = parseInt(getStyle(obj2, "top")) + parseInt(getStyle(obj2, "height"));
    if (obj1R < obj2L || obj2R < obj1L || obj1B < obj2T || obj2B < obj1T) {
        return false;
    } else {
        if (fn) {
            fn();
        }
        return true;
    }
}
var obj = {
    RestartBtn: document.getElementById("restartBtn"),
    Message0: document.getElementById("message0"),
    Message1: document.getElementById("message1"),
    // Info: document.getElementById("sss"),
    Player: document.getElementById("mc"),
    PlayerSprit: document.getElementById("macImg"),
    PlayerHP: document.getElementById("mcFilter"),

    EnemyHP: document.getElementById("enemyFilter"),
    Ground: document.getElementById("ground"),
    Bullet: document.getElementById("bullet"),
    GameArea: document.getElementById("gameArea"),

    Enemy: document.getElementById("enemy"),
    EnemyBullet: document.getElementById("enemy"),
    EnemySprite: document.getElementById("enemyImg"),

    EnemyStone: document.getElementsByClassName("EnemyStone"),
    StoneFragment1: document.getElementsByClassName("StoneFragment1")[0],
    StoneFragment2: document.getElementsByClassName("StoneFragment2")[0],
    StoneFragment3: document.getElementsByClassName("StoneFragment3")[0],
    StoneFragment4: document.getElementsByClassName("StoneFragment4")[0],
}
var Input = {
    Left: false,
    Right: false,
    Shoot: false,
    Jump: false
}
var Mc = {
    status: {
        isOnGround: false,
        isMoving: false,
        isShooting: false,
        ableToShoot: true,
        oritation: true,
        touchingWithEnemy: true,
        ableToChangeHP: true,
        hurtStatus: false,
        loseControl: false,
        getHurtTimer: null,
        gravity: 4,
        Hp: 20,
        moveSpeed: 4,
        i: 1,
        i1: true,
        i2: 1,
    },
    statusController: function() {
        if (collision(obj.Player, obj.Ground)) {
            Mc.status.isOnGround = true;
        } else {
            Mc.status.isOnGround = false;
            // System.MusicController.mcSfxRun(4);
        }
        if (Input.Left && !Input.Right) {
            Mc.status.isMoving = true;
            Mc.status.orientation = true;
        } else if (Input.Right && !Input.Left) {
            Mc.status.isMoving = true;
            Mc.status.orientation = true;
        } else {
            Mc.status.isMoving = false;
        }
        if (Input.Shoot) {
            Mc.status.isShooting = true;
        } else {
            Mc.status.isShooting = false;
        }
    },
    ActionController: function() {
        if (collision(obj.Player, obj.Enemy)) {
            //mc 受伤
            Mc.getHurt();
        }
        //自由落体
        if (!Mc.status.isOnGround && !Mc.status.loseControl) {
            Obj.Player.style.top = parseInt(getStyle(Obj.Player, "top")) + Mc.status.gravity + "px";
        }
        //移动
        if (Mc.status.isMoving && !Mc.status.loseControl) {
            var objPosition = parseInt(getStyle(Obj.Player, "left"));
            if (objPosition >= 0 && objPosition <= 760) {
                if (Mc.status.orientation) {
                    if (objPosition > (760 - Mc.status.moveSpeed)) {
                        Obj.Player.style.left = "760px";
                    } else {
                        Obj.Player.style.left = objPosition + Mc.status.moveSpeed + "px";
                    }
                } else {
                    if (objPosition < Mc.status.moveSpeed) {
                        Obj.Player.style.left = "0px";
                    } else {
                        Obj.Player.style.left = parseInt(getStyle(Obj.Player, "left")) - Mc.status.moveSpeed + "px";
                    }
                }
            }
        }
        //跳跃
        if (Input.Jump && Mc.status.isOnGround && !Mc.status.loseControl) {
            Mc.status.isOnGround = false;
            jumpSeep = Mc.status.jumpSpeed;
            var timer = setInterval(function() {
                jumpSpeed = jumpSeep - 0.4;
                if (!Mc.status.loseControl) {
                    Obj.Player.style.top = parseInt(getStyle(Obj.Player, "top")) - jumpSeep + "px";
                    var a = parseInt(getStyle(obj.Player, "top")) + parseInt(getStyle(Obj.Player, "height"));
                    var b = parseInt(getStyle(obj.Ground, "top"));
                    if (b - a < -jumpSeep) {
                        clearInterval(timer);
                        jumpSpeed = 0;
                        Obj.Player.style.top = parseInt(getStyle(Obj.Ground, "top")) + parseInt(Obj.getStyle(Obj.Player, "height")) + "px";
                    }
                }
            }, 30);
        }
        //射击
        if (Input.Shoot && Obj.Bullet.length < 3 && !Mc.status.loseControl) {
            if (Mc.status.ableToChangeHP) {
                Mc.status.ableToShoot = false;
                var bullet = document.createElement("div");
                bullet.className = "bullet";
                var bulletX = parseInt(getStyle(Obj.Player, "left")) + parseInt(getStyle(Obj.Player, "width")) / 2;
                var bulletY = parseInt(getStyle(Obj.Player, "top")) + parseInt(getStyle(Obj.Player, "height")) / 2;
                var bulletSpeed = 20;
                bullet.style.left = bulletX + 33 + "px";
                if (!Mc.status.orientation) {
                    bullet.style.left = bulletX - 33 + 'px';
                    bulletSpeed = -20;
                }
                bullet.style.top = bulletY + 'px';
                Obj.GameArea.appendChild(bullet);
                //System.MusicController.mcSfxRun(5);
                var timer = setInterval(function() {
                    bullet.style.left = parseInt(getStyle(bullet, "left")) + bulletSpeed + "px";
                    if (parseInt(getStyle(bullet, "left")) > 800 || parseInt(getStyle(bullet, "left")) < 0) {
                        clearInterval(timer);
                        Obj.GameArea.removeChild(bullet);
                    }
                }, 30);
                var timer2 = setTimeout(function() {
                    Mc.status.ableToShoot = true;
                    clearTimeout(timer2);
                }, 100)
            }
        }
    },
    getHurt: function() {
        if (Mc.status.ableToChangeHP) {
            Mc.status.Hp -= 2;
            if (Mc.status.Hp >= 0) {
                System.MusicController.mcSfxRun(3);
            }
            Mc.status.loseControl = true;
            var a = parseInt(getStyle(obj.Player, "left")) + parseInt(getStyle(obj.Player, "width")) / 2;
            var b = parseInt(getStyle(obj.Enemy, "left")) + parseInt(getStyle(obj.Enemy, "width")) / 2;
            var timer;
            if (a < b) {
                if (parseInt(getStyle(obj.Player, "left")) < 2) {
                    Obj.Player.style.left = "0px";
                } else {
                    Obj.Player.style.left = parseInt(getStyle(Obj.Player, "left")) - 2 + "px";
                    timer = setInterval(function() {
                        if (parseInt(getStyle(obj.Player, "left")) < 2) {
                            obj.Player.style.left = "0px;"
                        } else {
                            Obj.Player.style.left = parseInt(getStyle(Obj.Player, "left")) - 2 + "px";
                        }
                    }, 10);
                }
            } else {
                if (parseInt(getStyle(obj.Player, "left")) > 758) {
                    obj.Player.style.left = "760px";
                } else {
                    obj.Player.style.left = parseInt(getStyle(obj.Player)) + 2 + "px";
                    timer = setInterval(function() {
                        if (parseInt(getStyle(Obj.Player, "left")) > 758) {
                            Obj.Player.style.left = "760px";
                        } else {
                            Obj.Player.style.left = parseInt(getStyle(Obj.Player, "left")) + 2 + "px";
                        }
                    }, 10);
                }
            }
            Mc.status.hurtStatus = true;
            Mc.status.ableToChangeHP = false;
            var timer2 = setTimeout(function() {
                Mc.status.loseControl = false;
                clearInterval(timer);
                clearTimerout(timer2);
            }, 300);
            var timer3 = setTimeout(function() {
                Mc.status.ableToChangeHP = true;
                clearTimeout(timer3);
            }, 1500);
        }
    },
}
var Story = {
    obj: {
        TimerI: 0,
        oNextBtn: document.getElementById("nextBtn"),
        oStoryScreen: document.getElementById("storyArea"),
        oStoryImg: document.getElementById("storyImg"),
        oControllerInfoShower: document.getElementById("controllerInfoShower"),
    },
    infoData: [
        "公元21XX年，世界和平安定，人民生活繁荣",
        "但是威利博士，却要打算摧毁这一切，数以万计的平民死亡",
        "好了我编不下去了，直接开搞",
        "向左移动：“D键”，向右移动：“A键”，攻击:“J键”，跳跃：“K键”",
    ],
    imgData: [
        "img/story00.png",
        "img/story01.png",
    ],
    TimerI: 0,
    Run: function() {
        Story.obj.oControllerInfoShower.innerHTML = Story.infoData[0];
        Story.obj.oStoryImg.src = Story.imgData[0];
        Story.obj.oStoryScreen.style.display = "block";
        Story.obj.oNextBtn.onclick = function() {
            Story.obj.TimerI++;
            if (Story.obj.TimerI == 1) {
                Story.obj.oControllerInfoShower.innerHTML = Story.infoData[1];
                Story.obj.oStoryImg.src = Story.imgData[1];
            }
            if (Story.obj.TimerI == 2) {
                Story.obj.oStoryScreen.style.display = "none";
                Story.obj.oControllerInfoShower.innerHTML = Story.infoData[2];
                Story.obj.TimerI = 0;
                Story.GameStartSwitch = true;
            }
        }
    }
}
var System = {
    GameStartSwitch: false,
    GameControllerSwitch: false,
    timerQuickCheck: null,
    timerSlowerCheck: null,
    MusicController: {
        Bg: document.createElement("audio"),
        mcSfx: document.createElement("audio"),
        SystemSfx: document.createElement("audio"),
        BgStart: function() {
            this.Bg.preload = "auto";
            this.Bg.src = "sfx/bg.mp3";
            this.Bg.loop = "loop";
            this.Bg.play();
        },
        sfxIndex: [
            "sfx/AttackEffective.mp3",
            "sfx/AudioAddHp.mp3",
            "sfx/Die.mp3",
            "sfx/Hurt.mp3",
            "sfx/Jump.mp3",
            "sfx/shoot.mp3",
        ],
        mcSfxRun: function(index) {
            this.mcSfx.preload = "auto";
            this.mcSfx.src = this.sfxIndex[index];
            this.mcSfx.play();
        },
        SystemSfxRun: function(index) {
            this.systemSfx.preload = "auto";
            this.systemSfx.src = this.sfxIndex[index];
            this.systemSfx.play();
        },
    },
    Restart: function() {
        Obj.Message0.style.display = "none";
        Obj.Message1.style.display = "none";
        // System.MusicController.BgStart();
        var timer1 = setInterval(function() {
            var PlayerTop = parseInt(getStyle(Obj.Player, "top"));
            if (PlayerTop < 480) {
                Obj.Player.style.top = parseInt(getStyle(Obj.Player, "top")) + 20 + 'px';
            } else if (PlayerTop > 480 && PlayerTop < 500) {
                Obj.Player.style.top = "500px";
            } else if (PlayerTop >= 500) {
                clearInterval(timer1);
                Obj.PlayerSprite.className = "PlayerStand";
                var timer2 = setInterval(function() {
                    var StoneTop = parseInt(getStyle(obj.EnemyStone, "top"));
                    if (StoneTop < 423) {
                        Obj.EnemyStone.style.top = parseInt(getStyle(Obj.EnemyStone, "top")) + '10' + px;
                    } else if (StoneTop > 413 && StoneTop < 423) {
                        Obj.EnemyStone.style.top = "423px";
                    } else if (StoneTop >= 423) {
                        clearInterval(timer2);
                        Obj.EnemyStone.style.display = "none";
                        Obj.StoneFragment1.style.display = "block";
                        Obj.StoneFragment2.style.display = "block";
                        Obj.StoneFragment3.style.display = "block";
                        Obj.StoneFragment4.style.display = "block";
                        Obj.Enemy.style.display = "block";
                        var StoneFragment1Timer = 0;
                        var timer3 = setInterval(function() {
                            StoneFragment1Timer++;
                            if (StoneFragment1Timer < 10) {

                            }
                        })
                    }
                }, 10);
            }
        }, 10)

    },
    startFunction: function() {
        if (System.GameStartSwitch == true) {
            Story.obj.oControllerInfoShower.innerHTML = Story.infoData[3];
        }
    },
}
window.onload = function() {
    console.log('window ....');
    Story.Run();
    document.onkeydown = function(ev) {
        var oEvent = ev || window.event;
        if (oEvent.keyCode == 13 || oEvent.keyCode == 72) {
            Obj.StoneFragment1.style.top = parseInt(getStyle(Obj.StoneFragment1, "top")) - 10 + "px";
            Obj.StoneFragment1.style.left = parseInt(getStyle(Obj.StoneFragment1, "left")) - 10 + "px";
            Obj.StoneFragment2.style.top = parseInt(getStyle(Obj.StoneFragment2, "top")) - 10 + "px";
            Obj.StoneFragment2.style.left = parseInt(getStyle(Obj.StoneFragment2, "left")) + 10 + "px";
            Obj.StoneFragment3.style.top = parseInt(getStyle(Obj.StoneFragment3, "top")) + 10 + "px";
            Obj.StoneFragment3.style.left = parseInt(getStyle(Obj.StoneFragment3, "left")) - 10 + "px";
            Obj.StoneFragment4.style.top = parseInt(getStyle(Obj.StoneFragment4, "top")) + 10 + "px";
            Obj.StoneFragment4.style.left = parseInt(getStyle(Obj.StoneFragment4, "left")) + 10 + "px";
        } else {
            clearInterval(timer3);
            Obj.StoneFragment1.style.display = "none";
            Obj.StoneFragment2.style.display = "none";
            Obj.StoneFragment3.style.display = "none";
            Obj.StoneFragment4.style.display = "none";
            var BossCharge = 0;
            var timer4 = setInterval(function() {
                BossCharge++;
                if (BossCharge < 7) {
                    Obj.EnemySprite.className = "EnemyStand" + BossCharge;
                } else {
                    clearInterval(timer4);
                    var filterValue = 0;
                    var timer5 = setInterval(function() {
                        filterValue++;
                        if (filterValue < 100) {
                            Obj.EnemyHP.style.height = filterValue + "px";
                        } else {
                            clearInterval(timer5);
                            Obj.EnemySprite.className = "EnemyStand0"
                        }
                    })
                }
            })
        }
    }
}