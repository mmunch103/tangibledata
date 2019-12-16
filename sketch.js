//last version 12/13/19
var b = p5.board('/dev/cu.usbmodem1411', 'arduino');
let rects = []; // array of Rectangle objects]]
let tableArray = [];//array of table objects
//let positionSliderMin, positionSliderMax,speedSliderMin, speedSliderMax;
let buttonPos;
let delayInput, cycleInput;
let sel, selSpeed; //variable dropdown
let resetCheckbox;

//data min and max labels
var p3, p4, p7, p8;

//for D3
var filename = 'assets/mammals.csv';  

var imgBack, imgGear, imgPin, imgTop;

var tableRect;

//gets html id from slider
var fromID, fromID2, fromID3;

let table;
var servo;
var servoAngle = 0;

var highlightHolder;
var highlight_td = 0;

// var tr;
// var th;
// var td_1;
// var td_2;

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

var currSimVal = 0;
var mapSimVal = 0;

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
    c.position(1000, 20);
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
    currMin = currMin - 1;
    currMax = currMax + 1;
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
    //makeTable();
     //HTML TABLEx
    //  for (var i = 0; i < wholeTable.length; i++) {
    //       tr = createElement("tr");
    //           tr.id("user_table");
    //       th = createElement("th")
    //           th.parent("user_table");
    //           if (headerArray[i] != null) {
    //             th.html(headerArray[i]);
    //          }
    //       td_1 = createElement("td");
    //           td_1.html(wholeTable[i][0]);
    //           td_1.parent("user_table");
    //       td_2 = createElement("td");
    //           td_2.html(wholeTable[i][1]);
    //           td_2.parent("user_table");
    //           //td_2.class('myclass-td');
    //   }

// <tr data-min="100" datta-max="150">
//    <td></td>
//use .attribute('data-min', 100);
// </tr>

// 

    var divPointer = select('#tr_id');
    var divPointer2 = select('#tbody_id')
     for (var i = 0; i < headerArray.length; i++) {
          var th = createElement("th")
          if (headerArray[i] != null) {
              th.html(headerArray[i]);
          }
          th.parent(divPointer);
        }
    for (var i = 0; i < wholeTable.length; i++) {
      var tr = createElement("tr");
      tr.attribute('data', i);
      tr.parent(divPointer2);
       tr.addClass('tr_tbody');
       for (var j = 0; j < wholeTable[0].length; j++) {
           var td_1 = createElement("td");
           td_1.html(wholeTable[i][j]);
           //td_1.attribute('data', i);
           td_1.parent(tr);
       }
     }
     highlightHolder = selectAll('.tr_tbody');
     console.log(highlightHolder);
   

    //variable dropdown
    var dropLabel = createP("Select column to map: ");
    dropLabel.position(330, 20);
    sel = createSelect();
    sel.position(480, 20);
    for (let i = 1; i < headerArray.length; i++) {
      sel.option(headerArray[i]);
    }
    sel.changed(mySelectEvent);

    // selSpeed = createSelect();
    // selSpeed.position(450, 630);
    // selSpeed.option("up & down");
    // selSpeed.option("up");
    // selSpeed.option("down");
    // selSpeed.changed(selectSpeedType);

    resetCheckbox = createCheckbox('Reset to 0 degrees', false);
    resetCheckbox.position(360, 90);
    resetCheckbox.changed(checkReset);


    //LABELS FOR SLIDERS
    p3 = createP("Data min = "+ currMin);
    p3.id('dataMinLabel');
    p3.position(380, 200);
    p4 = createP("Data max = " + currMax);
    p4.id('dataMaxLabel');
    p4.position(380, 230);
    var p5 = createP("0&#176");
    p5.position(500, 380);
    var p6 = createP("180&#176");
    p6.position(500, 120);
    p7 = createP("Data min = " + currMin);
    p7.position(680, 200);
    p7.id('dataMinLabel2');
    p8 = createP("Data max = " + currMax);
    p8.position(680, 230);
    p8.id('dataMaxLabel2');
    var p9 = createP("0.2s");
    p9.position(805, 380);
    var p0 = createP("5.0s");
    p0.position(805, 120);

    buttonPos = createButton('Start Mapping');
    buttonPos.position(1000, 540);
    buttonPos.mousePressed(startPos);

    delayInput = createSelect();
    delayInput.position(450, 420);
    delayInput.option("0.5s", 500);
    delayInput.option("1.0s", 1000);
    delayInput.option("2.0s", 2000);
    delayInput.option("3.0s", 3000);
    delayInput.changed(changeDelay);
    var delayTitle = createP("Delay Each by:");
    delayTitle.position(350, 420);

    // cycleInput = createSelect();
    // cycleInput.position(400, 450);
    // cycleInput.option("Continuous", 500);
    // cycleInput.option("Once", 1000);
    // cycleInput.option("5 Times", 2000);
    //var cycleTitle = createP("Cycles:");
    //cycleTitle.position(350, 450);
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

    image(imgPin, 185, ry);

    fromID = select('#posSlider');
    let rangeID = fromID.value();
    var res = rangeID.split(",");
    angleMin = res[0];
    angleMax = res[1];

    fromID2 = select('#speedSlider');
    let rangeID2 = fromID2.value();
    var res2 = rangeID2.split(",");
    speedMin = res2[0];
    speedMax = res2[1];

    //text("Current Data Value: " + currSimVal,10,470);
    text("Mapped Data Value: " + mapSimVal,10,490);

    posSpeedToggle = $('input[name=radio-test]:checked').val();

    image(imgTop,180,115);

}

function updateSlider() {
  // angleMin = positionSliderMin.value();
  // angleMax = positionSliderMax.value();
  // speedMin = speedSliderMin.value();
  // speedMax = speedSliderMax.value();
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

function highlightTable(c) {
    if (resetToggle == 0) {
     for (var i=0 ; i < highlightHolder.length; i++) {
        if (i == c) {
           highlightHolder[i].style('background-color','#C9F1F0');
        } else {
           highlightHolder[i].style('background-color','white');
        }
      }
    } else if (resetToggle == 1) {
        for (var i=0 ; i < highlightHolder.length; i++) {
        if ((i * 2 == c) || (c == i*2 + 1)) {
           highlightHolder[i].style('background-color','#C9F1F0');
        } else {
           highlightHolder[i].style('background-color','white');
        }
      }
    }
 }

//delay each function
function changeDelay() {
  speed = delayInput.value(); 
}

function highlight() {
  dropzone.style('background-color', '#ccc');
}

function unhighlight() {
  dropzone.style('background-color', '#fff');
}

//triggered when new file is uploaded
function gotFile(file) {
  filename = file.name;
  console.log(filename);
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
    currMin = currMin - 1;
    currMax = currMax + 1;


    p3.remove();
    p3 = createP("Data min = "+ currMin);
    p3.id('dataMinLabel');
    p3.position(380, 200);
    p4.remove();
    p4 = createP("Data max = " + currMax);
    p4.id('dataMaxLabel');
    p4.position(380, 230);
    p7.remove();
    p7 = createP("Data min = " + currMin);
    p7.position(680, 200);
    p7.id('dataMinLabel2');
    p8.remove();
    p8 = createP("Data max = " + currMax);
    p8.position(680, 230);
    p8.id('dataMaxLabel2');


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
    if (wholeTable.length < servVals.length ) {
      //var diff = serVals.length - wholeTable.length;
      servVals.length = wholeTable.length;
      console.log("servVals"+servVals);
    }
    console.log(wholeTable);
    console.log(varIndex);
    console.log(servVals);

    //updateTable();
    //makeTable();
    //HTML TABLE TRIAL
      
      var empty1 = selectAll('td');
      for (var x=0; x< empty1.length; x++) {
        empty1[x].remove();
      }
      var empty2 = selectAll('th');
      for (var y=0; y<empty2.length; y++) {
        empty2[y].remove();
      }
      var empty3 = selectAll('.tr_tbody','#tbody_id');
      for (var z=0; z<empty3.length; z++) {
        empty3[z].remove();
      }
      var divPointer = select('#tr_id');
      var divPointer2 = select('#tbody_id')
      for (var i = 0; i < headerArray.length; i++) {
          var th = createElement("th")
          if (headerArray[i] != null) {
              th.html(headerArray[i]);
          }
          th.parent(divPointer);
      }
      for (var i = 0; i < wholeTable.length; i++) {
      var tr = createElement("tr");
      tr.attribute('data', i);
      tr.parent(divPointer2);
      tr.addClass('tr_tbody');
       for (var j = 0; j < wholeTable[0].length; j++) {
           var td_1 = createElement("td");
           td_1.html(wholeTable[i][j]);
           td_1.parent(tr);
       }
     }
     highlightHolder.length=0;
     console.log("empty:"+highlightHolder)
     highlightHolder = selectAll('.tr_tbody');
     console.log(highlightHolder);

}

function updateVariableDropdown() {
    sel.remove();
    selNew = createSelect();
    sel = selNew;
    sel.position(480, 20);
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
      //counter = 0;
      updateSlider();
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
      //currSimVal = wholeTable[varIndex][counter];
      servo.write(servVals[counter]);
      servoAngle = this.servVals[counter];
      mapSimVal = servoAngle;
      highlightTable(counter);
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
      highlightTable(counter);
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
  highlightTable(speedIndex);
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


// d3.text(filename, function(data) {
//       var parsedCSV = d3.csv.parseRows(data);

//        var container = d3.select("body")
//           .append("table")

//           .selectAll("tr")
//           .data(parsedCSV).enter()
//           .append("tr")

//           .selectAll("td")
//           .data(function(d) { return d; }).enter()
//           .append("td")
//           .text(function(d) { return d; });
//         });
//       var range = document.getElementById('range');

