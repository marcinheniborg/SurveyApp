

var page1 = document.getElementById('page1');

var canvas_element = document.createElement('canvas');
var ctx = canvas_element.getContext('2d');
canvas_element.id = 'canvas_drawing';
canvas_element.style.display = 'none';

page1.appendChild(canvas_element);
var page1Rect = page1.getBoundingClientRect();
canvas_element.width = page1Rect.width;
canvas_element.height = page1Rect.height;

ctx.lineWidth = 1;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.strokeStyle = '#00CC99';
var mouse = {x: 0, y: 0};

var btn_draw = document.getElementById('btn_draw')
btn_draw.addEventListener('change', function(ev){
    if(ev.target.checked){
        canvas_element.style.display = 'block';
    } else {
        canvas_element.style.display = 'none';
    }
})

canvas_element.addEventListener('mousedown', function(e) {
    ctx.beginPath();
    ctx.moveTo(mouse.x, mouse.y);   

    canvas_element.addEventListener('mousemove', onPaint, false);
}, false);

canvas_element.addEventListener('mouseup', function() {
    canvas_element.removeEventListener('mousemove', onPaint, false);
    
}, false);

canvas_element.addEventListener('mousemove', function(e) {
    var targetParentRect = e.target.parentElement.getBoundingClientRect();
    mouse.x = (e.pageX - targetParentRect.x - this.offsetLeft)/scale;
    mouse.y = (e.pageY - targetParentRect.y - this.offsetTop)/scale;
    console.log('parent x: ' + targetParentRect.x + 'offsetLeft: ' + this.offsetLeft)
  }, false);
 
var onPaint = function() {
    console.log('drawing')
    console.log(mouse)
    ctx.lineTo(mouse.x, mouse.y);
    ctx.stroke();
};