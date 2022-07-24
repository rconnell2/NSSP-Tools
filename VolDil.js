
function LoadCalc() {
	
	var FlowValue = parseFloat(document.getElementById("FlowRate").value);
	var FlowUnits = document.getElementById("units").value;

	if (FlowValue != null && FCConc != null && FlowUnits != null) {
		var CalcFlow = 0;
	
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
	var FecalConc = FCConc * 10 * 28.3;
	window.pl = flowperday * FecalConc;
	
	document.getElementById("DisplayLoad").innerHTML = "Load = " + window.pl.toExponential(2).replace(/e\+?/, ' E+') + " FC/day";
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
	document.getElementById("GetTarget").innerHTML = "Enter the Target Value for Fecal Coliform Concentration in the receiving water (typically the applicable NSSP Geometric Mean criterion):";	
}

function Updat() {
	NewWindow();
	Update();
	LoadCalc();
}

function CalcVol() {
	var TargetValue = parseFloat(document.getElementById("GetTarget").value);
	var target = TargetValue * 10 * 28.3;
	var vol = window.pl / target;

	document.getElementById("VolNeeded").innerHTML = "Volume needed = " + vol.toExponential(2).replace(/e\+?/, ' E+') + " ft <sup>3</sup>";
	
	document.getElementById("tblVolNeeded").removeAttribute("hidden");
	
}