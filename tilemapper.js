
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

  var layerName = new Array (32);
  for (var i = 0; i < layerName.length; i++) {
    layerName[i] = new Array (24);
    for (var j = 0; j < layerName[i].length; j++) {
      layerName[i][j] = 0;
    }
  }

  var data = {
    name : canvasName,
    zIndex : canvasCounter,
    layerArray : layerName,
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
    var reqId = innerBoxId.substr(9,innerBoxId.lenght);
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
  var Id = buttonId.substr(7,buttonId.lenght);
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
  canvasMaker(canvasName);
};

var looker = document.getElementById("looker");
var ctx = looker.getContext("2d");
const LENGHT = 25;
const HEIGHT = 25;

function drawGrid(row, col) {
  var x = 0 ;
  var y = 0 ;
  var col = col ;
  var row = row ;
  let width = LENGHT ;
  let lenght = HEIGHT ;
  ctx.strokeRect( x, y, col*LENGHT , row*HEIGHT);
  for (var i = 0; i < row; i++) {
    for (var j = 0; j < col; j++) {
      ctx.strokeRect( x, y, LENGHT , HEIGHT);
      x = x + LENGHT;
    }
    x = 0;
    y = y + HEIGHT;
  }
};

drawGrid(24,32);

var mouseX = 0;
var mouseY = 0;
var indexX = 0;
var indexY = 0;
var drawing = false;


function draw(indexX,indexY) {
  ctx1.clearRect( indexX*LENGHT, indexY*HEIGHT, LENGHT, HEIGHT);
  ctx1.drawImage( currentSprite , indexX*LENGHT, indexY*HEIGHT, LENGHT, HEIGHT);
  layersData[currentDataIndex].layerArray[indexX][indexY] = Sprites.indexOf(currentSprite);
};

function eraser() {
  erasing = true;
}

function erase(indexX,indexY) {
  //console.log("indexX="+indexX + "," + "indexY=" + indexY);
  ctx1.clearRect( indexX*LENGHT, indexY*HEIGHT, LENGHT, HEIGHT);
  layersData[currentDataIndex].layerArray[indexX][indexY] = 0;
};

function eraserAll() {
  ctx1.clearRect( 0, 0, currentCanvas.width, currentCanvas.height);
  for (var i = 0; i < layersData[currentDataIndex].layerArray.length; i++) {
    for (var j = 0; j < layersData[currentDataIndex].layerArray[i].length; j++) {
      layersData[currentDataIndex].layerArray[i][j] = 0
    }
  }
};

function findBox(mouseX,mouseY) {
  indexX = Math.floor(mouseX/LENGHT);
  indexY = Math.floor(mouseY/HEIGHT);
  //console.log("("+indexX+","+indexY+")")
  if(!erasing){
    draw(indexX,indexY);
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
  document.getElementById("eraserAll").style.display = "flex";
  document.getElementById("edit").style.display = "none";
  document.getElementById("preview").style.display = "flex";
};

function hideLooker() {
  looker.style.display = "none";
  document.getElementById("edit").style.display = "flex";
  document.getElementById("eraser").style.display = "none";
  document.getElementById("eraserAll").style.display = "none";
  document.getElementById("preview").style.display = "none";
};
