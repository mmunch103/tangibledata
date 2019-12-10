var b = p5.board('/dev/cu.usbmodem1411', 'arduino');
let rects = []; // array of Rectangle objects]]
let positionSliderMin, positionSliderMax,speedSliderMin, speedSliderMax;
let buttonPos;
let pRadio, sRadio;
let delayInput, cycleInput;
let sel, selSpeed; //variable dropdown
let resetCheckbox;

var imgBack, imgGear, imgPin, imgTop;

let table;
var servo;
var servoAngle = 0;

var tableHolder;

var tr;
var th;
var td_1;
var td_2;

var counter = 0;
var counterSpeed = 0;
var interval;
var intervalSpeed;
var speed = 2000;
//toggle for pseed up&down, up, or down
var speedToggle;
var resetToggle = 0;
var posSpeedToggle = 0;
var speedIndex = 0;
var speedAngle = 0;
var rVar = 0;

//var line;

//array of names
var wholeTable = new Array();
var headerArray = new Array();
var headerDict;
var rowNum;
var columnNum;
var varIndex = 1;
var currMin;
var currMax;
var angleMin = 0;
var angleMax = 180;
var speedMin = 200;
var speedMax = 5000;
//array of numbers 
var servVals = new Array(); 
var servValsReset = new Array(); 
var speedValArray = new Array();

//animation values
var ry = 75;
var y1 = 200;
var y2 = 350;

var dropzone;

function preload() {
    table = loadTable('assets/mammals.csv', 'csv', 'header');
}

function setup() {
    var c = createCanvas(400, 500);
    c.position(600, 100);
    imgBack = loadImage('assets/back.png');
    imgGear = loadImage('assets/gear.png');
    imgPin = loadImage('assets/stick.png');
    imgTop = loadImage('assets/top.png');

    dropzone = select('#dropzone');
    dropzone.dragOver(highlight);
    dropzone.dragLeave(unhighlight);
    dropzone.drop(gotFile, unhighlight);

    servo = b.pin(9, 'SERVO');
    servo.range([0, 180]);

    //GO THROUGH FIRST TABLE, CREATE RECTANGLE OBJECTS
    wholeTable = table.getArray();
    headerArray = table.columns;
    rowNum = wholeTable.length;
    columnNum = wholeTable[0].length;
    console.log(wholeTable);
    currMin = wholeTable[0][varIndex];
    currMax = wholeTable[0][varIndex];
    for (let i = 0; i < rowNum; i++) {//find min and max
      var valNum = wholeTable[i][varIndex];
      currMin = min(currMin,valNum);
      currMax = max(currMax,valNum);
    }
    for (let i = 0; i < rowNum; i++) {
      var valNum = wholeTable[i][varIndex];
      var sVal = map(valNum, currMin, currMax, angleMin, angleMax);
      var speedValNum = map(valNum, currMin, currMax, speedMin, speedMax);
      servVals[i] = sVal;
      speedValArray[i] = speedValNum;
      var xStart = i * 40 + 80;
      var yStart = 400 - valNum;
      let newB = new Rectangle(xStart, yStart, valNum, sVal);
      //newB.createRow(valNum);
      rects.push(newB);
    }
    //HTML TABLE
     for (var i = 0; i < wholeTable.length; i++) {
         tr = createElement("tr");
             tr.id("user_table");
         th = createElement("th")
             th.parent("user_table");
             if (headerArray[i] != null) {
               th.html(headerArray[i]);
             }
         td_1 = createElement("td");
             td_1.html(wholeTable[i][0]);
         td_2 = createElement("td");
             td_2.html(wholeTable[i][1]);
             //td_2.class('myclass-td');
     }

    // var innerStr = '<table style="font-family:Arial;font-size:12px"> <tr>'
    // for (let h = 0; h < headerArray.length; h++) {
    //   innerStr += ''
    // }
    // innerStr += '</tr>'
    // for (let y =0; y < wholeTable[0].length; y++) {
    //   for (let x = 0; x < wholeTable.length; x++) {
    //     innerStr += ('<th>'+ );

    //   }
    // }
    // innerStr += '</tr><table>'
    // tableHolder = createDiv(innerStr);


    //variable dropdown
    sel = createSelect();
    sel.position(200, 10);
    for (let i = 1; i < headerArray.length; i++) {
      sel.option(headerArray[i]);
    }
    sel.changed(mySelectEvent);

    selSpeed = createSelect();
    selSpeed.position(450, 330);
    selSpeed.option("up & down");
    selSpeed.option("up");
    selSpeed.option("down");
    selSpeed.changed(selectSpeedType);

    resetCheckbox = createCheckbox('Reset to 0 degrees', false);
    resetCheckbox.position(300, 300);
    resetCheckbox.changed(checkReset);


    //LABELS FOR SLIDERS
    var p3 = createP("Data min = "+ currMin);
    p3.position(250, 240);
    var p4 = createP("Data max = " + currMax);
    p4.position(400, 240);
    var p5 = createP("0&#176");
    p5.position(310, 215);
    var p6 = createP("180&#176");
    p6.position(300, 60);
    var p51 = createP("0&#176");
    p51.position(420, 215);
    var p61 = createP("180&#176");
    p61.position(410, 60);
    var p7 = createP("Data min = " + currMin);
    p7.position(250, 540);
    var p8 = createP("Data max = " + currMax);
    p8.position(380, 540);
    var p9 = createP("0.2s");
    p9.position(310, 510);
    var p0 = createP("5s");
    p0.position(310, 350);
    var p91 = createP("0.2s");
    p91.position(410, 510);
    var p01 = createP("5s");
    p01.position(410, 350);

    buttonPos = createButton('Start Mapping');
    buttonPos.position(600, 20);
    buttonPos.mousePressed(startPos);

    pRadio = createRadio();
    pRadio.option('POSITION', 1);
    pRadio.option('SPEED', 2);
    pRadio.position(200, 50);
    // sRadio = createRadio();
    // sRadio.option('SPEED', 2);
    // sRadio.position(200, 340);

    //sliders

    positionSliderMin = createSlider(0, 180, 0);
    positionSliderMin.style('transform: rotate(' + -90 + 'deg);');
    positionSliderMin.position(250, 150);
    positionSliderMin.input(updateSlider);
    positionSliderMax = createSlider(0, 180, 180);
    positionSliderMax.style('transform: rotate(' + -90 + 'deg);');
    positionSliderMax.position(360, 150);
    positionSliderMax.input(updateSlider);
    
    speedSliderMin = createSlider(0, 300, 0);
    speedSliderMin.style('transform: rotate(' + -90 + 'deg);');
    speedSliderMin.position(250, 450);
    speedSliderMin.input(updateSlider);
    speedSliderMax = createSlider(0, 300, 300);
    speedSliderMax.style('transform: rotate(' + -90 + 'deg);');
    speedSliderMax.position(360, 450);
    speedSliderMax.input(updateSlider);

    delayInput = createSelect();
    delayInput.position(510, 15);
    delayInput.option("0.5s", 500);
    delayInput.option("1.0s", 1000);
    delayInput.option("2.0s", 2000);
    delayInput.option("3.0s", 3000);
    delayInput.changed(changeDelay);
    var delayTitle = createP("Delay Each by:");
    delayTitle.position(400, 0);


    cycleInput = createCheckbox();
    cycleInput.position(490, 45);
    var cycleTitle = createP("Continuous:");
    cycleTitle.position(400, 30);
}

function draw(){
    background(180, 180, 200);
    image(imgBack, 100, 75,);
      // Create objects
    angleMode(DEGREES);
    push();
    translate(147, 170);
    imageMode(CENTER);
    rotate(rVar);
    image(imgGear, 0,0);
    pop();

    // for (let i = 0; i < rects.length; i++) {
    //   rects[i].display();
    // }
    //rotate(rotateX);
    //imageMode(CENTER);
    //rotate(servoAngle);
    image(imgPin, 185, ry);
    posSpeedToggleUpdate();
    angleMin = positionSliderMin.value();
    angleMax = positionSliderMax.value();
    speedMin = speedSliderMin.value();
    speedMax = speedSliderMax.value();


    image(imgTop,180,115);


}

function updateSlider() {
  angleMin = positionSliderMin.value();
  angleMax = positionSliderMax.value();
  speedMin = speedSliderMin.value();
  speedMax = speedSliderMax.value();
  var refresh = new Array();
  rects = refresh;
 for (let i = 0; i < rowNum; i++) {
      var valNum = wholeTable[i][varIndex];
      var sVal = map(valNum, currMin, currMax, angleMin, angleMax);
      var speedValNum = map(valNum, currMin, currMax, speedMin, speedMax);
      servVals[i] = sVal;
      speedValArray[i] = speedValNum;
      var xStart = i * 40 + 80;
      var yStart = 400 - valNum;
      let newB = new Rectangle(xStart, yStart, valNum, sVal);
      //newB.createRow(valNum);
      rects.push(newB);
    } 
}



function posSpeedToggleUpdate() {
  if (pRadio.value() == 1) {
    posSpeedToggle = 1;
  } else if (pRadio.value() == 2) {
    posSpeedToggle = 2;
  }
}

//delay each function
function changeDelay() {
  speed = delayInput.value(); 
}

function highlight() {
  dropzone.style('background-color', '#ccc')
}

function unhighlight() {
  dropzone.style('background-color', '#fff')
}

//triggered when new file is uploaded
function gotFile(file) {
  createP(file.name);
  //loadTable(file, 'csv', 'header');
  table = loadTable('assets/' + file.name, 'csv', 'header', changeTable);
}

//resets array when new csv file is uploaded
function changeTable(table) {
    wholeTable = table.getArray();
    headerArray = table.columns;
    updateVariableDropdown();
    rowNum = wholeTable.length;
    columnNum = wholeTable[0].length;
    console.log(wholeTable);
    currMin = wholeTable[0][varIndex];
    currMax = wholeTable[0][varIndex];
    for (let i = 0; i < rowNum; i++) {
      var valNum = wholeTable[i][varIndex];
      currMin = min(currMin,valNum);
      currMax = max(currMax,valNum);
    }
    for (let i = 0; i < wholeTable.length; i++) {
      var valNum = wholeTable[i][varIndex];
      console.log(valNum);
      var sVal = map(valNum, currMin,currMax, angleMin, angleMax);
      var speedValNum = map(valNum, currMin, currMax, speedMin, speedMax);
      servVals[i] = sVal;
      speedValArray[i] = speedValNum;
      var xStart = i * 40 + 80;
      var yStart = 400 - valNum;
      rects.splice(0, rects.length); 
      let newB = new Rectangle(xStart, yStart, valNum, sVal);
      rects.push(newB);
    }
    //HTML TABLE TRIAL
     let d = select('#user_table');
     d.remove();
     for (var i = 0; i < wholeTable.length; i++) {
         tr = createElement("tr");
             tr.id("user_table");
         th = createElement("th")
         th.parent("user_table");
             if (headerArray[i] != null) {
               th.html(headerArray[i]);
             }
         td_1 = createElement("td");
         td_1.html(wholeTable[i][0]);
         td_2 = createElement("td");
             td_2.html(wholeTable[i][1]);
             //td_2.class('myclass-td');
     }
}

function updateVariableDropdown() {
    selNew = createSelect();
    sel = selNew;
    sel.position(300, 10);
    for (let i = 1; i < headerArray.length; i++) {
      sel.option(headerArray[i]);
    }
    sel.changed(mySelectEvent);
}

function mySelectEvent() {
  varIndex = headerArray.indexOf(sel.value());
  //console.log(varIndex);
}

function selectSpeedType() {
  var speedType = sel.value();
  if(speedType == "up & down") {
    speedToggle = 0;
  } else if(speedType == 'up'){
    speedToggle = 1;
  } else if(speedType == 'down'){
    speedToggle = 2;
  }
}

function checkReset() {
  if (this.checked()) {
    console.log('Checked');
    resetToggle = 1;
    var i = 0;
    for (let x = 0; x < servVals.length; x++) {
      servValsReset[i] = servVals[x];
      servValsReset[i + 1] = 1;
      i = i + 2;
    }
    x = 0;
    console.log(servValsReset);
  } else {
    console.log('Unchecked');
    resetToggle = 0;
  }
}

//START MAPPING FUNCTION
function startPos() {
    if (!interval) {
      if (posSpeedToggle==2) {
        console.log("cycle trhough 2 hit")
        //clearInterval(interval);
        ry = 200;
        interval = setInterval(cycleThrough2, speed);
        //cycleThrough2();
      } else {
        speed = delayInput.value();
        interval = setInterval(cycleThrough, speed);
      }
    buttonPos.html('Stop Mapping');
  } else {
    clearInterval(interval);
    interval = false;
    buttonPos.html('Start Mapping');
  }
}

//MAPPING FUNCTION RETRY
function cycleThrough() {
  if (posSpeedToggle==1) {//POSITION
    if (resetToggle==0){//no reset
      var currentAngle = servoAngle;
      servo.write(servVals[counter]);
      servoAngle = this.servVals[counter];
      console.log(servVals[counter]);
      console.log(counter);
      var rectInc = map(servVals[counter], 0, 180, 75, 10);
      ry = rectInc;
      rVar = -servoAngle;
      counter++;
      counter = counter % servVals.length;
    } else {//yes reset
      var currentAngle = servoAngle;
      servo.write(servValsReset[counter]);
      servoAngle = this.servValsReset[counter];
      console.log(servValsReset[counter]);
      console.log(counter);
      var rectInc = map(servValsReset[counter], 0, 180, 75, 10);
      rVar = -servoAngle;
      ry = rectInc;
      if (currentAngle < servoAngle) {
         y2 = y2-20;
         y1 = y1+10;
      } else {
         y2 = y2+20;
         y1 = y1-10;
      }
      counter++;
      counter = counter % servValsReset.length;
      }
      // var rectInc = map(servVals[counter], 0, 180, 200, 10);
      //   ry = rectInc;
      // if (currentAngle < servoAngle) {
      //      y2 = y2-20;
      //      y1 = y1+10;
      // } else {
      //      y2 = y2+20;
      //      y1 = y1-10;
      // }
  }
}

function cycleThrough2() {
  //speedIndex = 0;
  speed = speedValArray[speedIndex];
  console.log(speed);
  speedIndex = (speedIndex + 1) % speedValArray.length;
  setTimeout(setSpeedAngle, speed);
}

function setSpeedAngle(){
  if (speedAngle == 1) {
      speedAngle = 179;
      ry = 20;
      rVar = 180;
      servo.write(179);
      console.log("180 hit");
  } else {
      speedAngle = 1;
      ry = 150;
      rVar = 0;
      servo.write(1);
      console.log("0 hit");
      } 
}

function moveBackToZero() {
  servo.write(0);
}


// Rectangle class
class Rectangle {
  constructor(x, y, num, sVal) {
    this.x = x;
    this.y = y;
    this.w = 20;
    this.h = num;
    this.servoValue = sVal;
  }

  clicked(px, py) {
    //let d = dist(px, py, this.x, this.y);
    if (px > this.x && (px < (this.x + this.w))) {
      if (py > this.y && (py < (this.y + this.h))) {
        //console.log("barclicked!");
        servo.write(this.servoValue);
        servoAngle = this.servoValue;
      }
    }
  }


  display() {
    rect(this.x, this.y, this.w, this.h);
  }

  createRow() {
    rect(this.x, this.y, this.w, this.h);
  }
}
