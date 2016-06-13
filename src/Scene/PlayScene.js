var PlayScene = cc.Scene.extend({
	_bg: null,
	_hero: null,
	_ui: null,
	_touchY: 0,
	_foodManager: null,
	itemBatchLayer: null,
	_obstacleManager:null,
	_cameraShake:0,
	_gameOverUI: null,
	_mushroomEffect: null,
	_coffeeEffect: null,
	_windEffect: null,
	ctor: function() {
		this._super();
		
		var layer = new cc.Layer();
		this.addChild(layer, 1);
		
		this._bg = new BackGround();
		layer.addChild(this._bg, 1);
		
		this._hero = new Hero();
		// this._hero.x = 100;
		// this._hero.y = 400;

		layer.addChild(this._hero, 3);

		this.itemBatchLayer = new cc.SpriteBatchNode("res/pics/texture.png");
		this.addChild(this.itemBatchLayer, 4);

		this._ui = new PlayUI();
		layer.addChild(this._ui, 2);
		this._ui.update();
		
		this._foodManager = new FoodManager(this);
		this._obstacleManager = new ObstacleManager(this);
		this._gameOverUI = new GameOverUI(this);
		this.addChild(this._gameOverUI, 5);

		this.init();
	},

	init: function () {
		Sound.stop();
		Sound.playGameBgMusic();
		
		if(this._gameOverUI)
			this._gameOverUI.setVisible(false);

		var winSize = cc.winSize;
		Game.user.lives = GameConstants.HERO_LIVES;
		Game.user.score = Game.user.distance = 0;
		Game.gameState = GameConstants.GAME_STATE_IDLE;
		Game.user.heroSpeed = this._bg.speed = 0;

		this._hero.x = -winSize.width / 2;
		this._hero.y = winSize.height / 2;

		this._touchY = winSize.height / 2;

		if ("touches" in cc.sys.capabilities)
			cc.eventManager.addListener({
				event: cc.EventListener.TOUCH_ALL_AT_ONCE,
				onTouchesMoved: this._onTouchMoved.bind(this)
			}, this);
		else
			cc.eventManager.addListener({
				event: cc.EventListener.MOUSE,
				onMouseMove: this._onMouseMove.bind(this)
			}, this);

		this._foodManager.init();
		this._obstacleManager.init();

		this.stopCoffeeEffect();
		this.stopWindEffect();
		this.stopMushroomEffect();

		this.scheduleUpdate();
	},

	_onTouchMoved: function (touches, event) {
		if (Game.gameState != GameConstants.GAME_STATE_OVER)
			this._touchY = touches[0].getLocation().y;
	},

	_onMouseMove: function (event) {
		if (Game.gameState != GameConstants.GAME_STATE_OVER)
			this._touchY = event.getLocationY();
	},

	_gameOver:function(){
		if(!this._gameOverUI){
			this._gameOverUI = new GameOverUI(this);
			this.addChild(this._gameOverUI);
		}
		this._gameOverUI.setVisible(true);
		this._gameOverUI.init();
	},

	update: function (elapsed) {

		var winSize = cc.winSize;
		switch (Game.gameState)
		{
			case GameConstants.GAME_STATE_IDLE:
			{
				if (this._hero.x < winSize.width * 0.5 * 0.5) {
					this._hero.x += ((winSize.width * 0.5 * 0.5 + 10) - this._hero.x) * 0.05;
					this._hero.y -= (this._hero.y - this._touchY) * 0.1;
					Game.user.heroSpeed += (GameConstants.HERO_MIN_SPEED - Game.user.heroSpeed) * 0.05;
					this._bg.speed = Game.user.heroSpeed * elapsed;
				}
				else {
					Game.gameState = GameConstants.GAME_STATE_FLYING;
					this._hero.state = GameConstants.HERO_STATE_FLYING;
				}
				this._ui.update();
				this._handleHeroPose();
				break;
			}
			case GameConstants.GAME_STATE_FLYING:
			{
				//coffee: speed up
				if(Game.user.coffee > 0) {
					Game.user.heroSpeed += (GameConstants.HERO_MAX_SPEED - Game.user.heroSpeed) * 0.2;
				}
				else {
					this.stopCoffeeEffect();
				}


				//common state
				if(Game.user.hitObstacle <= 0) {
					this._hero.state = GameConstants.HERO_STATE_FLYING;
					this._hero.y -= (this._hero.y - this._touchY) * 0.1;

					if(Game.user.heroSpeed > GameConstants.HERO_MIN_SPEED + 100) {
						this.showWindEffect();
						this._hero.toggleSpeed(true);
					}
					else {
						this._hero.toggleSpeed(false);
						this.stopWindEffect();
					}

					this._handleHeroPose();
				}
				//hit state
				else {
					if (Game.user.coffee <= 0) {
						if(this._hero.state != GameConstants.HERO_STATE_HIT) {
							this._hero.state = GameConstants.HERO_STATE_HIT;
						}
						this._hero.y -= (this._hero.y - winSize.height / 2) * 0.1;
						if (this._hero.y > winSize.height * 0.5) {
							this._hero.rotation -= Game.user.hitObstacle * 2;
						}
						else {
							this._hero.rotation += Game.user.hitObstacle * 2;
						}
					}
					Game.user.hitObstacle--;

					this._cameraShake = Game.user.hitObstacle;
					this._shakeAnimation();
				}
				if (Game.user.mushroom > 0) {
					Game.user.mushroom -= elapsed;
				}
				if (Game.user.coffee > 0) {
					Game.user.coffee -= elapsed;
				}
				Game.user.heroSpeed -= (Game.user.heroSpeed - GameConstants.HERO_MIN_SPEED) * 0.01;

				this._foodManager.update(this._hero, elapsed);

				this._obstacleManager.update(this._hero, elapsed);
				this._bg.speed = Game.user.heroSpeed * elapsed;
				Game.user.distance += (Game.user.heroSpeed * elapsed) * 0.1;
				this._ui.update();

				break;
			}

			case GameConstants.GAME_STATE_OVER:
			{
				this._foodManager.removeAll();
				this._obstacleManager.removeAll();

				this._hero.setRotation(30);

				if (this._hero.y > -this._hero.height/2)
				{
					Game.user.heroSpeed -= Game.user.heroSpeed * elapsed;
					this._hero.y -= winSize.height * elapsed;
				}
				else
				{
					Game.user.heroSpeed = 0;

					this.unscheduleUpdate();

					this._gameOver();
				}

				this._bg.speed = Game.user.heroSpeed * elapsed;
				break;
			}
		}

		if(this._mushroomEffect) {
			this._mushroomEffect.x = this._hero.x + this._hero.width/4;
			this._mushroomEffect.y = this._hero.y;
		}
		if(this._coffeeEffect) {
			this._coffeeEffect.x = this._hero.x + this._hero.width/4;
			this._coffeeEffect.y = this._hero.y;
		}
	},

	_handleHeroPose: function () {
		var winSize = cc.winSize;
		if(Math.abs((this._hero.y - this._touchY) * 0.2) < 30) {
			this._hero.setRotation((this._hero.y - this._touchY) * 0.2);
		}

		if(this._hero.y < this._hero.height / 2) {
			this._hero.y = this._hero.height / 2;
			this._hero.setRotation(0);
		}

		if(this._hero.y > winSize.height - this._hero / 2) {
			this._hero.y = this._hero.y > winSize.height - this._hero / 2;
			this._hero.setRotation(0);
		}
	},

	_shakeAnimation:function() {
		if (this._cameraShake > 0){
			this._cameraShake -= 0.1;
			this.x = parseInt(Math.random() * this._cameraShake - this._cameraShake * 0.5);
			this.y = parseInt(Math.random() * this._cameraShake - this._cameraShake * 0.5);
		} else if (this.x != 0) {
			this.x = 0;
			this.y = 0;
		}
	},

	showWindEffect:function() {
		if(this._windEffect)
			return;
		this._windEffect = new cc.ParticleSystem("res/particles/wind.plist");
		this._windEffect.x = cc.director.getWinSize().width;
		this._windEffect.y = cc.director.getWinSize().height/2;
		this._windEffect.setScaleX(100);
		this.addChild(this._windEffect);
	},

	stopWindEffect:function() {
		if(this._windEffect){
			this._windEffect.stopSystem();
			this.removeChild(this._windEffect);
			this._windEffect = null;
		}
	},

	showCoffeeEffect:function(){
		if(this._coffeeEffect)
			return;
		this._coffeeEffect = new cc.ParticleSystem("res/particles/coffee.plist");
		this.addChild(this._coffeeEffect);
		this._coffeeEffect.x = this._hero.x + this._hero.width/4;
		this._coffeeEffect.y = this._hero.y;
	},

	stopCoffeeEffect:function(){
		if(this._coffeeEffect){
			this._coffeeEffect.stopSystem();
			this.removeChild(this._coffeeEffect);
			this._coffeeEffect = null;
		}
	},

	showMushroomEffect:function(){
		if(this._mushroomEffect)
			return;
		this._mushroomEffect = new cc.ParticleSystem("res/particles/mushroom.plist");
		this.addChild(this._mushroomEffect);
		this._mushroomEffect.x = this._hero.x + this._hero.width/4;
		this._mushroomEffect.y = this._hero.y;
	},

	stopMushroomEffect:function(){
		if(this._mushroomEffect){
			this._mushroomEffect.stopSystem();
			this.removeChild(this._mushroomEffect);
			this._mushroomEffect = null;
		}
	},

	showEatEffect:function(itemX, itemY){
		var eat = new cc.ParticleSystem("res/particles/eat.plist");
		eat.setAutoRemoveOnFinish(true);
		eat.x = itemX;
		eat.y = itemY;
		this.addChild(eat);
	},

	endGame:function(){
		this.x = 0;
		this.y = 0;
		Game.gameState = GameConstants.GAME_STATE_OVER;
	},

	_gameOver:function(){
		if(!this._gameOverUI){
			this._gameOverUI = new GameOverUI(this);
			this.addChild(this._gameOverUI, 5);
		}
		this._gameOverUI.setVisible(true);
		this._gameOverUI.init();
	}
});