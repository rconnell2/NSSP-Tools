function NumForm(num) {
	if (num<1000000 && num>=100) {
		var rtn = num.toFixed(0);
	} else if (num<100) {
		var rtn = num.toFixed(2);
	} else {
		var rtn = num.toExponential(2).replace(/e/, 'E');
	}
	return rtn;
}

function NextScreen() {
		var a = document.getElementById("discharge").checked;
		var b = document.getElementById("marina").checked;
		var c = document.getElementById("english").checked;
		var d = document.getElementById("metric").checked;
		var lat = parseFloat(document.getElementById("lat").value);
		var lon = parseFloat(document.getElementById("lon").value);
		localStorage.setItem("discharge", a);
		localStorage.setItem("english", c);
		localStorage.setItem("lat", lat);
		localStorage.setItem("lon", lon);

		if (a && c){
			window.open("LoadCalc_Disch_Eng.html");	
		}else if (a && d){
			window.open("LoadCalc_Disch_Met.html");
		}else if(b && c) {	
			window.open("LoadCalc_Mar_Eng.html");
		}else if (b && d){
			window.open("LoadCalc_Mar_Met.html");
		}else {
			alert("You must select both a type of analysis and a unit of measure to proceed");
		}
}

function Updat() {
	NewWindow();
	Update();
	if (localStorage.getItem("discharge")) {
		LoadCalcDisch()
	} else {
		LoadCalcMar()
	}
}

function NewWindow() {
	var w = window.open("FCConcOptions.html","FC Options", "height=600, width=600");
}

function Update() {
	alert("After closing the Fecal Coliform Options window, click here to complete the calculation...");
	document.getElementById("tblLoad").style.display = "block";
	document.getElementById("lblVolNeeded").style.display = "block";
	document.getElementById("tblVol").style.display = "block";
	
	var f = localStorage.getItem("fc");
	FCConc = f;
	document.getElementById("FCtext").innerHTML = "FC Concentration = " + FCConc + " FC/100 mL";
	}

function LoadCalcDisch() {
	
	var FlowValue = parseFloat(document.getElementById("FlowRate").value);
	var FlowUnits = document.getElementById("units").value;

	if (FlowValue != null && FCConc != null && FlowUnits != null) {
		var CalcFlow = 0;

		if (localStorage.getItem("english") === "true") {
			if (FlowUnits == "cfs") {
			   flowperday = FlowValue * 60 * 60 * 24
			} else if (FlowUnits == "cfd") {
			   flowperday = FlowValue
			} else if (FlowUnits == "gpm") {
			   flowperday = FlowValue * 60 * 24 / 7.48
			} else if (FlowUnits == "gpd") {
			   flowperday = FlowValue / 7.48
			} else {
			   flowperday = FlowValue * 1000000 / 7.48     
			}
	
			window.FecalConc = parseFloat(FCConc) * 10 * 28.3;
			window.pl = flowperday * window.FecalConc;
		
			document.getElementById("DisplayLoad").innerHTML = 
				"Load = " + NumForm(flowperday) + " ft<sup>3</sup>/day x "
				+ NumForm(window.FecalConc) + " FC/ft<sup>3</sup> = "
				+ NumForm(window.pl) + " FC/day";
			document.getElementById("GetTarget").focus();
		} else {
			if (FlowUnits == "lpm") {
			   flowperday = FlowValue * 60 * 24 / 1000
			} else if (FlowUnits == "cms") {
			   flowperday = FlowValue  * 60 * 60 * 24
			} else {
			   flowperday = FlowValue    
			}
			window.FecalConc = parseFloat(FCConc) * 10 * 1000;
			window.pl = flowperday * window.FecalConc;			
			document.getElementById("DisplayLoad").innerHTML = 
				"Load = " + NumForm(flowperday) + " m<sup>3</sup>/day x "
				+ NumForm(window.FecalConc) + " FC/m<sup>3</sup> = "
				+ NumForm(window.pl) + " FC/day";
			document.getElementById("GetTarget").focus();
		}
	}
}

function LoadCalcMar() {
	
	var slips = parseFloat(document.getElementById("Slips").value);
	var slipsocc = parseFloat(document.getElementById("SlipsOcc").value);
	var ppb = parseFloat(document.getElementById("PersonsPerBoat").value);
	var boatsdisch = parseFloat(document.getElementById("BoatsDisch").value);
	
	if (slips != null && slipsocc != null && ppb != null && boatsdisch != null) {
		var CalcFlow = 0;
		window.pl = slips * ppb * slipsocc/100 * boatsdisch/100 * 2e9
	} else {
		alert("Please provide an entry to each field")
	}

	document.getElementById("DisplayLoad").innerHTML = 
		"Load = " + NumForm(slips) + " slips x "
		+ NumForm(slipsocc) + " % slips occupied x "
		+ NumForm(ppb) + " persons/boat x "
		+ NumForm(boatsdisch) + " % boats discharging x 2E+9 FC/person/day = "
		+ NumForm(window.pl) + " FC/day";

	document.getElementById("tblLoad").style.display = "block";
	document.getElementById("lblVolNeeded").style.display = "block";
	document.getElementById("tblVol").style.display = "block";

	document.getElementById("GetTarget").focus();	
}


function CalcVol() {
	let eng = localStorage.getItem("english").value;
	var TargetValue = parseFloat(document.getElementById("GetTarget").value);
	if (localStorage.getItem("english") === "true") {
		var target = TargetValue * 10 * 28.3;
		window.vol = window.pl / target;

		document.getElementById("DisplayVol").innerHTML = "Volume needed = " 
			+ NumForm(window.pl) + " FC/day ÷ "
			+ target + " FC/ft<sup>3</sup> = "
			+ NumForm(window.vol) + " ft<sup>3</sup>";
	} else {
		var target = TargetValue * 10 * 1000;
		window.vol = window.pl / target;

		document.getElementById("DisplayVol").innerHTML = "Volume needed = " 
			+ NumForm(window.pl) + " FC/day ÷ "
			+ target + " FC/m<sup>3</sup> = "
			+ NumForm(window.vol) + " m<sup>3</sup>";
	}
	
	if (localStorage.getItem("discharge") === "true") {	
		document.getElementById("DilutionAchieved").innerHTML = "Dilution Achieved = " + (window.FecalConc / target).toFixed(0) + ":1";
	}
	document.getElementById("tblVolNeeded").removeAttribute("hidden");
	document.getElementById("tblAreaFactor").removeAttribute("hidden");
	document.getElementById("lblAreaNeeded").removeAttribute("hidden");
	document.getElementById("btnCalcArea").focus();
	document.getElementById("WaterDepth").focus();
}

function CalcArea() {
	document.getElementById("tblAreaFactor").focus();
	window.Depth = parseFloat(document.getElementById("WaterDepth").value);
	window.AreaNeeded = window.vol / window.Depth;
	if (localStorage.getItem("english") === "true") {
		document.getElementById("DisplayArea").innerHTML = "Area needed = " 
			+ NumForm(window.vol) + " ft<sup>3</sup> ÷ " 
			+ window.Depth + "ft = "
		+ NumForm(window.AreaNeeded);
	} else {
		document.getElementById("DisplayArea").innerHTML = "Area needed = " 
			+ NumForm(window.vol) + " m<sup>3</sup> ÷ " 
			+ window.Depth + "m = "
		+ NumForm(window.AreaNeeded);
	}		
		
	document.getElementById("tblAreaNeeded").removeAttribute("hidden");
	document.getElementById("AreaShape").removeAttribute("hidden");
	document.getElementById("lblAreaShape").removeAttribute("hidden");
	document.getElementById("Reset").removeAttribute("hidden");
	document.getElementById("btnMap").removeAttribute("hidden");
	document.getElementById("AreaUnits").addEventListener("click",ChangeAreaUnits);
	document.getElementById("ShapeUnits").focus();
}

function ShowSideValue() {
	var a = document.getElementById("SideValue");
	var b = document.getElementById("lblSideValue");
	var c = document.getElementById("rectangle").checked;
	if (!c) {
		a.setAttribute('hidden', true);
		b.setAttribute('hidden', true);
	}else {
		a.removeAttribute('hidden');
		b.removeAttribute('hidden');
	}
}

function ChangeAreaUnits() {
	var AreaUnits = document.getElementById("AreaUnits").value;		
	if (AreaUnits == "sqft") {
		var NewUnits = NumForm(window.AreaNeeded);	
	} else if (AreaUnits == "acres") {
		var NewUnits = NumForm(window.AreaNeeded / 43560);
	} else if (AreaUnits == "sqmiles") {
		var NewUnits = NumForm(window.AreaNeeded / (5280)**2);
	} else if (AreaUnits == "sqm") {
		var NewUnits = NumForm(window.AreaNeeded);
	} else if (AreaUnits == "hectare") {
		var NewUnits = NumForm(window.AreaNeeded / 10000);
	} else {
		var NewUnits = NumForm(window.AreaNeeded / 1000000);
	}
	if (localStorage.getItem("english") === "true") {	
		document.getElementById("DisplayArea").innerHTML = "Area needed = " 
			+ NumForm(window.vol) + " ft<sup>3</sup> ÷ " 
			+ window.Depth + "ft = "
			+ NewUnits;
	} else {
		document.getElementById("DisplayArea").innerHTML = "Area needed = " 
			+ NumForm(window.vol) + " m<sup>3</sup> ÷ " 
			+ window.Depth + "m = "
			+ NewUnits;
	}		
}

function RadiusCalc() {
	var a = document.getElementById("circle").checked;
	var b = document.getElementById("semicircle").checked;
	var c = document.getElementById("rectangle").checked;
	var map = document.getElementById("ClosureMap");
	if (localStorage.getItem("english") === "true") {
		document.getElementById("ShapeUnits").value = "ft";
	} else {
		document.getElementById("ShapeUnits").value - "m";
	}
	if (a){
		window.Rectangle = false;
		window.Radius = (window.AreaNeeded / 3.14159) ** 0.5;
		var Rad = NumForm(window.Radius);
		window.lblRadius = "The circle radius for this closure is ";
		map.setAttribute("src", "http://localhost/NSSP/CircularClosure.jpg");
		map.removeAttribute("hidden");
		document.getElementById("txtExample").removeAttribute("hidden");
	}else if (b){
		window.Rectangle = false;
		window.Radius = (2 * window.AreaNeeded / 3.14159) ** 0.5;
		var Rad = NumForm(window.Radius);
		window.lblRadius = "Semi-circle radius for this closure is ";
		map.setAttribute("src","http://localhost/NSSP/SemiCircClosure.jpg");
		map.removeAttribute("hidden");
	}else if(c) {
		window.Rectangle = true;
		window.side1 = document.getElementById("SideValue").value;
		window.Radius = window.AreaNeeded / window.side1;
		var Rad = NumForm(window.side1) + " x " + NumForm(window.Radius);
		window.lblRadius = "Rectangle dimensions are ";
		map.setAttribute("src", "http://localhost/NSSP/RectangleClosure.jpg");
		map.removeAttribute("hidden");
	}else {
		alert("You must make a selection to proceed");
	}
	document.getElementById("EndMarker").focus();
	document.getElementById("txtRadius").innerHTML = window.lblRadius + Rad;
	document.getElementById("ShapeUnits").addEventListener("click",ChangeShapeUnits);
}


function ChangeShapeUnits() {
	var ShapeUnits = document.getElementById("ShapeUnits").value;
	if (localStorage.getItem("english") === "true") {		
		if (window.Rectangle) {
			if (ShapeUnits == "ft") {
				Rad = NumForm(window.Side1) + " x " + NumForm(window.Radius);	
			} else if (ShapeUnits == "yds") {
				Rad = NumForm(window.Side1 / 3) + " x " + NumForm(window.Radius / 3);	
			} else {
				Rad = NumForm(window.Side1 / 5280) + " x " + NumForm(window.Radius / 5280);	
			}
		} else {
			if (ShapeUnits == "ft") {
				Rad = NumForm(window.Radius);	
			} else if (ShapeUnits == "yds") {
				Rad = NumForm(window.Radius / 3);
			} else {
				Rad = NumForm(window.Radius / 5280);
			}
		}
	} else {
		if (window.Rectangle) {
			if (ShapeUnits == "m") {
				Rad = NumForm(window.Side1) + " x " + NumForm(window.Radius);	
			} else {
				Rad = NumForm(window.Side1 / 1000) + " x " + NumForm(window.Radius / 1000);		
			}
		} else {
			if (ShapeUnits == "m") {
				Rad = NumForm(window.Radius);	
			} else {
				Rad = NumForm(window.Radius / 1000);
			}
		}		
	}
		document.getElementById("txtRadius").innerHTML = window.lblRadius + Rad;
}

function MapCreate() {

	if (localStorage.getItem("english") === "true") {
		var radius = window.Radius * 0.3048;
	} else {
		var radius = window.Radius;
	}
	localStorage.setItem("radius", radius);
	
	var w = window.open("Map.html","Closure Area", "height=600, width=600")
}

function CloseMe() {
		var w = window.close('','_parent','');
}

function OpenHelp() {
	var w = window.open("Help_Main.html","Help", "height=600, width=600");
}