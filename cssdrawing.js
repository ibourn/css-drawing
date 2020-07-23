
/*// TODO:
append
! allow ::before and ::after

! color => rgba and color => ! a radio button to select and switch to transparent

 Add css properties :
transformation : rotate, skew, translate...
radient linear, radial
box-shadow, display... overflow hidden... (+padding, text...)

create a "super group" in the order of registre array to allow
more than than one generic / line in the settings pannel
ex : group: margin and padding / border : style, width and color
*/




/*******************************************************************
*
* let's get all the properties we want... just push new ones
* generic name / (-)option1 / (-)option2 / (-)option3 / nbr of values / unit
* ex for border-top-left-radius 25% 25% =>
* 1 generic 3 options / values : 2, unit : %
*
*****************************************************************/
let registre = [];
registre.push(["height", [], [], [], 1, "%"]);
registre.push(["width", [], [], [], 1, "%"]);
registre.push(["margin",["top", "bottom", "left", "right"], [], [], 1, "%"]);
registre.push(["border", ["top", "bottom"], ["left", "right"], ["radius"], 2, "%"]);
registre.push(["border", ["top", "bottom", "left", "right"], ["width"], [], 1, "vw"]);
registre.push(["border", ["top", "bottom", "left", "right"], ["style"], [], 1, ""]);
registre.push(["border", ["top", "bottom", "left", "right"], ["color"], [], 1, ""]);
registre.push(["border", ["top", "bottom", "left", "right"], ["color"], [], 1, ""]);
registre.push(["background", ["color"], [], [], 1, ""]);
registre.push(["opacity", [], [], [], 1, ""]);
registre.push(["z-index", [], [], [], 1, ""]);
registre.push(["position", [], [], [], 1, ""]);


/*******************************************************************
*
* let's get all the special values we can have... just push new ones
*
*****************************************************************/
let registre_style = ["solid", "none","dotted", "dashed", "outset", "inset"];
let registre_position = ["absolute", "relative"];

/*******************************************************************
*
* Map : composed property name-> Obj : PropertyComponent
* Obj : PropertyComponent : nbr of values, unit, options (nbre of entries for the generic)
*
*****************************************************************/
let propertyMap = new Map();

function PropertyComponent(number = 0, unit, options = 0){
  this.number = number;
  this.unit = unit;
  this.options = options;
}
/*******************************************************************
*
* from registre -> populate propertyMap
*
*****************************************************************/
registre.forEach((item, i) => {
  let tab = [];

  if(item[1].length == 0){
    tab.push(item[0]);
  } else {
    for(let k = 0; k < item[1].length; k++){
      if(item[2].length == 0){
        tab.push(item[0] + "-" + item[1][k]);
      } else {
        for(let l = 0; l < item[2].length; l++){
          if(item[3].length == 0){
            tab.push(item[0] + "-" + item[1][k] + "-" + item[2][l]);
          } else {
            for(let m = 0; m < item[3].length; m++){
              tab.push(item[0] + "-" + item[1][k] + "-" + item[2][l] + "-" + item[3][m]);
            }
          }
        }
      }
    }
  }
  for(let k= 0; k < tab.length; k++){
    propertyMap.set(tab[k], new PropertyComponent(item[4], item[5], tab.length));
  }
});


/*******************************************************************
*
* Property object constructor
*
* with param name => initialise a new property with default values
* with optionnal value => initilalise with value
*
*****************************************************************/
function Property(_name, _value = 0){
  this.name = _name;
  this.number = propertyMap.get(_name).number;
  if(this.name.search("color") != -1){
    this.value = ((_value == 0) ? "#000000" : _value);
  } else if(this.name.search("style") != -1){
    this.value = (_value == 0) ? "solid" : _value;
  } else if(this.name.search("style") != -1){
    this.value = (_value == 0) ? "absolute" : _value;
  } else {
    this.value = (this.number > 1 && _value == 0) ? "0 0" : _value;
  }
  this.unit = propertyMap.get(_name).unit;
}


/*******************************************************************
*
* let's get have a stock of default shapes as base
*
* for new one : set("name", [new properties])
*
*****************************************************************/
let shapeMap = new Map();
shapeMap.set("square",
[new Property("height", 50), new Property("width", 50)]);
shapeMap.set("rectangle",
[new Property("height", 50), new Property("width", 100)]);
shapeMap.set("circle",
[new Property("height", 50), new Property("width", 50),new Property("border-top-left-radius", 50),new Property("border-bottom-left-radius", 50),new Property("border-top-right-radius", 50),new Property("border-bottom-right-radius", 50)]);
shapeMap.set("oval",
[new Property("height", 50), new Property("width", 100),new Property("border-top-left-radius", 50),new Property("border-bottom-left-radius", 50),new Property("border-top-right-radius", 50),new Property("border-bottom-right-radius", 50)]);
/*******************************************************************
*
* let's get have a set of default values
*
* for new one : push the new property
*
*****************************************************************/
let default_properties = [];
default_properties.push(new Property("position", "absolute"));
default_properties.push(new Property("opacity", 1));
default_properties.push(new Property("margin-top", 10));
default_properties.push(new Property("margin-left", 10));
default_properties.push(new Property("border-top-width", 1));
default_properties.push(new Property("border-bottom-width", 1));
default_properties.push(new Property("border-left-width", 1));
default_properties.push(new Property("border-right-width", 1));
default_properties.push(new Property("border-top-style", "solid"));
default_properties.push(new Property("border-bottom-style", "solid"));
default_properties.push(new Property("border-left-style", "solid"));
default_properties.push(new Property("border-right-style", "solid"));
/*default_properties.push(new Property("border-top-color", "#000000"));//"#000000"));
default_properties.push(new Property("border-bottom-color","#000000"));
default_properties.push(new Property("border-left-color", 0x000000));
default_properties.push(new Property("border-right-color", "0x000000"))*/default_properties.push(new Property("background-color", "#9900ff"));


/*******************************************************************
*
* create a new map for the default shape constructed with a basic shape from shapeMap and adding the default properties
* and an active shape
*
* defaultShape =  map of property name -> property object
* activeShape =  map of property name -> property object
*
*****************************************************************/
var defaultShape = new Map();
//let tempsquare = shapeMap.get("square");
shapeMap.get("square").forEach((item, i) => {
  defaultShape.set(item.name, item.value);
});
default_properties.forEach((item, i) => {
  defaultShape.set(item.name, item.value);
});

var activeShape = new Map();
for (let item of defaultShape.entries()) {
  activeShape.set(item[0], item[1]);
  console.log(item[0], item[1]);
}

/*******************************************************************
*
* listOfShape : to associate DOM ids of shapes and shapes
* Map : id -> Map(shape)
*
* listOfShapeId : to store all ids of the shapes
* Array [ids...]
*
* activeShapeIndex : index of the shape in the current context
*
*****************************************************************/
var listOfShapeId =[];
listOfShapeId.push("board_shape" + "0");   //first shape in the DOM
var activeShapeIndex = 0;


///VIRERBVIVI
//
//
///DDKLDKLKDLKLDLDLKDLKLDKLKDLKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK
/*for (let item of propertyMap.entries()){
  if(!activeShape.has(item[0])){
    let temp=new Property(item[0]);
    activeShape.set(item[0], temp.value)
  }
}*/
var listOfShape = new Map();
listOfShape.set(listOfShapeId[activeShapeIndex],activeShape);


/*******************************************************************
*
* HELPER FUNCTIONS
*
*****************************************************************/
//Change pour string plus simple comme al a retenir
/////////////////AVIRER A VIRER
function cssExtend(id, name, nbrOfVal, value, unit){
  if(nbrOfVal < 2){
    $("#"+id).css(name, value + unit );
  } else {
    let sname = name.split("_");
    let svalue = value.split(" ");
    $("#"+id).css(sname[0], (svalue[0]!=""? svalue[0] : "0") + unit + " "+ (svalue[1]!=""? svalue[1] : "0") + unit);
    console.log("j ai mis DANS CSS ", (svalue[0]!=""? svalue[0] : "0") + unit + " "+  svalue[1] + (svalue[1]!=""? unit : ""), "POUR",sname[0] );
  }
}
/////////////////AVIRER A VIRER
/////////////////AVIRER A VIRER
/////////////////AVIRER A VIRER
function setValExtend(id, nbrOfVal, value){
  if(nbrOfVal < 2){
    $("#" + id).val(value);
  } else {
    let svalue = value.split(" ");
    $("#"+ id + "_1").val(svalue[0]!="" && svalue[0]!= undefined? svalue[0] : "0");
    $("#"+ id + "_2").val(svalue[1]!="" && svalue[1]!= undefined? svalue[1] : "0");
    console.log("j ai mis DANS SETTINGS ",  (svalue[0]), svalue[1],"#"+ id + "_2","#"+ id + "_1" );
  }
}
/////////////////AVIRER A VIRER
/////////////////AVIRER A VIRER
/////////////////AVIRER A VIRER
function getValExtend(idFrom, nbrOfVal){
  if(nbrOfVal < 2){
    return $("#" + idFrom).val();
  } else {
    let idSplit = idFrom.split("_");
    let val1 = $("#"+ idSplit[0] + "_1").val();
    let val2 = $("#"+ idSplit[0] + "_2").val();
    return (val1[0]!=""? val1[0] : "0") + " " + (val2[1]!=""? val2[1] : "0");
    console.log("jE RETOURNE DE STEEINS  ", [val1, val2], "#"+ idSplit[0] + "_2" ,"#"+ idSplit[0] + "_1");
  }

}


/*******************************************************************
*
* HELPER FUNCTIONS
*
*****************************************************************/
/*******************************************************************
*
* format value from a property obj or Dom depending on the name or id
*
* param : nameTarget => name of the property (or id in the DOM without#)
* param : value => value from the property object
*
*****************************************************************/
function getValFromProp(nameTarget, value){//orSetting name
  let indOfSep = nameTarget.search("_");
  if(indOfSep == -1){
    return value;
  } else {
    console.log(value,"DEDANS",(""+value).split(" ")[nameTarget[indOfSep + 1] - 1]);
    return (""+value).split(" ")[nameTarget[indOfSep + 1] - 1];
  }
}
/*******************************************************************
*
* format value from settings pannel depending on the nameTarget
*
* param : nameTarget => setting id without #
*
*****************************************************************/function getValFromSettings(nameTarget){//orSetting name
//  let indOfSep = nameTarget.search("_");
if(propertyMap.get(nameTarget).number < 2){
  return $("#" + nameTarget).val();
} else {
  //  let name = nameTarget.split(" ")[0];
  let val ="";
  for(let i = 1; i <= propertyMap.get(nameTarget).number; i++){
    val += $("#" + nameTarget + "_" + i).val() + (i < propertyMap.get(nameTarget).number ? " " : "")  ;
  }
  return val;
}
}
/*******************************************************************
*
* set value in setting from a property format depending in the name
*
* param : nameTarget => name of the property (or id in the DOM without#)
* param : value => value from the property object
*
*****************************************************************/
function setValFromProp(nameTarget, value){
  let opacityAdapt = (nameTarget == "opacity") ? 100 : 1;

  if(propertyMap.get(nameTarget).number < 2){
    $("#" + nameTarget).val(value * opacityAdapt);
  } else {
    for(let i = 1; i <= propertyMap.get(nameTarget).number; i++){
      $("#" + nameTarget + "_" + i).val((""+value).split(" ")[i - 1]);
    }
  }
}
/*******************************************************************
*
* set css depending on the name (if id or property as many values
* (as radius) => loop to set css for all value of the property)
*
* param : nameTarget => name of the property (or id in the DOM without#)
* param : value => value from the property object
*
*****************************************************************/
function setCSSfromProp(idTarget, name, value, unit){
  if(propertyMap.get(name).number < 2){
    $("#"+ idTarget).css(name, "" + value + unit);
    console.log("DE FOCNTION","#"+ idTarget,name, "" + (name, "" + value + unit));
  } else {
    let val = "";
    for(let i = 1; i <= propertyMap.get(name).number; i++){
      let iVal = ((""+value).split(" ")[i - 1]);
      val += (iVal > 0 ? iVal + unit + " " : "");
    }
    $("#"+ idTarget).css(name, "" + (val != "" ? val : 0));
    console.log("DE FOCNTION","#"+ idTarget,name, "" + (val != "" ? val : 0));
  }

}


/*******************************************************************
*
* Create and append the settings pannel from the propertyMap
*
*****************************************************************/
function drawSettings(){
  let domSettingsElements = "";
  let countOptions = 0;
  let maxOptions = 0;

  let prop, propVal, propId;
  for (let item of propertyMap.entries()) {
    let nbreMaxOfVal = (item[1].number ? item[1].number : 1);

    let isDefault = activeShape.has(item[0]);
    if(isDefault){
      propVal = activeShape.get(item[0]);

      setCSSfromProp(listOfShapeId[activeShapeIndex], item[0], propVal, item[1].unit);
      console.log(listOfShapeId[activeShapeIndex], item[0], propVal, item[1].unit);

    } else {
      let temp = new Property(item[0]);
      propVal = temp.value;
    }
    //A FAIRE PLUS TARD AVEC TEST NBR DE VALEURS
  //  propVal = prop.value;

    let firstDomElements = "";
    let lastDomElements = "";
    let domElements = "";
    /************************
    *
    * if there's many option for a generic : creat a toggle div

    ***********************/
    if(item[1].options > 1){

      if(countOptions == 0){

        countOptions = 1;
        maxOptions = item[1].options;
        let decomposedName = item[0].split("-");
        let genericName = decomposedName[0] + ((decomposedName.length > 2) ? "_" + decomposedName[decomposedName.length -1] : "");


        firstDomElements = createDivToggle(0, genericName);

      } else if(countOptions == maxOptions-1 ){

        countOptions = 0;
        maxOptions = 0;
        lastDomElements = createDivToggle(1);
      }else {
        countOptions += 1;
      }

    }

    /*******************************************************************
    *
    * create blocks : div form-group > label > input or select
    *
    *****************************************************************/
    for(let i = 1; i <= nbreMaxOfVal; i++){
      console.log(propId,propVal, "ICI");
      propId = (nbreMaxOfVal > 1) ? item[0] + "_" + i : item[0];
      let iop = propVal;
      console.log(propId,propVal, "ICI 2r avant");
      let domVal = getValFromProp(propId, propVal);
console.log(propId,propVal, "ICI");
      if(item[0].search("color") != -1){
        domElements += createDivFormGroup(0, "form-group-row", "color");
        domElements += createLabelForm(propId, "form-label-col", "");
        domElements += createInput(propId, domVal, "", "color");
      } else if(item[0].search("style") != -1){
        domElements += createDivFormGroup(0, "form-group-row", "style");
        domElements += createLabelForm(propId, "form-label-col", "");
        domElements += createSelect(propId, domVal, "", registre_style, isDefault);
      } else if(item[0].search("position") != -1){
        domElements += createDivFormGroup(0, "form-group-row", "position");
        domElements += createLabelForm(propId, "form-label-col", "");
        domElements += createSelect(propId, domVal, "", registre_position, isDefault);
      }else {
        domVal = (item[0].search("opacity") != -1) ? 100 * domVal : domVal;

        domElements += createDivFormGroup(0, "form-group-row", "value");
        domElements += createLabelForm(propId, "", "");
        domElements += createInput(propId, domVal, "", "range");
      }
      domElements += createDivFormGroup(1);
      console.log(propId,domVal, "ICI FIN");
    }

    domSettingsElements += firstDomElements + domElements + lastDomElements;

  }

  /*******************************************************************
  *
  * append to div with class .setting
  *
  *****************************************************************/
  $(".setting").append(domSettingsElements);

    $("#active-shape").append("<option id=\"context-shape\"" + activeShapeIndex + " selected>" + listOfShapeId[activeShapeIndex] + "</option>");
}

/*******************************************************************
*
* create toogle  div
*
* param : step => opening or closing (0 1)
* param : value => idName : id to associate with
*
*****************************************************************/
function createDivToggle(step, idName){
  if(step == 0){
    return  "<p><a class=\"btn btn-outline-primary btn-sm btn-block\" data-toggle=\"collapse\" href=\"#" + idName + "\" role=\"button\" aria-expanded=\"false\" aria-controls=\"" + idName + "\">" + idName + "</a></p><div class=\"collapse\" id=\"" + idName + "\">";
  } else {
    return "</div>";
  }
}
/*******************************************************************
*
* create form group  div
*
* param : step => opening or closing (0 1)
* param : classBootstrap => to adjust with bootsrap class
* param : classProp => the property
*
*****************************************************************/
function createDivFormGroup(step, classBootstrap, classProp){
  if(step == 0){
    return  "<div class=\"card card-body" + " "+  classBootstrap + " "+ classProp + "\">";
  } else {
    return "</div>";
  }
}
/*******************************************************************
*
* create  label
*
* param : idName => its id
* param : classBootstrap => to adjust with bootsrap class
* param : classPosition => to adjust layout
*
*****************************************************************/
function createLabelForm(idName, classBootstrap, classPosition){
  return  "<label for=\"" + idName + "\" class=\"" + classBootstrap + " " + classPosition + "\">" + idName + "</label>";
}
/*******************************************************************
*
* create  input
*
* param : idName => its id
* param : initial value
* param : type (color, range...)
* param : classPosition => to adjust layout
*
*****************************************************************/
function createInput(idName, value, classPosition, type){
  return  "<input type=\"" + type + "\" class=\"form-control-" + type + " " + classPosition + "\" id=\"" + idName + "\" name=\"" + idName + "\" value=\"" + value + "\">";
}
/*******************************************************************
*
* create  select
*
* param : idName => its id
* param : initial value
* param : valRegister : array of optionnal values
* param : classPosition => to adjust layout
*
*****************************************************************/
function createSelect(idName, value, classPosition, valRegister, isDefault){
  let select = "<select id=\"" + idName + "\" class=\"form-control-col" + classPosition + "\">";

  for(let i = 0; i < valRegister.length; i++){
    select += "<option " + (((isDefault && (valRegister[i] == value))  || (!isDefault && (i == 0))) ? "selected" : "") +">" + valRegister[i] + "</option>";
  }
  return select + "</select>";
}




/*******************************************************************
*
* MAIN PROCESS WHEN DOC IS LOADED
*
*****************************************************************/

$(document).ready(function(){


  var units = "%";
  /*******************************************************************
  *
  * set (from user choice) the default unit and redraw the grid
  *
  * TODO : allow to rebuild all the properties, shapes...
  *****************************************************************/
  $("#general-unit").change(function(){
    units = $("#general-unit").val();
    drawGrid();
  });
  /*******************************************************************
  *
  * set the setting of the bacgkround grid
  *
  *****************************************************************/
  $("#grid-space").change(function(){
    drawGrid();
  });
  /*******************************************************************
  *
  * Redraw the background grid
  *
  *
  *****************************************************************/
  function drawGrid(){
    let val = $("#grid-space").val();

    $("#boardOfShapes").css("background-size",
    "" + val + units + " " + val + units + ", " +
    "" + val + units + " " + val + units + ", " +
    "" + (10 * val) + units + " " + (10 * val) + units + ", " +
    "" + (10 * val) + units + " " + (10 * val) + units);
  }
  /*******************************************************************
  *
  * creation of a new shape to display
  *
  * param : the id of the old (current) shape
  *
  *store the current shape in listOfShape via a copy
  * then clear activeShape and load defaultShape with the user selection (square, circle...)
  *
  * then create the new id => store it in listOfShapeId
  * and store the new shape in listOfShape
  *****************************************************************/
  function createNewShape(oldId){

    console.log("DEBUT CREAT",activeShape);
    console.log(listOfShape);
    let copy = new Map();
    for (let item of activeShape.entries()) {
      copy.set(item[0], item[1]);
    }
    listOfShape.set(listOfShapeId[activeShapeIndex],copy);


    activeShape.clear();
    shapeMap.get($("#basic-shape").val()).forEach((item, i) => {
      activeShape.set(item.name, item.value);
    });
    default_properties.forEach((item, i) => {
      activeShape.set(item.name, item.value);
    });

    /*activeShape.clear();
    for (let item of defaultShape.entries()) {
      activeShape.set(item[0], item[1]);
    }*/
    activeShapeIndex = listOfShapeId.length;
    let newId = "board_shape" + activeShapeIndex;
    listOfShapeId.push(newId);
  /*  copy.clear();
    for (let item of activeShape.entries()) {
      copy.set(item[0], item[1]);
    }
    listOfShape.set(listOfShapeId[activeShapeIndex],copy);
*/
    /*******************************************************************
    *
    * find where to append the shape (parent block or last id if we want
    * a child div
    *
    *****************************************************************/
    let choice = $("#how").val();
    let parent = "#boardOfShapes";
    if(choice == "just a new one"){
      parent = "#boardOfShapes";
    }else if(choice == "child of active"){
      parent = "#" + listOfShapeId[activeShapeIndex-1];
    }

    $(parent).append("<div id=\"" + newId +
    "\" style=\"position:absolute;\" >shape2</div>");

    /*******************************************************************
    *
    * loop in propertyMap, if defaultShape (the new activeShape) has a value
    * set the value in settings and set the css of the shape otherwise set
    * a default value from property object
    *
    *****************************************************************/
    for (let item of propertyMap.entries()) {
      let opacityAdapt = (item[0] == "opacity") ? 100 : 1;
      if(activeShape.has(item[0])){
        let val = activeShape.get(item[0]);
        if(item[0]=="opacity"){
          $("#opacity").val(val*100);
        } else {
          setValFromProp(item[0], val);
        }


        setCSSfromProp(newId, item[0], val, item[1].unit);
      } else {
        let temp = new Property(item[0]);
        setValFromProp(item[0], temp.value);
      }
    }
    /*******************************************************************
    *
    * append the new id in the list of shape
    *
    *****************************************************************/
    $("#active-shape").append("<option id=\"context-shape\"" + activeShapeIndex + " selected>" + listOfShapeId[activeShapeIndex] + "</option>");
    console.log("FIN CREAT",activeShape);
    console.log(listOfShape);

  }


  /*******************************************************************
  *
  * load an old shape
  *
  * param : id => id of the wanted shape
  *
  *
  *****************************************************************/
  function loadShape(){
    /*******************************************************************
    *
    * store the current shape then clear activeShape and
    * load the wanted shape from ilstOfShape
    *
    *
    *****************************************************************/
    let idWanted = $("#active-shape").val();
    console.log("FIN DEB LOAD",activeShape);
    console.log(listOfShape);

    let copy = new Map();
    for (let item of activeShape.entries()) {
      copy.set(item[0], item[1]);
    }
    listOfShape.set(listOfShapeId[activeShapeIndex],copy);

    activeShapeIndex = idWanted[idWanted.length-1];
    activeShape.clear();
    for (let item of (listOfShape.get(listOfShapeId[activeShapeIndex])).entries()) {
      activeShape.set(item[0], item[1]);
    }
    /*******************************************************************
    *
    * pass in the property map to get all the property name and set
    * setting pannel and css of the shape
    *
    * if the property of the shape is set we take it else we take a default value
    *
    *****************************************************************/
    console.log("FIN LOAD",activeShape);
    console.log(listOfShape);
    for (let item of propertyMap.entries()) {

      if(activeShape.has(item[0])){
        let val = activeShape.get(item[0]);

        setValFromProp(item[0], val);
        console.log(item[0], val);
        setCSSfromProp(idWanted, item[0], val, item[1].unit );

      } else {
        let temp = new Property(item[0]);
        setValFromProp(item[0], temp.value);
      }
    }
  }


  /*******************************************************************
  *
  * function linked to setting changes
  * for each change in settings => set the css of the current shape
  *
  * param :item : a property from popertyMap
  *
  *****************************************************************/
  function actionFromSettingChange(item){

    let idTarget = "board_shape" + activeShapeIndex;

    if(item[0].search("style") != -1){
      let selection = $("#" + item[0]).val();
      $("#"+idTarget).css(item[0], selection + item[1].unit );
      activeShape.set(item[0], selection);
    } else if(item[0] == "opacity"){
      br_h = $("#" + item[0]).val() / 100;
      $("#"+idTarget).css(item[0], br_h + item[1].unit );
      activeShape.set(item[0], br_h);
    } else {

      let val = getValFromSettings(item[0]);
      setCSSfromProp(idTarget, item[0], val, item[1].unit );
      activeShape.set(item[0], val);
    }
    let copy = new Map();
    for (let copyItem of activeShape.entries()) {
      copy.set(copyItem[0], copyItem[1]);
    }
    console.log("FIN CHANGT",activeShape);
    console.log(listOfShape);
    listOfShape.set(listOfShapeId[activeShapeIndex],copy);

  }
  /*******************************************************************
  *
  * bind an actionFromSettingChange function to change event
  *
  * iterate each setting element via its dom
  * and pass the dom id of the used shape
  *
  *****************************************************************/
  function bindChange(){
    for (let item of propertyMap.entries()) {

      if(item[1].number > 1 ){
        for(let i = 1; i <= item[1].number; i++){
          $("#"+item[0] +"_" + i).change(function(){
            actionFromSettingChange(item);
          });

        }
      }  else {
        $("#"+item[0]).change(function(){
          actionFromSettingChange(item);
        });
      }
    }
  }

  //DRAW THE PANNEL SETTING
  drawSettings();
  ///??append plus necessaire
  //appendSettings(listOfShapeId[activeShapeIndex]);

  //ASSOCIATE A FUNCTION TO EACH SETTING CHANGE
  bindChange();

  //CREATE A NEW SHAPE
  $("#newShape").click(function(){
    createNewShape(listOfShapeId[activeShapeIndex]);
  });
  //LOAD ANOTHER  SHAPE
  $("#active-shape").change(function(){
    loadShape();
  });

  //LOAD A DEFAULT  SHAPE
/*  $("#basic-shape").change(function(){
    defaultShape = new Map();
    let tempsquare = shapeMap.get($("#basic-shape").val());
    tempsquare.forEach((item, i) => {
      defaultShape.set(item.name, item);
    });
    default_properties.forEach((item, i) => {
      defaultShape.set(item.name, item);
    });
    for (let item of defaultShape.entries()) {
      activeShape.set(item[0], item[1]);
    }

    loadSettings(listOfShapeId[activeShapeIndex]);
  });*/


});
