# tangibledata

Download Tangible Data Repo: https://github.com/mmunch103/tangibledata

1. Open the StandardFirmata.ino file in this package in Arduino.
(Download link, but not needed: https://github.com/firmata/arduino)

2. Upload to Arduino. 

3. In Arduino, write down Serial Port url from Tools -> Port --> "/??"

4. Close Arduino 

5. In a text/code editor, enter your Arduino Port into the first line: var b = p5.board('ENTER HERE', 'arduino');
   It should look something like this: var b = p5.board('/dev/cu.usbmodem1411', 'arduino'); 
   Save the file and close.

6. Open Terminal/Commandline, run line:
		npm install -g p5bots-server

7. Enter into the folder where you are storing the Tangible Data project package

7. In command line type: bots-go -d *drag folder here*, then run the command.

8. In a browser, open localhost:8000.

