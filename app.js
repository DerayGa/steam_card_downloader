var express = require('express');
var bodyParser = require('body-parser');
var htmlparser = require('htmlparser2');
var http = require('http');
var fs = require('fs');
var wget = require('wget');
var mkdirp = require('mkdirp');

var app = express();
app.use( bodyParser.json({limit:'50mb'}) );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true, limit:'50mb'
}));

app.get('/', function (req, res) {
	res.sendfile('index.html');
});

app.post('/card', function (req, res) {
	if(req.body.cardUrl){
		//res.send('Cards Download Completed!');
		download(req.body.cardUrl, cardDownloader);
	}

	if(req.body.cardHTML){
		//res.send('Cards Download Completed!');
		cardDownloader(req.body.cardHTML);
	}

	res.redirect('/?progress');
});

function download(url, callback) {
	http.get(url, function(res) {
		var data = '';
		res.on('data', function (chunk) {
			data += chunk;
		});
		res.on('end', function() {
			callback(data);
		});
	}).on('error', function() {
		callback(null);
	});
}

function cardDownloader(htmlData){
	//console.log(htmlData);
	var getCardStep = 0;
	var getTitle = false;
	var index = 1;
	var folderName;
	var cardNames = [];
	var cardSRCs = [];
	var cardFullSRCs = [];
	var gameTitle;

	var parser = new htmlparser.Parser({
		onopentag: function(name, attribs){	
		
			if(name == 'title'){
				getTitle = true;
				return;
			}

			if(!attribs.class) return;

			if(name == 'div' && attribs.class.trim() == 'game_card_ctn with_zoom'){
				if(attribs.onclick.length){
					var src = attribs.onclick;
					src = src.substring(0, src.lastIndexOf('"'));
					src = src.substr(src.lastIndexOf('"')+1);

					cardFullSRCs.push(src.replace(/\\/g, ''));
				}
			}

			if(name == 'div' && attribs.class.trim() == 'badge_card_set_text_qty'){
				getCardStep = 1;
				return;
			}
			if(name == 'img' && attribs.class.trim() == 'gamecard'){
				//console.log(attribs.src);
				cardSRCs.push(attribs.src);
			}
		},

		ontext: function(text){
			if(getCardStep == 2){
				cardNames.push(text.trim().replace(/[^a-z A-Z0-9\-]/gi, ''));
				getCardStep = 0;
			}

			if(getTitle){
				var tmp = text.split('::');
				gameTitle = (tmp[tmp.length - 1]).trim().replace(/[^a-z A-Z0-9\-]/gi, '');

				getTitle = false;
			}
		},

		onclosetag: function(tagname){
			if(getCardStep == 1 && tagname == 'div'){
				getCardStep = 2;
			}
		},

	    onend: function(){
	    	var path = __dirname + '/' + gameTitle;
			
			while(cardNames.length < cardSRCs.length)
				cardNames.push('(' + (cardNames.length+1) + ')');

			while(cardNames.length < cardFullSRCs.length)
				cardNames.push('(' + (cardNames.length+1) + ')');

			mkdirp(path, function(err) { 
				if(err)
					return;
			   
				for(var index in cardNames){
					var smallExt = '';

					if(cardSRCs[index]){
						if(cardFullSRCs[index])
							smallExt = ' (s)';
						wget.download(cardSRCs[index], path + '/' + cardNames[index] + smallExt + '.jpg'); 
					}

					if(cardFullSRCs[index]) {
						console.log('path', cardFullSRCs[index]);
						wget.download(cardFullSRCs[index], path + '/' + cardNames[index] + '.jpg'); 
					}
				}
			});
	    }
	}, {decodeEntities: true});

	parser.write(htmlData);
	parser.end();
}

var server = app.listen(3000, function () {
	console.log('open  http://127.0.0.1:3000');
});