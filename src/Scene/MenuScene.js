var MenuScene;
MenuScene = cc.Scene.extend({
    _hero: null,
    _aboutBtn: null,
    _hero: null,
    ctor: function () {
        this._super();

        this.scheduleUpdate();

        var layer = new cc.Layer();
        this.addChild(layer);

        var size = cc.winSize;
        var bgWelcome = new cc.Sprite(res.BgWelcome_jpg);
        bgWelcome.x = size.width / 2;
        bgWelcome.y = size.height / 2;
        layer.addChild(bgWelcome, 1);

  
        var title = new cc.Sprite("#welcome_title.png");
        title.x = 800;
        title.y = 500;
        layer.addChild(title, 2);

        this._hero = new cc.Sprite("#welcome_hero.png");
        this._hero.x = -300;
        this._hero.y = 400;
        layer.addChild(this._hero, 2);

        var actionMoveTo = new cc.moveTo(2, cc.p(size.width / 3, this._hero.y)).easing(cc.easeOut(2));
        this._hero.runAction(actionMoveTo);

        this._playBtn = new cc.MenuItemImage("#welcome_playButton.png", "#welcome_playButton.png", this._play);
        this._playBtn.x = 700;
        this._playBtn.y = 350;

        this._aboutBtn = new cc.MenuItemImage("#welcome_aboutButton.png", "#welcome_aboutButton.png", this._about, this);
        this._aboutBtn.x = 500;
        this._aboutBtn.y = 250;

        var soundButton = new SoundButton();
        soundButton.x = 45;
        soundButton.y = size.height - 45;

        var menu = new cc.Menu(this._aboutBtn, this._playBtn, soundButton);
        layer.addChild(menu, 3);
        menu.x = menu.y = 0;
        
        Sound.playMenuBgMusic();

    },

    update: function () {
        var currentDate = new Date();
        this._hero.y = 400 + (Math.cos(currentDate.getTime() * 0.002)) * 25;
        this._playBtn.y = 350 + (Math.cos(currentDate.getTime() * 0.002)) * 10;
        this._aboutBtn.y = 250 + (Math.cos(currentDate.getTime() * 0.002)) * 10;
    },

    _about: function () {
        cc.director.runScene(new AboutScene());
    },

    _play: function () {
        cc.director.runScene(new PlayScene());
    }
});