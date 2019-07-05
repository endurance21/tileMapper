
var currentSprite = null ;
var erasing = false;
const ImageLoader = new ImageLoaderClass();
const dirt = ImageLoader.load("dirt.png");
dirt.setAttribute("class","Ground");
const grass = ImageLoader.load("grass.png");
grass.setAttribute("class","Ground");
const sand = ImageLoader.load("sand.png");
sand.setAttribute("class","Ground");
const treeLarge = ImageLoader.load("treeLarge.png");
treeLarge.setAttribute("class","object");
const treeSmall = ImageLoader.load("treeSmall.png");
treeSmall.setAttribute("class","object");

const Sprites = [null,dirt,grass,sand,treeLarge,treeSmall];

var noOfCanvas = 0;
var rows = 0;
var cols = 0;

for (var i = 1; i < Sprites.length; i++) {
  Sprites[i].addEventListener("click",function () {
    currentSprite = this;
    erasing = false;
  });
};

document.getElementById("Sprites").appendChild(dirt);
document.getElementById("Sprites").appendChild(sand);
document.getElementById("Sprites").appendChild(grass);
document.getElementById("Sprites").appendChild(treeLarge);
document.getElementById("Sprites").appendChild(treeSmall);


var preview = false;
var currentLayer = null;
var currentDataIndex = null;
var currentCanvas = null;
var canvasCounter = 0;
var ctx1 = null;
var layersData = [];

function canvasMaker(canvasName) {

  var canvas = document.createElement("canvas");
  canvas.setAttribute("id","canvas-"+canvasName);
  canvas.setAttribute("class","canvases");
  canvas.setAttribute("data-index",canvasCounter);
  canvas.style.zIndex = -(++canvasCounter);
  //canvas.setAttribute("z-index",zIndexCounter++);
  canvas.width = 800;
  canvas.height = 600;
  document.getElementById("canvas-container").appendChild(canvas);
  noOfCanvas++;
  var ctx2 = canvas.getContext("2d");

  console.log(cols+","+rows);

  var layerName = [];
  for (var i = 0; i < cols; i++) {
    layerName[i] = [];
    for (var j = 0; j < rows; j++) {
      layerName[i][j] = 0;
    }
  }

  var data = {
    name : canvasName,
    zIndex : canvasCounter,
    layerArray : layerName,
    offSetX : 0,
    offSetY : 0,
    ctx : ctx2,
  }

  layersData.push(data);

  var box = document.createElement("div");
  box.setAttribute("id",canvasName);
  box.setAttribute("class","box");
  box.setAttribute("draggable","true");
  box.style.order = canvasCounter;
  document.getElementById("layers-box").appendChild(box);

  var innerBox = document.createElement("div");
  innerBox.setAttribute("id","innerBox-"+canvasName);
  innerBox.setAttribute("class","innerBox");
  innerBox.innerHTML = canvasName;
  innerBox.addEventListener("mousedown",function(e){
    currentLayer.className = "innerBox";
    currentLayer = this;
    currentLayer.className = "selected";
    var innerBoxId = currentLayer.id;
    var reqId = innerBoxId.substr(9,innerBoxId.length);
    currentCanvas = document.getElementById("canvas-"+ reqId);
    currentDataIndex = currentCanvas.getAttribute("data-index");
    ctx1 = currentCanvas.getContext("2d");
  });
  document.getElementById(canvasName).appendChild(innerBox);
  currentLayer = innerBox;

  var boxButton = document.createElement("button");
  boxButton.setAttribute("id","button-"+canvasName);
  boxButton.setAttribute("type","button");
  boxButton.setAttribute("class","boxButton");
  boxButton.innerHTML = "order";
  boxButton.setAttribute("onclick", "ordering()");
  document.getElementById(canvasName).appendChild(boxButton);
};


function ordering() {
  var order = prompt("enter the new order");
  var canvases = document.getElementsByClassName("canvases");
  var boxes = document.getElementsByClassName("box");
  var buttonId = event.srcElement.id;
  var Id = buttonId.substr(7,buttonId.length);
  var currentBox = document.getElementById(Id);
  for (var i = 0; i < boxes.length; i++) {
    if(boxes[i].style.order >= order && boxes[i].style.order < currentBox.style.order){
      boxes[i].style.order++;
    }
    if(boxes[i].style.order <= order && boxes[i].style.order > currentBox.style.order){
      boxes[i].style.order--;
    }
      canvases[i].style.zIndex = -(boxes[i].style.order);
  }
  currentBox.style.order = order;
  var canvas1 = document.getElementById("canvas-"+Id);
  canvas1.style.zIndex = -(order);
};

function info() {
  var canvasName = prompt("enter the layer name","world");
  if(noOfCanvas == 0){
    cols = prompt("enter the no of columns");
    rows = prompt("enter the no of rows");
  }
  canvasMaker(canvasName);
  var canvas = document.getElementById('canvas-'+canvasName);
  var ctx = canvas.getContext("2d");
};

var looker = document.getElementById("looker");
var ctx = looker.getContext("2d");
const LENGTH = 25;
const HEIGHT = 25;

function drawGrid(row, col, ctx) {
  var x = 0 ;
  var y = 0 ;
  var col = col ;
  var row = row ;
  let width = LENGTH ;
  let length = HEIGHT ;
  ctx.strokeRect( x, y, col*LENGTH , row*HEIGHT);
  for (var i = 0; i < row; i++) {
    for (var j = 0; j < col; j++) {
      ctx.strokeRect( x, y, LENGTH , HEIGHT);
      x = x + LENGTH;
    }
    x = 0;
    y = y + HEIGHT;
  }
};

drawGrid(24,32,ctx);




var vertical = 0;
var horizontal = 0;
var moving = false;

function moveCanvas(vertical,horizontal,moving) {
  var prevOffSetX = layersData[currentDataIndex].offSetX;
  var prevOffSetY = layersData[currentDataIndex].offSetY;
  layersData[currentDataIndex].offSetX = layersData[currentDataIndex].offSetX + horizontal;
  layersData[currentDataIndex].offSetY = layersData[currentDataIndex].offSetY + vertical;
  var offSetXMax = (cols - 32) * 25 ;
  var offSetYMax = (rows - 24) * 25 ;

  if (layersData[currentDataIndex].offSetX < 0 || layersData[currentDataIndex].offSetX > offSetXMax) {
    layersData[currentDataIndex].offSetX = prevOffSetX;
  }

  if (layersData[currentDataIndex].offSetY < 0 || layersData[currentDataIndex].offSetY > offSetYMax) {
    layersData[currentDataIndex].offSetY = prevOffSetY;
  }

  draw();
}

function moveAllCanvas(vertical,horizontal,moving) {
  for (var i = 0; i < noOfCanvas; i++) {
    var prevOffSetX = layersData[i].offSetX;
    var prevOffSetY = layersData[i].offSetY;
    layersData[i].offSetX = layersData[i].offSetX + horizontal;
    layersData[i].offSetY = layersData[i].offSetY + vertical;
    var offSetXMax = (cols - 32) * 25 ;
    var offSetYMax = (rows - 24) * 25 ;

    if (layersData[i].offSetX < 0 || layersData[i].offSetX > offSetXMax) {
      layersData[i].offSetX = prevOffSetX;
    }

    if (layersData[i].offSetY < 0 || layersData[i].offSetY > offSetYMax) {
      layersData[i].offSetY = prevOffSetY;
    }
  }

  drawAllCanvas();

}


function handleKeyDown(e) {
  var canvases = document.getElementsByClassName("canvases");
  console.log(canvases.length);
  if(noOfCanvas){
    switch(e.code){
        case 'KeyW': case 'ArrowUp' :
            console.log("hey");
            vertical = -HEIGHT;
            moving = true;
            break;
        case 'KeyA': case 'ArrowLeft' :
            horizontal = -LENGTH;
            moving = true;
            break;
        case 'KeyS': case 'ArrowDown' :
            vertical = HEIGHT;
            moving = true;
            break;
        case 'KeyD': case 'ArrowRight' :
            horizontal = LENGTH;
            moving = true;
            break;
    }
    if (preview == true) {
    moveAllCanvas(vertical,horizontal,moving);
    }else {
      moveCanvas(vertical,horizontal,moving);
    }
  }
}

function handleKeyUp(e) {
  var canvases = document.getElementsByClassName("canvases");
  if(canvases.length){
    switch(e.code){
      case 'KeyW': case 'ArrowUp' :
          vertical = 0;
          moving = false;
          break;
      case 'KeyA': case 'ArrowLeft' :
          horizontal = 0;
          moving = false;
          break;
      case 'KeyS': case 'ArrowDown' :
          vertical = 0;
          moving = false;
          break;
      case 'KeyD': case 'ArrowRight' :
          horizontal = 0;
          moving = false;
          break;
    }
  }
}




window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);





var mouseX = 0;
var mouseY = 0;
var indexX = 0;
var indexY = 0;
var drawing = false;

function eraser() {
  erasing = true;
}

function update(indexX,indexY) {
  layersData[currentDataIndex].layerArray[indexX + (layersData[currentDataIndex].offSetX/LENGTH)][indexY + (layersData[currentDataIndex].offSetY/HEIGHT)] = Sprites.indexOf(currentSprite);
  draw();
}

function draw() {
//ctx1.clearRect( indexX*LENGTH, indexY*HEIGHT, LENGTH, HEIGHT);
//ctx1.drawImage( currentSprite , indexX*LENGTH, indexY*HEIGHT, LENGTH, HEIGHT);
//  layersData[currentDataIndex].layerArray[indexX][indexY] = Sprites.indexOf(currentSprite);
//console.log(layersData[currentDataIndex].offSetY);
  var startCol = layersData[currentDataIndex].offSetX/LENGTH;
  var startRow = layersData[currentDataIndex].offSetY/HEIGHT;
  var endCol = startCol + 32;
  var endRow = startRow + 24;

  for (var i = startCol; i <= endCol; i++) {
    for (var j = startRow; j <= endRow; j++) {
      var x = i - (layersData[currentDataIndex].offSetX/LENGTH);
      var y = j - (layersData[currentDataIndex].offSetY/HEIGHT);
      if(layersData[currentDataIndex].layerArray[i][j]){
        ctx1.clearRect( x*LENGTH, y*HEIGHT, LENGTH, HEIGHT);
        ctx1.drawImage( Sprites[layersData[currentDataIndex].layerArray[i][j]] , x*LENGTH, y*HEIGHT, LENGTH, HEIGHT);
      }
      else {
        ctx1.clearRect( x*LENGTH, y*HEIGHT, LENGTH, HEIGHT);
      }
    }
  }
};

function drawAllCanvas() {
  var startCol = layersData[0].offSetX/LENGTH;
  var startRow = layersData[0].offSetY/HEIGHT;
  var endCol = startCol + 32;
  var endRow = startRow + 24;

  for (var k = 0; k < noOfCanvas; k++) {
    for (var i = startCol; i <= endCol; i++) {
      for (var j = startRow; j <= endRow; j++) {
        var x = i - (layersData[k].offSetX/LENGTH);
        var y = j - (layersData[k].offSetY/HEIGHT);
        if(layersData[k].layerArray[i][j] > 0){
          layersData[k].ctx.clearRect( x*LENGTH, y*HEIGHT, LENGTH, HEIGHT);
          layersData[k].ctx.drawImage( Sprites[layersData[k].layerArray[i][j]] , x*LENGTH, y*HEIGHT, LENGTH, HEIGHT);
        }
        else {
          layersData[k].ctx.clearRect( x*LENGTH, y*HEIGHT, LENGTH, HEIGHT);
        }
      }
    }
  }
}

function erase(indexX,indexY) {
  //console.log("indexX="+indexX + "," + "indexY=" + indexY);
  //ctx1.clearRect( indexX*LENGTH, indexY*HEIGHT, LENGTH, HEIGHT);
  layersData[currentDataIndex].layerArray[indexX + (layersData[currentDataIndex].offSetX/LENGTH)][indexY + (layersData[currentDataIndex].offSetY/HEIGHT)] = 0;
  draw();
};

function eraserAll() {
  //ctx1.clearRect( 0, 0, currentCanvas.width, currentCanvas.height);
  for (var i = 0; i < layersData[currentDataIndex].layerArray.length; i++) {
    for (var j = 0; j < layersData[currentDataIndex].layerArray[i].length; j++) {
      layersData[currentDataIndex].layerArray[i][j] = 0
    }
  }
  draw();
};

function findBox(mouseX,mouseY) {
  indexX = Math.floor(mouseX/LENGTH);
  indexY = Math.floor(mouseY/HEIGHT);
  //console.log("("+indexX+","+indexY+")")
  if(!erasing){
    update(indexX,indexY);
  }
  else {
    erase(indexX,indexY);
  }
};

var rect = looker.getBoundingClientRect();

window.addEventListener("resize",function(e) {
  rect = looker.getBoundingClientRect();
});

looker.addEventListener("mousedown",function(e) {
  mouseX = (e.clientX - rect.left);
  mouseY = (e.clientY - rect.top);
  findBox(mouseX,mouseY);
  drawing = true;
});

looker.addEventListener("mousemove",function(e) {
  if (drawing ) {
    mouseX = (e.clientX - rect.left);
    mouseY = (e.clientY - rect.top);
    //console.log("("+e.clientX+","+e.clientY+")")    //a problem with mousemove is that it doesn't work when chrome dev tools are open
    findBox(mouseX,mouseY);
  }
});

looker.addEventListener("mouseup",function(e) {
  drawing = false;
});


function dataOut() {
  var jsKey = [ null, Sprites[1].src, Sprites[2].src, Sprites[3].src, Sprites[4].src, Sprites[5].src]
  var jsonKey = JSON.stringify(jsKey);
  var jsonData = JSON.stringify(layersData);
  console.log(jsonKey);
  console.log(jsonData);
  var download = document.createElement("a");
  download.setAttribute("href","data:text/plain;charset=utf-8,"+ encodeURIComponent(jsonKey) + encodeURIComponent(jsonData));
  download.setAttribute("download","tileMap.txt");
  download.style.display = "none";
  document.getElementById("tools").appendChild(download);

  download.click();       // this function call mimics a click on the element

  document.getElementById("tools").removeChild(download);
};



function displayLooker() {
  looker.style.display = "block";
  document.getElementById("eraser").style.display = "flex";
  document.getElementById("edit").style.display = "none";
  preview = false;
};

function hideLooker() {
  preview = true;
  looker.style.display = "none";
  document.getElementById("edit").style.display = "flex";
  document.getElementById("eraser").style.display = "none";
  for (var i = 0; i < noOfCanvas; i++) {
  layersData[i].offSetX = 0;
  layersData[i].offSetY = 0;
  }
  drawAllCanvas();
};
