/*jshint esversion: 6 */

/*
 * Soracom Xmas WS2811 LEDs controller 
 *  Uses MQTT to take LED patterns
 *
 */

var ws281x = require('rpi-ws281x-native'),
	figlet = require('figlet'),
	request = require('requestretry'),
	os = require('os-utils');

var leds,
	ics,
	ic = 1,
	offset,
	NUM_LEDS = 32,
    pixelData = new Uint32Array(NUM_LEDS);

// Setup base variables
var beam_endpoint = 'mqtt://beam.soracom.io:1883', // Beam endpoint for MQTT messages
	beam_receive_topic,
	iot_mqtt,
	beam_mqtt;


// Initialise LEDs
ws281x.init(NUM_LEDS);

process.on('SIGINT', function () {
  ws281x.reset();
  process.nextTick(function () { process.exit(0); });
});


// Get device's IMSI 
request({
	url: 'http://metadata.soracom.io/v1/subscriber.imsi',
	method: 'GET',
}, function(error, response){
	if(error) {
	    console.log('[DEV] couldnt make IMSI Metadata request with error: '+ error);
	} else if(response.hasOwnProperty('statusCode') && response.statusCode !== 200){
	    console.log('[DEV] couldnt make IMSI Metadata request with error: '+ error +' and status code: '+ response.statusCode);
	} else {
	    console.log('[DEV] Device IMSI is: '+ response.body);
	    console.log('[DEV] Please post to: xmas/'+ response.body);
	    // Set Beam MQTT topic to receive messages
	    beam_receive_topic = 'xmas/'+response.body.replace(/\n$/, '');
	}
});

// Setup MQTT
console.log('[DEV] Loading MQTT client');
var iot_mqtt = require('mqtt');
// Adding in MQTT Options in case needed
//var mqtt_options = {
//	username: 'beamuser',
//	password: 'passwd'
//};
beam_mqtt = iot_mqtt.connect(beam_endpoint); //, mqtt_options);
beam_mqtt.on('connect', function() {
	console.log('[DEV] Connected to Beam MQTT');
	if(beam_receive_topic){
		console.log('[DEV] Subscribed to MQTT topic: '+beam_receive_topic);
		beam_mqtt.subscribe(beam_receive_topic);
		beam_mqtt.on('message', (topic, message) => {  
			console.log('[DEV] Received MQTT message on topic: '+topic+' with message '+message);
			if(message == 'ON' || message == 'SORA'){
				if(leds) clearInterval(leds);
				if(ics) clearInterval(ics);
				sora();
			}else if(message == 'ANIME'){
				if(leds) clearInterval(leds);
				if(ics) clearInterval(ics);
				animation();
			}else if(message == 'IF'){
				if(leds) clearInterval(leds);
				if(ics) clearInterval(ics);
				iterate_full();
			}else if(message == 'IT'){
				if(leds) clearInterval(leds);
				if(ics) clearInterval(ics);
				iterate();
			}else if(message == 'BR'){
				if(leds) clearInterval(leds);
				if(ics) clearInterval(ics);
				bright();
			}else if(message == 'USINEIO'){
				if(leds) clearInterval(leds);
				if(ics) clearInterval(ics);
				usine();
			}else if(message == 'OFF'){
				if(leds) clearInterval(leds);
				if(ics) clearInterval(ics);
				off();
			}else{
				console.log("Invalid setting, please use 'ON', 'SORA, 'USINEIO', 'ANIME', ''IF', 'IT', 'BR' or 'OFF'");
			}				
		});
	}
});


// Everything is ok, display startup message
console.log();
console.log('              ..;;ttLLCCCCCCLLtt;;..              ');
console.log('          ..11CCCCCCCCCCCCCCCCCCCCCC11..          ');
console.log('        ::LLCCCCCCttii::,,::iittCCCCCCLL::        ');
console.log('      ::CCCCCC11..              ..11CCCCCC::      ');
console.log('    ::CCCCCCCCttii::..              ::LLCCCC::    ');
console.log('  ..LLCCCCCCCCCCCCCCCCffii::..        ,,LLCCLL..  ');
console.log('  11CCCC::,,;;ttLLCCCCCCCCCCCCff11::..  ::CCCC11  ');
console.log('..CCCC11          ,,;;11LLCCCCCCCCCCCC..  11CCCC..');
console.log('iiCCCC,,                  ..::11LLCCCC..  ,,CCCCii');
console.log('ttCCff                          ;;CCCC..    ffCCff');
console.log('LLCCii                          ;;CCCC..    iiCCLL');
console.log('CCCC;;                        ,,11CCCC..    ;;CCCC');
console.log('CCCC::                ,,iittLLCCCCCCCC..    ::CCCC');
console.log('CCCC;;      ..::iittCCCCCCCCCCCCCCffii      ;;CCCC');
console.log('LLCCii    ;;CCCCCCCCCCCCLLttii,,            iiCCLL');
console.log('ttCCff    ..LLCCCCtt;;,,          ::        ffCCff');
console.log('iiCCCC,,    iiCCCC,,          ,,::tt,,..  ,,CCCCii');
console.log('..CCCC11    ..LLCCtt          ;;LLCCtt..  11CCCC..');
console.log('  11CCCC::    iiCCCC,,          LLff;;  ::CCCC11  ');
console.log('  ..LLCCLL,,  ..LLCCtt  ..tt11..,,  ::,,LLCCLL..  ');
console.log('    ::CCCCLL::  iiCCCC::ffCCCC;;    ::LLCCCC::    ');
console.log('      ::CCCCCC11,,LLCCCCCCCC11  ..11CCCCCC::      ');
console.log('        ,,LLCCCCCCLLCCCCCCffiittCCCCCCLL::        ');
console.log('          ..11LLCCCCCCCCCCCCCCCCCCLL11..          ');
console.log('              ..;;ttLLCCCCCCLLtt;;..              ');
console.log(figlet.textSync('SORACOM XMAS', {
	horizontalLayout: 'default',
	verticalLayout: 'default'
}));


// LEDs Animation Style
function animation() {
	console.log("Switching Xmas LEDs ON with anime mode");
	offset = 0;
	leds = setInterval(function () {
		for (var i = 0; i < NUM_LEDS; i++) {
			pixelData[i] = colorwheel((offset + i) % 256);
		}

		offset = (offset + 1) % 256;
		ws281x.render(pixelData);
	}, 1000 / 30);
}

// LEDs Iterate Style
function iterate() {
	console.log("Switching Xmas LEDs ON with iterative mode");
	offset = 0;
	leds = setInterval(function () {
		var i=NUM_LEDS;
		while(i--) {
			pixelData[i] = 0;
		}
		pixelData[offset] = colorwheel(ic % 256);
	
		offset = (offset + 1) % NUM_LEDS;
		ws281x.render(pixelData);
	}, 100);
	ics = setInterval(function(){ ic++; }, 10*NUM_LEDS);
}

// LEDs Iterate full lights Style
function iterate_full() {
	console.log("Switching Xmas LEDs ON with iterative with colours mode");
	offset = 0;
	leds = setInterval(function () {
		var i=NUM_LEDS;
		while(i--) {
			pixelData[i] = colorwheel((offset + i) % 256);
		}
		pixelData[offset] = colorwheel(ic % 256);

		offset = (offset + 1) % NUM_LEDS;
		ws281x.render(pixelData);
		ic++;
	}, 100);
	ics = setInterval(function(){ ic++; }, 10*NUM_LEDS);
}

// LEDs Brightness Style
function bright() {
	console.log("Switching Xmas LEDs ON with bright mode");
	for(var i = 0; i < NUM_LEDS; i++) {
	    pixelData[i] = rgb2Int(10, 122, 60);
	}
	ws281x.render(pixelData);
	
	// ---- animation-loop
	var t0 = Date.now();
	leds = setInterval(function () {
	    var dt = Date.now() - t0;
	
	    ws281x.setBrightness(
	        Math.floor(Math.sin(dt/1000) * 128 + 128));
	}, 1000 / 30);
}

// LEDs Soracom Style
function sora() {
	console.log("Switching Xmas LEDs ON with Soracom mode");
	for(var i = 0; i < NUM_LEDS; i++) {
	    pixelData[i] = rgb2Int(52, 205, 215);
	}
	ws281x.render(pixelData);
	
	// ---- animation-loop
	var t0 = Date.now();
	leds = setInterval(function () {
	    var dt = Date.now() - t0;
	
	    ws281x.setBrightness(
	        Math.floor(Math.sin(dt/1000) * 128 + 128));
	}, 1000 / 30);
}

// LEDs UsineIO Style
function usine() {
	console.log("Switching Xmas LEDs ON with UsineIO mode");
	// ---- animation-loop
	var t0 = Date.now(),
		usinei=1;
	leds = setInterval(function () {
	    var dt = Date.now() - t0;
	
	    ws281x.setBrightness(
	        Math.floor(Math.sin(dt/1000) * 128 + 128));
	}, 1000 / 30);
	ics = setInterval(function(){
		var usinergb;
		console.log('usinei: '+ usinei);

		if(usinei > 4){
			usinei=0;
			usinergb = rgb2Int(254, 69, 0);
		}else if(usinei == 4){
			usinergb = rgb2Int(0, 220, 0);
		}else if(usinei == 3){
			usinergb = rgb2Int(0, 220, 220);
		}else if(usinei == 2){
			usinergb = rgb2Int(255, 200, 0);
		}else{
			usinergb = rgb2Int(115, 90, 255);
		}
		usinei++;

		for(var i = 0; i < NUM_LEDS; i++) {
			pixelData[i] = usinergb;
		}
		ws281x.render(pixelData);
	}, 10000 / 30);
}


function off(){
	console.log("Switching Xmas LEDs OFF");
	ws281x.setBrightness(0);
}

console.log("Running in default mode: Soracom (SORA)");
sora();

// rainbow-colors, taken from http://goo.gl/Cs3H0v
function colorwheel(pos) {
  pos = 255 - pos;
  if (pos < 85) { return rgb2Int(255 - pos * 3, 0, pos * 3); }
  else if (pos < 170) { pos -= 85; return rgb2Int(0, pos * 3, 255 - pos * 3); }
  else { pos -= 170; return rgb2Int(pos * 3, 255 - pos * 3, 0); }
}

function rgb2Int(r, g, b) {
  return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}
