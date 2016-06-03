var SoundButton = cc.MenuItemToggle.extend({
	ctor: function() {
		var soundOn = new cc.Sprite("#soundOn0000.png");
		var animation = new cc.Animation();
		animation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame("soundOn0000.png"));
		animation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame("soundOn0001.png"));
		animation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame("soundOn0002.png"));
		
		animation.setDelayPerUnit(1 / 3);
		
		var action = new cc.Animate(animation).repeatForever();
		soundOn.runAction(action);
		
		this._super(new cc.MenuItemSprite(soundOn, null, null), new cc.Sprite("#soundOff.png"));
		this.setCallback(this._soundOnOff(), this);
	},
	
	_soundOnOff: function() {
		console.log("test")
	}
});