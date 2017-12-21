# Soracom's Xmas Tree special project, Raspberry Pi Zero x NodeJS x Cellular connected WS2811 Beam MQTT based controller
  
This NodeJS App allows you to control a WS2811 LED Strip using MQTT based commands.
To install and run you will need to use the following commands in the same directory as package.json and app.js:
`npm install`
`node app.js`
  
Once the applications starts, it will give you your Soracom SIM card IMSI which lets you interact with the following MQTT endpoint: xmas/<IMSI>  
We've enabled the following modes for your WS2811 LEDs:  
```ON (default mode, brightness rotation with Soracom colours)  
SORA (Same as default mode, brightness rotation with Soracom colours)  
USINEIO (Animation and brightness rotation with UsineIO colours)  
ANIME (Animation of different coulours)  
IF (Iteration with coloured strip)  
IT (Iteration with additional LEDs off)  
BR (brightness rotation)  
OFF (Switches off the LEDs Strip, great when forgetting to switch things off before leaving)  ```
  
  
Lastly you can wire your LED strip as follow:
![Wiring](https://raw.githubusercontent.com/alexissusset/soracom-xmas-ws2811/master/RPi_Zero_W_WS2811.png)
  
Be sure to use an external power supply if you take a long LED strip as it may put too much stress on your Raspberry Pi  
  
  
# Credits
Thank you to all the following NPM libraries:  
[figlet](https://www.npmjs.com/package/figlet " figlet")    
[mqtt](https://www.npmjs.com/package/mqtt " mqtt")  
[requestretry](https://www.npmjs.com/package/requestretry " requestretry")  
[pi-pins](https://www.npmjs.com/package/pi-pins   " pi-pins")  
[os-utils](https://www.npmjs.com/package/pi-pins   " os-utils")  
[rpi-ws281x-native](https://www.npmjs.com/package/rpi-ws281x-native " rpi-ws281x-native")  
  
And our partners at [Station F](https://stationf.co " Station F"), [FOCUS Accelerator](https://usine.io/focus " FOCUS Accelerator") and [UsineIO](https://usine.io " UsineIO") for the good ideas