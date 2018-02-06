class calculator{
	
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
				{id: "seven", type: "button", value: "7"},
				{id: "eight", type: "button", value: "8"},
				{id: "nine", type: "button", value: "9"},
				{id: "add", type: "button", value: "+"},
				{id: "four", type: "button", value: "4"},
				{id: "five", type: "button", value: "5"},
				{id: "six", type: "button", value: "6"},
				{id: "subtract", type: "button", value: "-"},
				{id: "one", type: "button", value: "1"},
				{id: "two", type: "button", value: "2"},
				{id: "three", type: "button", value: "3"},
				{id: "multiply", type: "button", value: "*"},
				{id: "one", type: "button", value: "0"},
				{id: "period", type: "button", value: "."},
				{id: "equals", type: "button", value: "="},
				{id: "divide", type: "button", value: "/"},
				{id: "clear", type: "button", value: "C"},
				{id: "memRecall", type: "button", value: "MR"},
				{id: "memSubtract", type: "button", value: "M-"},
				{id: "memAdd", type: "button", value: "M+"},
				{id: "memClear", type: "button", value: "MC"}
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
				}else if(target.value == "+" || target.value == "-" || target.value == "*" || target.value == "/"){
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
				}else if(target.value == "="){
					if(this.Model.firstNumber == undefined){
						if(this.Model.totalValue == undefined){
						}else{
							this.Model.firstNumber = this.Model.totalValue;
							this.Model.totalValue = undefined;
						}
					}else if (this.Model.totalValue == undefined || this.Model.mathFunction == undefined){ 
						//do nothing
					}else{
						switch(this.Model.mathFunction){
							case "+":
								this.Model.totalValue = Number(this.Model.firstNumber) +  Number(this.Model.totalValue);
								break;
							case "-":
								this.Model.totalValue = Number(this.Model.firstNumber) - Number(this.Model.totalValue);
								break;
							case "*":
								this.Model.totalValue = Number(this.Model.firstNumber) * Number(this.Model.totalValue);
								break;
							case "/":
								this.Model.totalValue = Number(this.Model.firstNumber) / Number(this.Model.totalValue);
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
						document.getElementById("memRecall").style.color = "red";
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
						document.getElementById("memRecall").style.color = "red";
						break;
					case "MC":
						this.Model.memoryNumber = "0";
						document.getElementById("memRecall").style.color = "blue";
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
		document.getElementById("add").style.color = "blue";
		document.getElementById("subtract").style.color = "blue";
		document.getElementById("multiply").style.color = "blue";
		document.getElementById("divide").style.color = "blue";
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