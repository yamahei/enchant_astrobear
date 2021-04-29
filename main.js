enchant();

var EVENT_PLAY = "gamestart";
var EVENT_HELP = "howtoplay";
var EVENT_START = "stagestart";
var EVENT_CLEAR = "stageclear";
var EVENT_FAILED = "stagefailed";
var EVENT_NEXT = "nextstage";
var EVENT_REPLAY = "replaystage";
var EVENT_SHARE = "sharescore";

var ad = window.ad || { show: function(){}, hide: function(){} };

function start(){

    GAME_WIDTH = 352;
    GAME_HEIGHT = Math.floor((GAME_WIDTH / window.outerWidth) * window.outerHeight);
    if(GAME_WIDTH > GAME_HEIGHT){ GAME_HEIGHT = GAME_WIDTH; }
    if(GAME_WIDTH * 2 < GAME_HEIGHT){ GAME_HEIGHT = GAME_WIDTH * 2; }

    var game = new Core(GAME_WIDTH, GAME_HEIGHT);
    game.rootScene.backgroundColor = "black";
    game.fps = 24;
    game.preload([
    	 './img/title.png'
    	,'./img/titleimg.png'
    	,'./img/play.png'
    	,'./img/help.png'
    	,'./img/smaho2.png'
    	,'./img/smaho3.png'
    	,'./img/bear.png'
    	,'./img/back.png'
    	,'./img/start.png'
    	,'./img/clear.png'
    	,'./img/replay.png'
    	,'./img/share.png'
    	,'./img/space0.png'
    	,'./img/space1.png'
    	,'./img/space2.png'
    	,'./img/space3.png'
    	,'./img/bg_star.jpg'
    	,'./img/bg_sunrise.jpg'
    	,'./img/bg_earth.jpg'
    	,'./img/bg_galaxy.jpg'
    	,'./img/bg_mandara.jpg'

    	,'./img/bg_test.jpg'
    ]);
    if( typeof app != "undefined" ){
		app.preload('./se/crash24.mp3');
		app.preload('./se/fall01.mp3');
		app.preload('./se/noise09.mp3');
		app.preload('./se/power38.mp3');
    }else{
		game.preload([
			 './se/crash24.mp3'
			,'./se/fall01.mp3'
			,'./se/noise09.mp3'
			,'./se/power38.mp3'
		]);
    }

    game.onload = function startGame(){
		game.level = 1;

		game.addEventListener(EVENT_START, function(){ ad.hide(); });
		game.addEventListener(EVENT_CLEAR, function(){ ad.show(); });
		game.addEventListener(EVENT_FAILED, function(){ ad.show(); });

		game.addEventListener(EVENT_PLAY, function(){
			game.popScene();
			game.pushScene(new StageScene(game.level));
		});
		game.addEventListener(EVENT_HELP, function(){
			game.popScene();
			game.pushScene(new HelpScene());
		});
		game.addEventListener(EVENT_NEXT, function(){
			game.popScene();
			game.level += 1;
			game.pushScene(new StageScene(game.level));
		});
		game.addEventListener(EVENT_REPLAY, function(){
			game.popScene();
			game.level = 1;
			game.pushScene(new StageScene(game.level));
		});
		//game.pushScene(new StageScene(game.level));
		game.pushScene(new TitleScene());
	}

    game.start();
};

/*

*/
var TitleScene = enchant.Class.create(enchant.Scene, {
    initialize: function(){
		enchant.Scene.call(this);
		var game = enchant.Core.instance;
		var scene = this;
		var level = Math.floor(Math.random()*36);
		var bear = new Bear(level);
		bear.visible = false;
		scene.addChild(bear);
		var bg = new BG(level, bear);
		scene.addChild(bg);
		var img = new CharBase(240, 218, './img/titleimg.png');
		img.x = game.width - img.width;
		img.y = game.height - img.height;
		scene.addChild(img);
		var title = new CharBase(310, 182, './img/title.png');
		scene.addChild(title);
		var help = new CharBase(145, 63, './img/help.png');
		help.x = (game.width / 2) + 2;
		help.y = game.height / 2;
		help.addEventListener('touchend', function(){
			var e = new enchant.Event(EVENT_HELP);
			game.dispatchEvent(e);
		});
		scene.addChild(help);
		var play = new CharBase(143, 63, './img/play.png');
		play.x = (game.width / 2) - play.width;
		play.y = game.height / 2;
		play.addEventListener('touchend', function(){
			var e = new enchant.Event(EVENT_PLAY);
			game.dispatchEvent(e);
		});
		scene.addChild(play);
		if(window.ffapp && !window.ffapp.checkInstalled()){
			var install = new CharBase(226, 63, './img/install.png');
			install.x = play.x;
			install.y = play.y + play.height;
			install.addEventListener('touchend', function(){
				window.ffapp.install();
			});
			scene.addChild(install);
		}
	},
	dummy: function(){}
});
var HelpScene = enchant.Class.create(enchant.Scene, {
    initialize: function(){
		enchant.Scene.call(this);
    	var game = enchant.Core.instance;
		var scene = this;
		var messages = [
			"Tap the left half of the screen, The Astro Bear goes to the left.",
			"Tap the right half of the screen, The Astro Bear goes to the right.",
			"Bear moves faster when the initial tap point is further away from screen center.",
			"Stage cleard when bear reaches the ISS.",
			"Bear dies when collided with a huge meteor, the game is over.",
		];
		var help = new Group();
		help.x = game.width / 2;
		var baseY = 24;
		baseY = this.setImgAndLabel(help, baseY, 48, 64, './img/smaho2.png', messages.shift());
		baseY = this.setImgAndLabel(help, baseY, 48, 64, './img/smaho3.png', messages.shift());
		baseY = this.setImgAndLabel(help, baseY, 32, 32, './img/bear.png', messages.shift());
		baseY = this.setImgAndLabel(help, baseY, 32, 32, './img/space2.png', messages.shift());
		baseY = this.setImgAndLabel(help, baseY, 64, 64, './img/space1.png', messages.shift());
		var play = new CharBase(143, 63, './img/play.png');
		play.x = this.getCenterOffset(play);
		play.y = baseY;
	    play.addEventListener('touchend', function(){
			var e = new enchant.Event(EVENT_PLAY);
			game.dispatchEvent(e);
	    });
		help.addChild(play);
	    baseY += play.height;
	    help.height = baseY;
    	scene.addChild(help);

		var touch = new enchant.Sprite(game.width, game.height);
		touch.oldY = undefined;
	    touch.addEventListener('enterframe', function(e){
	    	if(touch.oldY === undefined){
	    		var minHeight = -(help.height - game.height) - 50;
	    		if(0 < help.y )
	    			help.y = Math.floor(help.y / 2);
	    		else if(help.y < minHeight) {
	    			help.y = Math.floor((minHeight + help.y) / 2);
	    		}
	    	}
	    	if(play.y + help.y < game.height){
	    		this.y = play.y + help.y - game.height;
	    	}else{
	    		this.y = 0;
	    	}
	    	console.log(this.y);
	    });
	    touch.addEventListener('touchstart', function(e){
			touch.oldY = e.y;
	    });
	    touch.addEventListener('touchend', function(e){
			touch.oldY = undefined;
	    });
	    touch.addEventListener('touchmove', function(e){
	    	var moveY = touch.oldY - e.y;
	    	help.y -= moveY;
			touch.oldY = e.y;
	    });
    	scene.addChild(touch);

	},
	setImgAndLabel: function(group, currentY, width, height, image, msg){
		var offsetY = 8;
		var image = new CharBase(width, height, image);
		image.x = this.getCenterOffset(image);
		image.y = currentY;  currentY+= image.height + offsetY;
		group.addChild(image);
		var label = this.getLabel(msg);
		label.x = this.getCenterOffset(label);
		label.y = currentY;  currentY+= label.height + offsetY;
		group.addChild(label);
		return currentY;
	},
	getCenterOffset: function(obj){
		return -(obj.width / 2);
	},
	getLabel: function(msg){
    	var game = enchant.Core.instance;
    	var size = 18;
    	var width = game.width;
    	var count = Math.floor(width / size);
    	var reg = new RegExp(".{1,"+count+"}", "g");
    	var lines = msg.match(reg);
		var text = lines.join("<br /><br />");
    	var label = new Label(text);
    	label.color = "white";
    	label.font = "24px 'Flappy Bird'";
    	label.height = lines.length * size * 1.5;
    	return label;
	},
	dummy: function(){}
});

/*
	class: StageScene(level):Scene
*/
var StageScene = enchant.Class.create(enchant.Scene, {
    initialize: function(level){
		enchant.Scene.call(this);
		this.level = level;
    	var game = enchant.Core.instance;
    	var center = (game.width - 32) / 2;
    	var middle = game.height / 2;
    	var bottom = game.height;
    	var scene = this;

    	//set Bear
    	var bear = new Bear(level);
    	bear.pointByCenter(Math.random() * (game.width - 32) + 16, bottom - 82);
		//set ISS
		var iss = new ISS(level, bear);
    	iss.pointByCenter(Math.random() * (game.width - 32) + 16, 32);
    	//set BG
    	var bg = new BG(level, bear);
    	scene.addChild(bg);
    	//set Meteorite
    	var meteos = [];
    	var count = (level < 4) ? level : 3 + Math.floor(level / 4);
    	var _meteo = (level < 4 * 3) ? Math.floor(level / 3) : 3;
    	var _level = level;
    	while(count-- > 0){
    		meteos.push(_level % 4);
    		_level = Math.floor(_level / 4);
    	}
    	//console.log("meteos.length: " + meteos.length);
    	//console.log("meteos.join(','): " + meteos.join(','));
    	var points = scene.getMeteoritePoints(meteos.length, -32, 32, 96);
    	var _type = 0;
    	for(var i=0; i<points.length; i++){
    		var meteo = new Meteorite(level, (meteos.pop() || _meteo), bear);
    		meteo.pointByCenter(points[i].x, points[i].y);
	    	scene.addChild(meteo);
    	}

    	scene.addChild(iss);
    	scene.addChild(bear);

    	//set TouchPanel
    	var panel = new TouchPanel(bear);
    	scene.addChild(panel);
    	//set StartLabel
    	var start = new StartLabel();
    	start.pointByCenter(center, middle);
    	scene.addChild(start);
    	// set label of level
    	var score = new Label("Level: " + level);
    	score.color = "white";
    	score.font = "24px 'Flappy Bird'";
    	score.x = 4;
    	score.y = 4;
    	scene.addChild(score);

    	//event listener
	    game.addEventListener(EVENT_START, function(){
	    	game.gaming = true;
	    });
	    game.addEventListener(EVENT_CLEAR, function(){
	    	game.gaming = false;
			var clear = new ClearLabel();
			clear.pointByCenter(center, middle);
			scene.addChild(clear);
	    });
	    game.addEventListener(EVENT_FAILED, function(){
	    	game.gaming = false;
			var replay = new ReplayLabel();
			replay.pointByCenter(center, middle - replay.height / 2);
			scene.addChild(replay);
			var share = new ShareLabel(level);
			share.pointByCenter(center, middle + share.height / 2);
			scene.addChild(share);
	    });


    },
    getMeteoritePoints: function(num, offsetX, offsetU, offsetB){
    	var game = enchant.Core.instance;
		var tileW = (game.width  - offsetX * 2 ) / (num + 1);
		var tileH = (game.height - offsetU - offsetB ) / (num + 1);
		var points = [];
		for(var i=1; i<=num; i++){
			points.push( {x: tileW * i + offsetX, y: tileH * i + offsetU } );
		}
		for(var i=0; i<points.length; i++){
			var index = Math.floor(Math.random() * points.length);
			var tmp = points[i].y;
			points[i].y = points[index].y;
			points[index].y = tmp;
		}
		return points;
    },
    dummy: function(){}
});

/*
	class: CharBase::Sprite
*/
var CharBase = enchant.Class.create(RootableIntersectSprite, {
    initialize: function(width, height, image){
		RootableIntersectSprite.call(this, width, height, image);
    },
    pointByCenter: function(x, y){
    	this.x = x - this.width / 2;
    	this.y = y - this.height / 2;
    },
    dummy: function(){}
});

/*
	class: Bear::CharBase
*/
var Bear = enchant.Class.create(CharBase, {
    initialize: function(level){
		CharBase.call(this, 32, 32, './img/space3.png');
    	this.offsetWidth = 8;
    	this.offsetHeight = 4;
		this.level = level;
    	var game = enchant.Core.instance;
		var bear = this;
		this.frame = 15;
		this.scaleX = (level & 1) * 2 - 1;
		this.minSpeed = game.fps / 4;
		this.maxSpeed = game.fps;
		this.wait = game.fps;
		this.counter = 0;
		this.speedX = 0;
		this.speedY = (this.height / game.fps) * 1.5;
		this.operation = false;
		this.moving = false;
		this.left = 0;
		this.right = 0;
	    game.addEventListener(EVENT_START, function(){
	    	bear.setSpeed(0);
	    	bear.operation = true;
	    	bear.moving = true;
	    });
	    game.addEventListener(EVENT_CLEAR, function(){
	    	bear.operation = false;
	    	bear.moving = false;
	    });
	    game.addEventListener(EVENT_FAILED, function(){
	    	bear.frame = 18;
	    	bear.operation = false;
	    	bear.speedX *= -(0.5 + Math.random());
			bear.left = 0;
			bear.right = 0;
	    });
	    this.addEventListener('enterframe', function(){
			if(bear.moving) {
				if(bear.speedX < -0.01) bear.rotation -= 1;
				if(0.01 < bear.speedX) bear.rotation += 1;
				bear.x += bear.speedX;
				bear.speedX *= 0.9;
				if(bear.y + bear.height < 0){
					bear.moving = false;
				    if( typeof app != "undefined" )
				    	app.play('./se/fall01.mp3');
				    else
						game.assets['./se/fall01.mp3'].play();
					var e = new enchant.Event(EVENT_FAILED);
					game.dispatchEvent(e);
				}else{
					bear.y -= bear.speedY;
				}
				if(game.gaming){
					bear.wait = bear.wait - Math.abs(bear.speedX);
					if(bear.wait <= 0){
						bear.wait = game.fps;
						this.counter = (this.counter + 1) % 3;
					}
					this.frame = 15 + this.counter;
				}

				if(4 < bear.left) bear.left = 4;
				if(4 < bear.right) bear.right = 4;
				bear.x += bear.right - bear.left;
				bear.left = 0;
				bear.right = 0;
			}
	    });
    },
    setSpeed: function(speed){
    	if(this.operation){
	    	this.speedX = speed;
    	}
    },
    pushToLeft: function(){
		this.left += 1;
    },
    pushToRight: function(){
		this.right += 1;
    },
    dummy: function(){}
});


/*
	class: ISS::CharBase
*/
var ISS = enchant.Class.create(CharBase, {
    initialize: function(level, bear){
		CharBase.call(this, 32, 32, './img/space2.png');
    	this.offsetWidth = 8;
    	this.offsetHeight = 8;
    	var game = enchant.Core.instance;
		this.level = level;
		this.bear = bear;
		this.toX = undefined;
        this.frame = this.fatten([0, 1, 2, 3], 6);
		this.moving = true;
		this.collision = false;
		var iss = this;
	    game.addEventListener(EVENT_START, function(){
			iss.collision = true;
	    });
	    game.addEventListener(EVENT_CLEAR, function(){
			iss.collision = false;
			iss.moving = false;
	    });
	    game.addEventListener(EVENT_FAILED, function(){
	    });
	    this.addEventListener('enterframe', function(){
			var game = enchant.Core.instance;
			if(iss.moving){
				if(this.toX == undefined){
					if(Math.floor(Math.random() * 100) <= Math.floor(level / 2) ){
						this.toX = 16 + Math.random() * (game.width  - 32);
					}
				}else{
					if(this.x < this.toX) this.x += 1;
					if(this.toX < this.x) this.x -= 1;
				}
			}
			if(iss.collision){
				if(iss.intersectR(iss.bear)){
				    if( typeof app != "undefined" )
						app.play('./se/power38.mp3');
				    	//app.play('./se/noise09.mp3');
				    else
						game.assets['./se/power38.mp3'].play();
						//game.assets['./se/noise09.mp3'].play();
					var e = new enchant.Event(EVENT_CLEAR);
					game.dispatchEvent(e);
				}
			}
	    });
    },
	fatten: function(array, times){
		var a=[];
		for (var i=array.length; i--;){
			for (var j=times; j--;){ a.unshift(array[i]); }
		}
		return a;
	},
    dummy: function(){}
});

/*
	class: Meteorite::CharBase
		rotate:
		directionX, directionY:
*/
var Meteorite = enchant.Class.create(CharBase, {
    initialize: function(level, type, bear){
		CharBase.call(this, 64, 64, './img/space1.png');
    	this.offsetWidth = 4;
    	this.offsetHeight = 18;
		this.bear = bear;
		this.moving = true;
		this.collision = false;
		this.rotation = Math.random() * 360;
		var step = ( ((level > 12) ? 12 : level) / 12 ) + 1;
		var _rotate = (type & 1) ? true : false;
		var _moveX = (type & 2) ? true : false;
		var _moveY = (type & 2) ? true : false;
		this.rotateSpeed = _rotate ? (Math.random() * step - step / 2) * 2 : 0;
		var rad = Math.random() * 360 * (Math.PI / 180);
		this.moveSpeedX = _moveX ? Math.sin(rad) * step / 8 : 0;
		this.moveSpeedY = _moveY ? Math.cos(rad) * step / 8 : 0;
    	var game = enchant.Core.instance;
		var meteo = this;
	    game.addEventListener(EVENT_START, function(){
			meteo.collision = true;
	    });
	    game.addEventListener(EVENT_CLEAR, function(){
			meteo.collision = false;
	    });
	    game.addEventListener(EVENT_FAILED, function(){
	    });
	    this.addEventListener('enterframe', function(){
	    	var game = enchant.Core.instance;
			if(meteo.moving){
				meteo.rotation += meteo.rotateSpeed;
				meteo.x += meteo.moveSpeedX;
				meteo.y += meteo.moveSpeedY;
				if(meteo.x < -meteo.width){
					meteo.x = -meteo.width;
					meteo.moveSpeedX *= -1;
				}else if(game.width < meteo.x ){
					meteo.x = game.width;
					meteo.moveSpeedX *= -1;
				}
				if(meteo.y < 48){
					meteo.y = 48;
					meteo.moveSpeedY *= -1;
				}else if(game.height - 172 < meteo.y ){
					meteo.y = game.height - 172;
					meteo.moveSpeedY *= -1;
				}
			}
			if(meteo.collision){
				if(meteo.bear.y > 0){
					if(meteo.intersectR(meteo.bear)){
						if(game.gaming){
							if( typeof app != "undefined" )
								app.play('./se/crash24.mp3');
							else
								game.assets['./se/crash24.mp3'].play();
							var e = new enchant.Event(EVENT_FAILED);
							game.dispatchEvent(e);
						}else{
							var f = (meteo.x + meteo.width * 0.5) - (meteo.bear.x + meteo.bear.width * 0.5);
							if(f < 0) meteo.bear.pushToRight();
							if(0 < f) meteo.bear.pushToLeft();
						}
					}
				}
			}
	    });
    },
    enterFrame: function(e){
    },
    dummy: function(){}
});





/*
	class: TouchPanel::Sprite
*/
var TouchPanel = enchant.Class.create(enchant.Sprite, {
    initialize: function(bear){
		var game = enchant.Core.instance;
		enchant.Sprite.call(this, game.width, game.height);
		this.speedX = 0;
		this.touch = false;
		var center = game.width / 2;
		var speedRange = (bear.maxSpeed - bear.minSpeed);
		var panel = this;
		var getSpeedX = function(x){
			var speed = (speedRange * (x - center) / center);
			if(speed != 0) speed += bear.minSpeed * (speed / Math.abs(speed));
			return speed;
		};
	    this.addEventListener('touchstart', function(e){
			panel.touch = true;
	    	panel.speedX = getSpeedX(e.x);
	    });
	    this.addEventListener('touchmove', function(e){
			panel.touch = true;
	    	panel.speedX = getSpeedX(e.x);
	    });
	    this.addEventListener('touchend', function(e){
			panel.touch = false;
			panel.speedX = 0;
	    });
	    this.addEventListener('enterframe', function(){
			if(panel.touch)
				bear.setSpeed(panel.speedX);
	    });
    },
    dummy: function(){}
});


/*
	class: ImageLabel::CharBase
		Event: xxx
*/
var ImageLabel = enchant.Class.create(CharBase, {
    initialize: function(width, height, image, event){
		CharBase.call(this, width, height, image);
		var game = enchant.Core.instance;
		var label = this;
	    this.addEventListener('touchend', function(){
    		if(event){
				var e = new enchant.Event(event);
				game.dispatchEvent(e);
				label.selfEvent();
    		}
	    });
    },
    selfEvent: function(e){},
    dummy: function(){}
});


/*
	class: StartLabel::CharBase
		Event: stagestart
*/
var StartLabel = enchant.Class.create(ImageLabel, {
    initialize: function(){
		ImageLabel.call(this, 187, 63, './img/start.png', EVENT_START);
    },
    selfEvent: function(e){
		var game = enchant.Core.instance;
		if( typeof app != "undefined" )
	    	app.play('./se/noise09.mp3');
			//app.play('./se/power38.mp3');
		else
		    game.assets['./se/noise09.mp3'].play();
		    //game.assets['./se/power38.mp3'].play();
		this.parentNode.removeChild(this);
    },
    dummy: function(){}
});

/*
	class: ClearLabel::CharBase
		Event: nextstage
*/
var ClearLabel = enchant.Class.create(ImageLabel, {
    initialize: function(){
		ImageLabel.call(this, 180, 63, './img/clear.png', EVENT_NEXT);
    },
    selfEvent: function(e){},
    dummy: function(){}
});

/*
	class: ReplayLabel::CharBase
		Event: replaystage
*/
var ReplayLabel = enchant.Class.create(ImageLabel, {
    initialize: function(){
		ImageLabel.call(this, 213, 63, './img/replay.png', EVENT_REPLAY);
		var game = enchant.Core.instance;
		var label = this;
	    game.addEventListener(EVENT_CLEAR, function(){
			label.visible = false;
	    });
    },
    selfEvent: function(e){},
    dummy: function(){}
});

/*
	class: ShareLabel::CharBase
		Event: sharescore
*/
var ShareLabel = enchant.Class.create(ImageLabel, {
    initialize: function(level){
		ImageLabel.call(this, 195, 63, './img/share.png', EVENT_SHARE);
		this.level = level;
		var game = enchant.Core.instance;
		var label = this;
	    game.addEventListener(EVENT_CLEAR, function(){
			label.visible = false;
	    });
    },
    enterFrame: function(e){},
    selfEvent: function(e){
		this.visible = false;
		var api = "https://twitter.com/share";
		var param = {
			//"url": "http%3A%2F%2Fgoo.gl%2F4Ms2Hc",
			//"url": "http%3A%2F%2Fastrobear.herokuapp.com",
			"url": location.href,
			"text": "I scored " + this.level + " on free 'Astro Bear'"
		};
		var parameter = [];
		for(var p in param){
			parameter.push(p + "=" + param[p]);
		}
		var url = api + "?" + parameter.join("&");

		if( typeof app != "undefined" )
			app.openUri(url);
		else
	    	window.open(url);

    },
    dummy: function(){}
});





/*
	class: BG::Sprite
*/
var BG = enchant.Class.create(enchant.Sprite, {
    initialize: function(level, bear){
    	var game = enchant.Core.instance;
    	var images=[
    		{ no: 36, img: './img/bg_mandara.jpg' },
    		{ no: 9, img: './img/bg_galaxy.jpg' },
    		{ no: 5, img: './img/bg_earth.jpg' },
    		{ no: 3, img: './img/bg_sunrise.jpg' }
    	];
    	var img = game.assets['./img/bg_star.jpg'];
    	var w, h, width, height, scale;
    	for(var i=0; i<images.length; i++){
    		image=images[i];
    		if(level % image.no == 0){
    			img = game.assets[image.img];
    			break;
    		}
    	}
    	//img = game.assets['./img/bg_test.jpg'];
    	w = img.width;
    	h = img.height;
		enchant.Sprite.call(this, w, h);
		scale = (game.height + 1) / h;
		width = w * scale;
		height = h * scale;
		this.image = img;
		this.scaleX = scale;
		this.scaleY = scale;
		this.y = (height - h) / 2;

		var bg = this;
		var offsetX = (width - w) / 2;
		var scrollableWidth = game.width - width;
		var maxBearWidth = game.width - bear.width - 1;
		var setX = function(){
			if(bear.x <=0) bg.x = offsetX;
			else if(maxBearWidth <= bear.x) bg.x = offsetX + scrollableWidth;
			else bg.x = offsetX + scrollableWidth * (bear.x / maxBearWidth);
		};
	    this.addEventListener('enterframe', setX);
	    setX();
    },
    dummy: function(){}
});

