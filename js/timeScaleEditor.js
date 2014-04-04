function generateOriginalTimeScale(numDivs){
	var timescale = document.getElementById("timescale");
	var i = 0;
	var counter= 0;
	for(i = 0; i < numDivs; i++){
		timescale.innerHTML+="<div class='timeSegment'></div>";
	}
}

function generateOriginalTimeNumbering(numDivs){
	var timescale = document.getElementById("timenumbering");
	var i = 0;
	var counter = 0;
	var adder = "";
	for(i = 0; i < numDivs; i++){
		if(i%20==0||i==(numDivs-1)){
			adder=counter;
			counter++;
		}
		timescale.innerHTML+="<div class='timeNumber'>"+adder+"</div>";
		adder="";
	}
}