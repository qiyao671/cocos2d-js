var AboutScene  = cc.Scene.extend({
	ctor: function() {
		this._super();
		
		var layer = new cc.Layer();
		this.addChild(layer, 1);
		
		var bg = new cc.Sprite(res.BgWelcome_jpg);
		layer.addChild(bg, 1);
		var size = cc.winSize;
		bg.x = size.width / 2;
		bg.y = size.height / 2;
		
		var helloLabel = new  cc.LabelTTF("This is about Scene", "Arial", 18);
		helloLabel.x = size.width / 2;
		helloLabel.y = size.height / 2 + 80;
		helloLabel.setColor(cc.color(255,0,0));
		layer.addChild(helloLabel, 2);

		var backBtn = new cc.MenuItemImage("#about_backButton.png", "#about_backButton.png", this._back, this);
		var menu = new cc.Menu(backBtn);

		layer.addChild(menu, 1);
	},
	
	_back: function() {
		cc.director.runScene(new MenuScene());
	}
});