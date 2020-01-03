    
const mycanvas = document.getElementById('mycanvas');
const c = mycanvas.getContext("2d");
const socket = io.connect("http://localhost:3000");

//special thanks to https://gist.github.com/gerbenvandijk/7543149
function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
    throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

for(let i=0;i<lednum;i++){
    socket.on(String(i),function(color){
    //もし違う色なら塗る
    console.log("recieved",i,color)
    fill(i,color,false);
  });
}

function emit(num,color){
  socket.emit(String(num),color);
  console.log("sent",num,color);
}


function fill(i,color,local){
  let xx = eachwidth/2;
  let data = c.getImageData(eachwidth*i*scaleBy+xx, height/2, 1, 1).data; 
  hex = "#" + ("000000" + rgbToHex(data[0], data[1], data[2])).slice(-6); 
  if(hex!=color && local==true){emit(i,color);}
  c.fillStyle=color;
  c.fillRect(i*eachwidth+0.4,0.5,eachwidth-1,height-1.5);
  c.fill();
}

/*
// fill[<where>](color);
const fill = []
for (let i=0; i< lednum; i++){
  fill[i]=function(color,local){
    let xx = eachwidth/2;
    let data = c.getImageData(eachwidth*i*scaleBy+xx, height/2, 1, 1).data; 
    hex = "#" + ("000000" + rgbToHex(data[0], data[1], data[2])).slice(-6); //current hex color on canvas
    //console.log(hex, color)
    if(hex!=color && local==true){emit(i,color);}

    c.fillStyle=color;
    c.fillRect(i*eachwidth+0.4,0.5,eachwidth-1,height-1.5);
    c.fill();
  }
}
*/
function init() {
  
  mycanvas.width = width * scaleBy;
  mycanvas.height = height * scaleBy;
  mycanvas.style.width = width + 'px';
  //console.log("hello");
  //console.log(mycanvas.style.width)
  mycanvas.style.height = height + 'px';

  c.scale(scaleBy, scaleBy);
	c.fillStyle = "#fafafa";
	c.fillRect(0,0,width,height);
  c.fill();
  //枠線作る
	c.beginPath();
  c.strokeStyle = "black";
	c.moveTo(0,0);
	c.lineTo(width,0);
	c.lineTo(width-1 ,height);
	c.lineTo(0, height);
	c.closePath();
	//外形を見たいときは下のコメントアウトを外す
  c.stroke();

	let xx = eachwidth;
	c.strokeStyle = "#ccc";
	c.lineWidth = "0.6";
	c.beginPath();
	c.moveTo(xx, 0.5);
  c.lineCap = "round";
        
	for (let i=0; i<lednum-1; i++) {
	  c.lineTo(xx, height-0.5);
    xx += eachwidth;
    c.moveTo(xx,0.5);
	}
	c.closePath();
	c.stroke();
  //console.log(eachwidth, height);
  reset();
}

init();



function reset(){
  for(let i=0;i<lednum;i++){
    fill(i,"#000000",true);
  }
}

function quantize(xx,yy){
  let left = 0
  for(let i=0;i<lednum;i++){
    if (0<yy && yy<height && left<xx && xx<left+eachwidth){
      return i;
      //break;
    }
    left += eachwidth;
  }
}
////////////////////
//script for mouse drawing, undo, and erase
var mouse = {
x: 0,
y: 0,
x1: 0,
y1: 0
};
var draw = false;

/*
let startTime = "";
let b = document.getElementById("all");
b.addEventListener("touchstart",function(){
    startTime = performance.now();
    console.log("down");

    
})

b.addEventListener("touchend",function(){
    let endTime = performance.now();
    console.log(endTime - startTime); 
})
*/





mycanvas.addEventListener("mousemove", function (e) {
  var rect = e.target.getBoundingClientRect();
  //console.log(rect);draw=true;
	mouseX = e.clientX - rect.left;
	mouseY = e.clientY - rect.top;
	if (draw === true) {
    console.log("hello");
		mouseX1 = mouseX;
		mouseY1 = mouseY;
		if (quantize(mouseX, mouseY) === undefined) {
			//console.log("out of tree!!!!") //for test
		} else {
            fill(quantize(mouseX, mouseY),currentColor,true);
            //console.log("filled "+String(quantize(mouseX, mouseY)));
		}
	}
});

mycanvas.addEventListener("mousedown", function (e) {
	draw = true;
	mouseX1 = mouseX;
  mouseY1 = mouseY;
  //console.log(quantize(mouseX, mouseY));
	undoImage = c.getImageData(0, 0, mycanvas.width, mycanvas.height);
	if (quantize(mouseX, mouseY) === undefined) {
        //console.log("out of tree!!!!") //for test
	} else {
        fill(quantize(mouseX, mouseY),currentColor,true);
        //console.log("filled "+String(quantize(mouseX, mouseY)));
	}
});


mycanvas.addEventListener("mouseup", function (e) {
	draw = false;
});
window.addEventListener("mouseup", function (e) {
	draw = false;
});


//for smartphones
var finger1 = {
	x: 0,
	y: 0,
	x1: 0,
	y1: 0
}
//get where touch started
mycanvas.addEventListener("touchstart", function (e) {
	e.preventDefault();
	var rect = e.target.getBoundingClientRect();
	undoImage = c.getImageData(0, 0, mycanvas.width, mycanvas.height);
	finger1.x1 = e.touches[0].clientX - rect.left;
	finger1.y1 = e.touches[0].clientY - rect.top;
	if (quantize(finger1.x1, finger1.y1) === undefined) {
		//console.log("out of tree!!!!") //for test
	} else {
        fill(quantize(finger1.x1, finger1.y1),currentColor,true);
        //delay(25);
        //console.log("filled "+quantize(finger1.x1, finger1.y1));
	}
});
//draw when move while touching
mycanvas.addEventListener("touchmove", function (e) {
	e.preventDefault();
	var rect = e.target.getBoundingClientRect();
	finger1.x = e.touches[0].clientX - rect.left;
	finger1.y = e.touches[0].clientY - rect.top;
	finger1.x1 = finger1.x;
	finger1.y1 = finger1.y;
	if (quantize(finger1.x, finger1.y) === undefined) {
		//console.log("out of tree! (touched)")
	} else {
        fill(quantize(finger1.x, finger1.y),currentColor,true);
	}
});


$('#clear').click(function (e) {
	if (!confirm('本当に消去しますか？'))
		return;
	e.preventDefault();
  init();
  reset();
});

$('#undo').click(function (e) {
	c.putImageData(undoImage, 0, 0);
});




var copiedHex = ko.observable();
var selectedColor = ko.observable("pink"); // lazy

ko.applyBindings({
    materialColors: [
        {color: "white",hex: "#EDEDED"},
        {color: "pink",hex: "#F06292"},
        {color: "red",hex: "#EF5350"},
        {color: "orange",hex: "#FFA726"},
        {color: "yellow",hex: "#FFEB3B"},
        {color: "lightgreen",hex: "#DCE775"},
        {color: "green",hex: "#66BB6A"},
        {color: "lightblue",hex: "#80D6FF"},
        {color: "blue",hex: "#2196F3"},
        {color: "purple",hex: "#AB47BC"},
        //{color: "beige",hex: "#FFFFBC"},
        {color: "black",hex: "#000000"},
        //{color: "12",hex: "#EC407A"},
    ]
});



function rgb2hex(color){
    let hex = '#';
    if (color.match(/^#[a-f\d]{3}$|^#[a-f\d]{6}$/i)){return color;}
    var regex = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (regex){
      var rgb = [
        parseInt(regex[1]).toString(16),
        parseInt(regex[2]).toString(16),
        parseInt(regex[3]).toString(16)
      ];
      for (var i = 0; i < rgb.length; ++i){
        if (rgb[i].length == 1){rgb[i] = '0' + rgb[i];}
        hex += rgb[i];
      }
      return hex;
    }
    console.error('第1引数はRGB形式で入力');
  }



let currentColor = "#f06292";

function getColor(el){
    let color = el.style.color;
    let text = document.getElementById("colour");
    text.innerHTML = rgb2hex(color);
    currentColor = rgb2hex(color);
    //console.log(rgb2hex(color));
}

  
function colorinfos() {
  colorInfo = [];
  colorSlug = ""
  let xx = eachwidth/2;
	for (let i=0; i<lednum; i++) {
    let datas = c.getImageData(eachwidth*i*scaleBy+xx,height/2,1,1)
    //console.log(datas.data[0]);

    
    let info = Array.from(datas.data);
    //xx += eachwidth;
    colorInfo.push(info); 


    let slug = "";
    for(let j=0;j<3;j++){
      let sl = adjust(colorInfo[i][j])
      slug += sl;
    }//console.log(slug);


  colorSlug += slug
	}
  console.log(colorSlug);
	//console.log(colorInfo[0]);
  //console.log(rgb2hex(colorInfo[0]))

}

function adjust(num){
  if (String(num).length==2){
    return "0"+String(num);
  }
  else if (String(num).length==1){
    return "00"+String(num);
  }else{
    return num;
  }
}




function sleep(msec) {
    return new Promise(function(resolve) {
  
       setTimeout(function() {resolve()}, msec);
  
    })
 }

async function asyncDelay(wait) {

   await sleep(wait);
   console.log("waited"+wait+'ms');
  
}
   
