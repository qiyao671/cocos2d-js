/**
 * Created by lqy on 16-6-12.
 */
var GameOverUI = cc.Layer.extend({
    _distanceText: null,
    _scoreText: null,
    _gameScene: null,
    ctor: function (gameScene) {
        this._super();
        this._gameScene = gameScene;
        var winSize = cc.winSize;
        var bg = new cc.LayerColor(cc.color(0,0,0,200), winSize.width, winSize.height);
        this.addChild(bg, 1);

        var title = new cc.LabelBMFont("HERO IS DEAD", res.fnt);
        title.x = winSize.width / 2;
        title.y = winSize.height - 120;
        this.addChild(title, 1);

        this._distanceText = new cc.LabelBMFont("DISTANCE TRAVELLED: 000000", res.fnt);
        this._distanceText.x = winSize.width / 2;
        this._distanceText.y = winSize.height - 220;
        this.addChild(this._distanceText, 2);

        this._scoreText = new cc.LabelBMFont("SCORE: 000000", res.fnt);
        this._scoreText.x = winSize.width / 2;
        this._scoreText.y = winSize.height - 270;
        this.addChild(this._scoreText, 2);

        var replayBtn = new cc.MenuItemImage("#gameOver_playAgainButton.png", "#gameOver_playAgainButton.png", this._replay.bind(this));
        var aboutBtn = new cc.MenuItemImage("#gameOver_aboutButton.png", "#gameOver_aboutButton.png", this._about.bind(this));
        var mainBtn = new cc.MenuItemImage("#gameOver_mainButton.png", "#gameOver_mainButton.png", this._return.bind(this));
        var menu = new cc.Menu(replayBtn, aboutBtn, mainBtn);
        menu.alignItemsVertically();
        this.addChild(menu, 3);
        menu.y = winSize.height / 2 - 100;
    },

    init: function () {
        this._distanceText.setString("DISTANCE TRAVELLED: " + parseInt(Game.user.distance));
        this._scoreText.setString("SCORE " + parseInt(Game.user.score));
    },

    _replay: function () {
        this._gameScene.init();
    },

    _about: function () {
        cc.director.runScene(new AboutScene);
    },

    _return: function () {
        cc.director.runScene(new MenuScene);
    }



});