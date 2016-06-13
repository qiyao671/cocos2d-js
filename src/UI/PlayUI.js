/* Created by lqy on 16-6-4. */
var PlayUI = cc.Layer.extend({
    _lifeText: null,
    _distanceText: null,
    _scoreText: null,
    ctor: function (gameScene) {
        this._super();
        this._gameScene = gameScene;
        var fnt = res.fnt;
        var winSize = cc.winSize;

        //life
        var lifeLabel = new cc.LabelBMFont("LIVES", fnt);
        this.addChild(lifeLabel);
        lifeLabel.x = 300;
        lifeLabel.y = winSize.height - 25;
        this._lifeText = new cc.LabelBMFont("0", fnt);
        this.addChild(this._lifeText);
        this._lifeText.x = 300;
        this._lifeText.y = winSize.height - 60;

        //distance
        var distanceLabel = new cc.LabelBMFont("DISTANCE", fnt);
        this.addChild(distanceLabel);
        distanceLabel.x = 550;
        distanceLabel.y = winSize.height - 25;
        this._distanceText = new cc.LabelBMFont("0", fnt);
        this.addChild(this._distanceText);
        this._distanceText.x = 550;
        this._distanceText.y = winSize.height - 60;

        //scoreLabel
        var scoreLabel = new cc.LabelBMFont("SCORE", fnt);
        this.addChild(scoreLabel);
        scoreLabel.x = 800;
        scoreLabel.y = winSize.height - 25;
        this._scoreText = new cc.LabelBMFont("0", fnt);
        this.addChild(this._scoreText);
        this._scoreText.x = 800;
        this._scoreText.y = winSize.height - 60;

        //button menu
        var pauseButton = new cc.MenuItemImage("#pauseButton.png", "#pauseButton.png",this._pauseResume);
        var soundButton = new SoundButton();
        var menu = new cc.Menu(soundButton, pauseButton);
        menu.alignItemsHorizontallyWithPadding(30);
        menu.x = 80;
        menu.y = winSize.height - 45;
        this.addChild(menu);

        return true;

    },

    _pauseResume: function () {
        if(cc.director.isPaused()) {
            cc.director.resume();
        }
        else {
            cc.director.pause();
        }
    },
    
    update: function () {
        this._lifeText.setString(Game.user.lives.toString());
        this._distanceText.setString(parseInt(Game.user.distance).toString());
        this._scoreText.setString(Game.user.score.toString());
    }
})