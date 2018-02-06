class CalculatorBinary{
	
	constructor(elementId) {
		this.Model = {
			totalValue : undefined, // stores value of last clicked cell
			firstNumber : undefined,
			memoryNumber : 0,
			mathFunction : undefined,
		};

		this.View = {
          // view consists of clickable cells and also a status label
			statusLabel : {id: elementId+"Label", type: "label", 
				value: ""}, 
			cells: [
				{id: "binOne", type: "button", value: "1"},
				{id: "binZero", type: "button", value: "0"},
				{id: "binPeriod", type: "button", value: "."},
				{id: "binAdd", type: "button", value: "+"},
				{id: "binMultiply", type: "button", value: "*"},
				{id: "binDivide", type: "button", value: "/"},
				{id: "binModulus", type: "button", value: "%"},
				{id: "binLeftShift", type: "button", value: "<<"},
				{id: "binRightShift", type: "button", value: ">>"},
				{id: "binAnd", type: "button", value: "&"},
				{id: "binOr", type: "button", value: "|"},
				{id: "binNot", type: "button", value: "~"},
				{id: "binEquals", type: "button", value: "="},
				{id: "binClear", type: "button", value: "C"},
			],
			container: document.getElementById(elementId)
		};
		
		this.Controller = {
			cellClickHandler : function(e){ 
				let target = e.target;
				if (target.type == "text" || target.type == "label" || target.type == undefined) return;
				let regex = /^[0-9]+$/i;
				if (target.value.match(regex) || target.value == "."){
					if (this.Model.totalValue == undefined) { 
						this.Model.totalValue = target.value;
						if(this.Model.mathFunction == undefined){
							this.Model.firstNumber = undefined;
						}
					}else{
						this.Model.totalValue += target.value;
					}
					document.getElementById(this.View.statusLabel.id).value = this.Model.totalValue;
				}else if(target.value == "+" || target.value == "*" || target.value == "/" 
								|| target.value == "%" || target.value == "&" || target.value == "|") {
					if (this.Model.firstNumber == undefined){ 
						if (this.Model.totalValue == undefined) { 
						}else{
							this.Model.firstNumber = this.Model.totalValue;
							this.Model.totalValue = undefined;
							this.Model.mathFunction = target.value;
							target.style.color = "red";
						}
					}else{
						this.Model.mathFunction = target.value;
						target.style.color = "red";
					}
				}else if(target.value == "<<" || target.value == ">>" || target.value == "~"){
					if(this.Model.totalValue == undefined){
						if(this.Model.firstNumber == undefined){
						}else{
							if(target.value == "<<"){
								this.Model.firstNumber = String(this.Model.firstNumber) + 0;
							}else if(target.value == ">>"){
								this.Model.firstNumber = String(this.Model.firstNumber).slice(0, -1);
								if(String(this.Model.firstNumber).charAt(String(this.Model.firstNumber).length - 1) == "."){
									this.Model.firstNumber = String(this.Model.firstNumber).slice(0, -1);
								}
							}else{
								this.Model.firstNumber = binaryNot(this.Model.firstNumber);
							}
						}
					}else{
						if(target.value == "<<"){
							this.Model.firstNumber = String(this.Model.totalValue) + 0;
						}else if(target.value == ">>"){
							this.Model.firstNumber = String(this.Model.totalValue).slice(0, -1);
						}else{
							this.Model.firstNumber = binaryNot(this.Model.totalValue);
						}
					}
					this.Model.totalValue = undefined;
					document.getElementById(this.View.statusLabel.id).value = this.Model.firstNumber;
				}else if(target.value == "="){
					if(this.Model.firstNumber == undefined){
						if(this.Model.totalValue == undefined){
						}else{
							this.Model.firstNumber = numberToBinary(binaryToNumber(this.Model.totalValue));
							this.Model.totalValue = undefined;
						}
					}else if (this.Model.totalValue == undefined || this.Model.mathFunction == undefined){ 
						//do nothing
					}else{
						switch(this.Model.mathFunction){
							case "+":
								this.Model.totalValue = numberToBinary(binaryToNumber(this.Model.firstNumber) +  binaryToNumber(this.Model.totalValue));
								break;
							case "*":
								this.Model.totalValue = numberToBinary(binaryToNumber(this.Model.firstNumber) *  binaryToNumber(this.Model.totalValue));
								break;
							case "/":
								this.Model.totalValue = numberToBinary(binaryToNumber(this.Model.firstNumber) /  binaryToNumber(this.Model.totalValue));
								break; 
							case "%":
								this.Model.totalValue = numberToBinary(binaryToNumber(this.Model.firstNumber) %  binaryToNumber(this.Model.totalValue));
								break; 
							case "&":
								this.Model.totalValue = binaryAnd(this.Model.firstNumber, this.Model.totalValue);
								break; 
							case "|":
								this.Model.totalValue = binaryOr(this.Model.firstNumber, this.Model.totalValue);
								break; 
							default:
								break;
						}
						this.Model.mathFunction = undefined;
						this.Model.firstNumber = this.Model.totalValue;
						this.Model.totalValue = undefined;
						document.getElementById(this.View.statusLabel.id).value = this.Model.firstNumber;
						this.resetButtonColors();
					}
				}
				switch(target.value){
					case "C":
						this.Model.totalValue = undefined;
						this.Model.firstNumber = undefined;
						this.Model.mathFunction = undefined;
						document.getElementById(this.View.statusLabel.id).value = "";
						this.resetButtonColors();
						break;
					case "MR":
						this.Model.firstNumber = this.Model.memoryNumber;
						document.getElementById(this.View.statusLabel.id).value = this.Model.firstNumber;
						break;
					case "M-":
						if(this.Model.firstNumber == undefined){
							if(this.Model.totalValue == undefined){
							}else{
								this.Model.memoryNumber = Number(this.Model.memoryNumber) - Number(this.Model.totalValue);
								this.Model.firstNumber = this.Model.totalValue
								this.Model.totalValue = undefined;
							}
						}else{
							this.Model.memoryNumber = Number(this.Model.memoryNumber) - Number(this.Model.firstNumber);
						}
						break;
					case "M+":
						if(this.Model.firstNumber == undefined){
							if(this.Model.totalValue == undefined){
							}else{
								this.Model.memoryNumber = Number(this.Model.memoryNumber) + Number(this.Model.totalValue);
								this.Model.firstNumber = this.Model.totalValue
								this.Model.totalValue = undefined;
							}
						}else{
							this.Model.memoryNumber = Number(this.Model.memoryNumber) + Number(this.Model.firstNumber);
						}
						break;
					case "MC":
						this.Model.memoryNumber = "0";
						break;
					default:
						break;
				}
			}
		};
		
		this.attachCellHandlers();
		let htmlString = this.createHTMLforView();
		console.log(htmlString);
		this.View.container.innerHTML = htmlString; // render on browser
		return this;
	}  //end of constructor
	
	attachCellHandlers() {
		this.View.container.onclick 
			= this.Controller.cellClickHandler.bind(this);
	}
	
	resetButtonColors() {
		document.getElementById("binAdd").style.color = "blue";
		document.getElementById("binMultiply").style.color = "blue";
		document.getElementById("binDivide").style.color = "blue";
		document.getElementById("binLeftShift").style.color = "blue";
		document.getElementById("binRightShift").style.color = "blue";
		document.getElementById("binModulus").style.color = "blue";
		document.getElementById("binAnd").style.color = "blue";
		document.getElementById("binOr").style.color = "blue";
		document.getElementById("binNot").style.color = "blue";
	}
	
	createHTMLforView() {
		var s;
		s = "<table id=\"myTable\" border=2>"
		s += "<tr><td colspan=\"4\">";
		s += this.createHTMLforElement(this.View.statusLabel); 
		s += "</td></tr>";
		let that = this;
		// this loops over each button and adds the html for it
		this.View.cells.forEach( function(cell, i) {
			if ( i%4==0 ){
				s += "<tr>";
			}
			s += "<td>";
			console.log(cell)
			s += that.createHTMLforElement(cell); 
			s += "</td>";
			if ( i%4==3 ){
				s += "</tr>";
			}
		})

		// adds the html for the statusLabel
		s += "</table>";
		return s;
	}

  // createHTMLforElement
  // Utility. Creates html formatted text for a element
	createHTMLforElement(element) {
		let s = "<input ";
		s += " id=\"" + element.id + "\"";
		s += " type=\"" + element.type + "\"";
		s += " value= \"" + element.value + "\"";
		if (element.type == "button" || element.type == "label") {
			s += " style=\"color:blue\"";
		}
		else {
			s += " style=\"color:red\"";
		}
		s += "/>";
		return s;
	}
	
}

function binaryToNumber(binary) {
	var atSplit = String(binary).split('.');
	var output = 0;
	var Binary = [];
	var i = 0;
	var binaryString = String(atSplit[0]);
	for(i = binaryString.length - 1; i >= 0; i--){
		Binary.push(binaryString.charAt(i));
	}
	for(i = 0; i < Binary.length; i++){
		output = Number(output) + (Binary[i] * Math.pow(2, i));
	}
	if (atSplit.length == 2){
		binaryString = String(atSplit[1]);
		var afterPeriod = 0;
		for(i = 0; i < binaryString.length; i++){
			afterPeriod = Number(afterPeriod) + (Number(binaryString.charAt(i)) * Math.pow(2, 0-(i+1)));
		}
		output = Number(output) + Number(afterPeriod);
	}
	return Number(output);
}

function numberToBinary(number) {
	debugger;
	var atSplit = String(number).split('.');
	var Binary = [];
	var i;
	var output = "";
	var binaryAfterDecimal;
	var numberBeforeDecimal = Number(atSplit[0]);
	var numberAfterDecimal;
	while (numberBeforeDecimal > 0){
		Binary.push(Number(numberBeforeDecimal%2));
		numberBeforeDecimal = Math.floor(numberBeforeDecimal/2);
	}
	for(i = Binary.length - 1; i >= 0; i--){
		output += Binary[i];
	}
	if(atSplit.length == 2){
		output = String(output) + ".";
		numberAfterDecimal = Number("." + atSplit[1]);
		while (numberAfterDecimal > 0){
			numberAfterDecimal = numberAfterDecimal * 2;
			var atSplit2 = String(numberAfterDecimal).split('.');
			if(numberAfterDecimal >= 1){
				output = String(output) + "1";
			}else{
				output = String(output) + "0";
			}
			if(numberAfterDecimal == 1){
				numberAfterDecimal = 0;
			}else{
				numberAfterDecimal = Number("." + atSplit2[1]);
			}
		}
		
	}
	return output;
}

function binaryAnd(binary1, binary2) {
	var atSplit1 = String(binary1).split('.');
	var atSplit2 = String(binary2).split('.');
	var output = "";
	var Binary1 = [];
	var Binary2 = [];
	var Binary = [];
	var loopLength = 0;
	var i = 0;
	var binaryString1 = String(atSplit1[0]);
	var binaryString2 = String(atSplit2[0]);
	for(i = binaryString1.length - 1; i >= 0; i--){
		Binary1.push(binaryString1.charAt(i));
	}
	for(i = binaryString2.length - 1; i >= 0; i--){
		Binary2.push(binaryString2.charAt(i));
	}
	if(Binary1.length > Binary2.length){
		loopLength = Binary2.length;
	}else{
		loopLength = Binary1.length;
	}
	for(i = 0; i < loopLength; i++){
		if(Binary1[i] == 1 && Binary2[i] == 1){
			Binary.push(1);
		}else{
			Binary.push(0);
		}
	}
	for(i = Binary.length - 1; i >= 0; i--){
		output = String(output) + String(Binary[i]);
	}
	if(atSplit1.length == 2 && atSplit2.length == 2){	
		output = String(output) + ".";	
		var temp1, temp2;
		if(atSplit1.length == 2){
			temp1 = atSplit1[1];
		}else{
			temp1 = "0";
		}
		if(atSplit2.length == 2){
			temp2 = atSplit2[1];
		}else{
			temp2 = "0";
		}
		if(temp1.length > temp2.length){
			loopLength = temp2.length;
		}else{
			loopLength = temp1.length;
		}
		for(i = 0; i < loopLength; i++){
			if(temp1.charAt(i) == 1 && temp2.charAt(i) == 1){
				output = String(output) + "1";
			}else{
				output = String(output) + "0";
			}
		}
	}
	return output;
}

function binaryOr(binary1, binary2) {
	var atSplit1 = String(binary1).split('.');
	var atSplit2 = String(binary2).split('.');
	var output = "";
	var Binary1 = [];
	var Binary2 = [];
	var Binary = [];
	var loopLength = 0;
	var i = 0;
	var binaryString1 = String(atSplit1[0]);
	var binaryString2 = String(atSplit2[0]);
	for(i = binaryString1.length - 1; i >= 0; i--){
		Binary1.push(binaryString1.charAt(i));
	}
	for(i = binaryString2.length - 1; i >= 0; i--){
		Binary2.push(binaryString2.charAt(i));
	}
	if(Binary1.length < Binary2.length){
		loopLength = Binary2.length;
	}else{
		loopLength = Binary1.length;
	}
	for(i = 0; i < loopLength; i++){
		if(Binary1[i] == 1 || Binary2[i] == 1){
			Binary.push(1);
		}else{
			Binary.push(0);
		}
	}
	for(i = Binary.length - 1; i >= 0; i--){
		output = String(output) + String(Binary[i]);
	}
	if(atSplit1.length == 2 || atSplit2.length == 2){	
		output = String(output) + ".";	
		var temp1, temp2;
		if(atSplit1.length == 2){
			temp1 = atSplit1[1];
		}else{
			temp1 = "0";
		}
		if(atSplit2.length == 2){
			temp2 = atSplit2[1];
		}else{
			temp2 = "0";
		}
		if(temp1.length < temp2.length){
			loopLength = temp2.length;
		}else{
			loopLength = temp1.length;
		}
		for(i = 0; i < loopLength; i++){
			if(temp1.charAt(i) == 1 || temp2.charAt(i) == 1){
				output = String(output) + "1";
			}else{
				output = String(output) + "0";
			}
		}
	}
	return output;
}

function binaryNot(binary) {
	debugger;
	var output = "";
	var Binary = [];
	var i = 0;
	var binaryString = String(binary);
	for(i = 0; i < binaryString.length; i++){
		Binary.push(binaryString.charAt(i));
	}
	for(i = 0; i < Binary.length; i++){
		if(Binary[i] == 1){
			output = String(output) + 0;
		}else if(Binary[i] == 0){
			output = String(output) + 1;
		}else{
			output = String(output) + String(Binary[i]);
		}
	}
	return output;
}