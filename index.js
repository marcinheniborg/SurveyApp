/* var mapObjectsMenuDiv = document.getElementById('mapObjectsMenuDiv');
var contentDiv = document.getElementById('content');
var  page1Div = document.getElementById('page1Div');*/

//populate the map with elements from data
function app(){
    this.menuDivID = 'mapObjectsMenu';
    this.contentDivID = 'content';
    this.page1DivID = 'page1';
    this.menuDiv = document.getElementById(this.menuDivID);
    this.contentDiv = document.getElementById(this.contentDivID);
    this.page1Div = document.getElementById(this.page1DivID);
    this.mapObjects = {};
    this.appendMapObjects = function(mapObjects){
        this.mapObjects = mapObjects;
    }
    this.dialogBox = new dialogBox();
}


function mapObject(name, mapNumber, type, locationRect, tech_details, notes, status){
    this.name = name;
    this.type = type;
    this.locationRect = locationRect;
    this.tech_details = tech_details;
    this.notes = notes;
    this.status = status;
    this.onMap = false;
    this.width = 0;
    this.height = 0;
    this.mapNumber = mapNumber;
    this.DOM = null;
}

mapObject.prototype.setLocation = function(locationRect,app){
    if(locationRect.parentID == ''){
        this.locationRect.parentDiv = document.getElementById(app.menuDivID);
    } else {
        this.locationRect.parentDiv = document.getElementById(locationRect.parentID);
    }
    this.locationRect.left = locationRect.left =! undefined ? locationRect.left : this.locationRect.left;
    this.locationRect.top = locationRect.top =! undefined ? locationRect.top : this.locationRect.top;
    this.locationRect.width = locationRect.width =! undefined ? locationRect.width : this.locationRect.width;
    this.locationRect.height = locationRect.height =! undefined ? locationRect.height : this.locationRect.height;
}

mapObject.prototype.setLocationValues = function(x,y,width,height,parentID){   
    if(parentID != '' && parentID != undefined){   
        this.locationRect.parentDiv = document.getElementById(parentID);
    } 
    this.locationRect.left = x != undefined ? x : this.locationRect.left;
    this.locationRect.top = y != undefined ? y : this.locationRect.top;
    this.locationRect.width = width != undefined ? width : this.locationRect.width;
    this.locationRect.height = height != undefined ? height : this.locationRect.height;
}

mapObject.prototype.displayInMenu = function(){
    var element = document.createElement('li');
    element.draggable = true;
    element.id = this.name;
    element.className = this.type;    
    element.textContent = this.mapNumber;    
    this.locationRect.parentDiv.appendChild(element);
    this.onMap = false;
    var mapObjectRect = element.getBoundingClientRect();
    this.locationRect.width = mapObjectRect.width;
    this.locationRect.height = mapObjectRect.height;
    this.DOM = element;
}

mapObject.prototype.displayOnMap = function(){
    var element = document.createElement('div');
    element.id = this.name;
    element.className = this.type;
    element.textContent = this.mapNumber;
    element.style.top = this.locationRect.top + 'px';
    element.style.left = this.locationRect.left + 'px';
    element.style.position = 'absolute';
    element.draggable = false;
    this.onMap = true;
    this.locationRect.parentDiv.appendChild(element);
    var elementRect = element.getBoundingClientRect()
    this.locationRect.width = elementRect.width;
    this.locationRect.height = elementRect.height; 
    console.log(this.locationRect)
    this.DOM = element;   
}

mapObject.prototype.moveToMap=function(x,y,app){
    this.DOM.remove();
    var targetParentRect = app.page1Div.getBoundingClientRect();    
    var new_x = (x - targetParentRect.x - this.locationRect.width/2)/scale;
    var new_y = (y - targetParentRect.y - this.locationRect.height/2)/scale;
    var location = {
        parentID: app.page1DivID,
        left: new_x,
        top: new_y,
        width: this.width,
        height: this.height
    }
    //console.log(location)
    this.setLocation(location);
    this.displayOnMap();
}

mapObject.prototype.moveOnMap = function(x,y){
    if(this.onMap){
        //console.log(this)
        var targetParentRect = this.locationRect.parentDiv.getBoundingClientRect();
        var x_new = (x - targetParentRect.x - this.locationRect.width/2)/scale;
        var y_new = (y - targetParentRect.y - this.locationRect.height/2)/scale;
        this.setLocationValues(x_new, y_new);
        this.DOM.draggable = false;
        this.DOM.style.left = x_new +'px';
        this.DOM.style.top = y_new + 'px'
    }   
}

function mapObjects(){
    this.count = 0;
    this.elements = {};
    this.updatedElements = new Set();
}

mapObjects.prototype.addObject = function(mapObject){
    this[mapObject.name] = mapObject;
    this.elements[mapObject.name] = this[mapObject.name];
}

mapObjects.prototype.bringElementOnTop = function(id){
    //console.log(this.elements)
    for(var key in this.elements){
        if(this.elements[key].onMap){
            this.elements[key].DOM.style.zIndex = "1";
        }
    }
    this.elements[id].DOM.style.zIndex = "2";
}

mapObjects.prototype.saveNewValues = function(){
    for (let id of this.updatedElements) {
       console.log('values updated: ' + id);
    }
}

function dialogBox(){
    this.dialogBoxID = 'detailsDialog';
    this.dialogOverlayID = 'details_dialog_overlay';
    this.dialogBoxHeaderID = 'detailsDialogHeader'
    this.equipmentTypeID = 'equipment_type';
    this.equipmentDetailsID = 'equipment_details';
    this.equipmentStatusID = 'equipment_status';
    this.equipmentNotesID = 'equipment_notes';
    
    this.dialogBoxDiv = document.getElementById(this.dialogBoxID);
    this.dialogOverlay = document.getElementById(this.dialogOverlayID);
    this.dialogBoxHeader = document.getElementById(this.dialogBoxHeaderID);
    this.equipmentType = document.getElementById(this.equipmentTypeID);
    this.equipmentDetails = document.getElementById(this.equipmentDetailsID);
    this.equipmentStatus = document.getElementById(this.equipmentStatusID);
    this.equipmentNotes = document.getElementById(this.equipmentNotesID);

    this.dialogBoxParentEquipmentID = '';
}

dialogBox.prototype.displayOnMap = function(x,y){    
    this.dialogBoxDiv.style.left = x;
    this.dialogBoxDiv.style.top = y;
    this.dialogOverlay.style.display = "block";
}

dialogBox.prototype.hideFromMap = function(){
    this.dialogOverlay.style.display = "none";
}

dialogBox.prototype.fillUpValues = function(mapObjectID){
    var mapObject = mapObjects[mapObjectID];
    this.dialogBoxHeader.innerHTML = `<p>${mapObject.name}</p>`;
    this.equipmentType.value = mapObject.type;
    this.equipmentDetails.value = mapObject.tech_details;
    this.equipmentStatus.value = mapObject.status;
    this.equipmentNotes.value = mapObject.notes;
    this.dialogBoxParentEquipmentID = mapObjectID;
}



var app = new app();
var mapObjects = new mapObjects();
app.appendMapObjects(mapObjects);

for(let key in data){
    console.log('...adding ' + data[key].name)
    let mapObject1 = new mapObject(data[key].name, data[key].mapNumber, data[key].type, data[key].location, data[key].tech_details, data[key].notes,  data[key].status);
    mapObject1.setLocation(data[key].location, app);
    if(mapObject1.locationRect.parentDiv.id == app.menuDivID){
        mapObject1.displayInMenu();
        console.log(' in menu');
    }else{
        mapObject1.displayOnMap();
        console.log(' on map');
    }
    mapObjects.addObject(mapObject1);
}

app.dialogBox.dialogBoxDiv.addEventListener('change', function(ev){
    console.log('changed');
    var changedControlID = ev.target.id;
    var changedControl = ev.target;
    var equipmentID = app.dialogBox.dialogBoxParentEquipmentID;
    mapObjects.updatedElements.add(equipmentID);
    switch (changedControlID) {
        case 'equipment_type':
            mapObjects[equipmentID].type = changedControl.value;
        break;

        case 'equipment_details':
            mapObjects[equipmentID].tech_details = changedControl.value;
        break;

        case 'equipment_status':
            mapObjects[equipmentID].status = changedControl.value;
        break;

        case 'equipment_notes':
            mapObjects[equipmentID].notes = changedControl.value;
        break;
    }
})

var mousePressed = false;
var clickedElementID = '';
var startedDragging = false;

//handle drag over by allowing the drag over the page
app.page1Div.addEventListener('dragover', function(event){
    console.log('dragged over')
    event.preventDefault();
})

//handle drop by adding a new div to the page and removing LI from the menu
app.page1Div.addEventListener('drop', function(ev){
    mousePressed = false;    
    if(mapObjects[clickedElementID]!=null){        
        mapObjects[clickedElementID].moveToMap(ev.pageX,ev.pageY,app);
        mapObjects.bringElementOnTop(clickedElementID);       
    }   
})

window.addEventListener('mousedown', function(ev){
    //ev.preventDefault();
    clickedElementID = ev.target.id; 
    if(clickedElementID == "details_dialog_overlay"){
        app.dialogBox.hideFromMap();
        mapObjects.saveNewValues();
    }else if(mapObjects[clickedElementID] != null) {
        mousePressed = true;    
        mapObjects.bringElementOnTop(clickedElementID);
    }
    
}, false)

window.addEventListener('mouseup', function(ev){
    mousePressed = false;
    console.log('mouseUp')
    
}, false)

document.addEventListener('mousemove', function(ev){
    e=ev || window.event;
    //pauseEvent(e);
    if(mousePressed){
        if(mapObjects[clickedElementID]!=null)
        {
            mapObjects[clickedElementID].moveOnMap(ev.pageX,ev.pageY);         
        }
    }
})

var ctrlKeyPressed = false;
document.addEventListener('keydown', function(ev){
    if (ev.ctrlKey){
        ctrlKeyPressed = true;
        console.log('ctrl pressed')
    }
})

document.addEventListener('keyup', function(){
    ctrlKeyPressed = false;
    console.log('ctrl released')
})

document.addEventListener('dblclick', function(ev){
    clickedElementID = ev.target.id;
    if(mapObjects[clickedElementID]!=null && mapObjects[clickedElementID].onMap){        
       app.dialogBox.fillUpValues(clickedElementID);
       app.dialogBox.displayOnMap(ev.pageX, ev.pageY);
    }
})

let scale = 1;
var previousMouseX = 0;
var previousMouseY = 0;
var previousOriginX = 0;
var previousOriginY = 0;
app.contentDiv.addEventListener('wheel', function(ev){
    console.log(ev.deltaY);
    ev.preventDefault();
    if(ctrlKeyPressed){
        if (previousMouseX!=ev.pageX || previousMouseY!=ev.pageY)
        {
            var page1DivRect = app.page1Div.getBoundingClientRect();
            var xorigin = (ev.pageX - page1DivRect.x)/scale;
            var yorigin = (ev.pageY - page1DivRect.y)/scale;
            //insertTestMarker(app.page1Div, xorigin, yorigin)
            previousMouseX = ev.pageX;
            previousMouseY = ev.pageY;
            app.page1Div.scrollLeft -= 100*previousOriginX - xorigin;
            app.page1Div.scrollTop -= 100*previousOriginY - yorigin;
            previousOriginX = xorigin;
            previousOriginY = xorigin;

            console.log('pageX=' + ev.pageX)
            console.log('page1DivRect.x=' + page1DivRect.x)
            app.page1Div.style.transformOrigin = xorigin + 'px ' + yorigin + 'px';
        }
        var wheel = ev.deltaY;
        var zoomIntensity = 0.1;
        var wheel = wheel < 0 ? 1 : -1;
        scale += wheel * zoomIntensity;
        //scale = Math.round((scale + zoom) * 100)/100;
        scale = Math.min(Math.max(.125, scale),4);
        console.log(app.contentDiv)
        
       
        
        console.log(app.page1Div.style.transformOrigin)
        

        app.page1Div.style.transform = `scale(${scale})`;
        
       
    }
   
})



function pauseEvent(e){
    if(e.stopPropagation) e.stopPropagation();
    if(e.preventDefault) e.preventDefault();
    e.cancelBubble=true;
    e.returnValue=false;
    return false;
}


function insertTestMarker(parentDiv, x,y){
    var testMarker = document.createElement('div');
    testMarker.style.top = y;
    testMarker.style.left = x;
    testMarker.className = 'camera';
    testMarker.style.width = '10px';
    testMarker.style.height = '10px';
    testMarker.style.position = 'absolute'
    parentDiv.appendChild(testMarker)
}
