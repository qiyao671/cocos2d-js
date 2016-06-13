var res = {
    HelloWorld_png : "res/HelloWorld.png",
    CloseNormal_png : "res/CloseNormal.png",
    CloseSelected_png : "res/CloseSelected.png",
    BgWelcome_jpg: "res/pics/bgWelcome.jpg",
    texture_png: "res/pics/texture.png",
    texture_plist: "res/pics/texture.plist",
    bgLayer_jpg: "res/pics/bgLayer.jpg",
    fnt: "res/fonts/font.fnt",
    bgGame_mp3: "res/sounds/bgGame.mp3",
    bgWelcome_mp3: "res/sounds/bgWelcome.mp3",
    coffee_mp3: "res/sounds/coffee.mp3",
    eat_mp3: "res/sounds/eat.mp3",
    hit_mp3: "res/sounds/hit.mp3",
    hurt_mp3: "res/sounds/hurt.mp3",
    lose_mp3: "res/sounds/lose.mp3",
    mushroom_mp3: "res/sounds/mushroom.mp3"

};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}