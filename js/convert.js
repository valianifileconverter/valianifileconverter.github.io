//main function for file conversion
//controls uploading/reading, converting/parsing, and creating download file
function convert(file){
	console.log("Converting");
	console.log(file);

	//read in file selected by user
	var data;
	readFileContent(file).then(content => {
		data = content;
		//console.log(data);

		//add in conversion logic
		data = parsePlt(data);

		//creat downloadable file
		createFile(data,file.name, "text/plain");
	}).catch(error => console.log(error));
}

//read file as text. Returns promise to be run in main function
function readFileContent(file) {
	const reader = new FileReader();
	return new Promise((resolve, reject) => {
		reader.onload = event => resolve(event.target.result)
		reader.onerror = error => reject(error)
		reader.readAsText(file)
	});
}

function createFile(data, filename, type) {
	//Create text file
	var file = new Blob([data], {type: type});

	//add ".val" to file name
	var arr = filename.split(".");
	var ID;
	var n = 0;
	filename = arr[0];
	for (var i = 1; i < arr.length; i++){
		if (i == arr.length-1){
			ID = filename;
			var repeat = document.getElementById(ID);
			while (repeat){
				n++;
				ID = filename + "(" + n.toString() + ")";
				repeat = document.getElementById(ID);
			}
			filename = ID;
			filename += ".val";
		}
		filename += "." + arr[i];
	}

	//Create list item with link
	var li = document.createElement("li"),
		a = document.createElement("a"),
		url = URL.createObjectURL(file),
		delBtn = document.createElement("button");
		downloadBtn = document.createElement("a");
		downloadIcon = document.createElement("div");
		clip = document.createElement("div");

	//create link
	a.href = url;
	a.download = filename;
	a.appendChild(document.createTextNode(filename));
	a.className += "output";
	a.id = ID;

	//create buttons
	delBtn.className += "output";
	delBtn.className += " delete";
	delBtn.appendChild(document.createTextNode("X"));
	if (delBtn.addEventListener) {// For all major browsers, except IE 8 and earlier
		delBtn.addEventListener("click", deleteCallback);
	} else if (delBtn.attachEvent) {// For IE 8 and earlier versions
		delBtn.attachEvent("onclick", deleteCallback);
	}

	downloadBtn.href = url;
	downloadBtn.download = filename;
	downloadBtn.className += "output";
	downloadBtn.className += " download";
	clip.className += "output clip";
	downloadIcon.appendChild(document.createTextNode("\u2913"));
	downloadIcon.className += "output";
	downloadIcon.className += " download";
	clip.appendChild(downloadIcon);
	downloadBtn.appendChild(clip);

	//add to list item
	li.appendChild(a);
	li.appendChild(delBtn);
	li.appendChild(downloadBtn);
	li.className += "output";

	//add file to list
	var list = document.getElementById("outputList");
	list.appendChild(li);
}

function parsePlt(data){
	arr = data.split(";");
	//console.log(arr.length);
	//console.log(arr[0]);
	var str = "";
	//console.log(typeof data);
	if (arr[0].toUpperCase().indexOf("IN") == -1){
		return str;
	}
	str += arr[0] + ";";
	var cmd,
		spFlag = true, //SP1 and SP0 flags
		ltFlag = true, //LT flag
		headerFlag = true, //VS flag
		check = true; //before first PU flag
	var i;
	for (i = 1; i < arr.length; i++){
		//make sure command matches correct format
		cmd = arr[i].toUpperCase();
		if (cmd.length > 0){
			if (cmd.charAt(0) != "\n"){
				cmd = "\n" + cmd;
			}
		}
		if (cmd.length > 1){
			cmd += ";";
		}
		cmd = cmd.replace(",", " ");

		//Add extra lines if necessary
		if (check && spFlag && cmd.indexOf("SP") != -1){
			spFlag = false;
		}
		if (check && ltFlag && cmd.indexOf("LT") != -1){
			ltFlag = false;
		}
		if (check && headerFlag){
			if (cmd.indexOf("VS") != -1){
				headerFlag = false;
			}
			if (!(spFlag && ltFlag)){ //make sure header comes before any SP or LT commands
				cmd = valHeader() + cmd;
				headerFlag = false;
			}
		}

		if (cmd.indexOf("PU") != -1){
			if (ltFlag){
				cmd = "\nLT;" + cmd;
			}
			if (check){
				if (spFlag){
					cmd = "\nSP1;" + cmd;
				}
				if (headerFlag){
					cmd = valHeader() + cmd;
				}
				check = false;
			}
			if (spFlag && i > arr.length-3){
				cmd = "\nSP0;";
			}
		}

		str += cmd;
	}
	return str;
}

function valHeader(){
	return	"\nVS32,1;" +
			"\nVS32,2;" +
			"\nVS32,3;" +
			"\nVS32,4;" +
			"\nVS32,5;" +
			"\nVS32,6;" +
			"\nVS32,7;" +
			"\nVS32,8;" +
			"\nWU0;" +
			"\nPW0.350,1;" +
			"\nPW0.350,2;" +
			"\nPW0.350,3;" +
			"\nPW0.350,4;" +
			"\nPW0.350,5;" +
			"\nPW0.350,6;" +
			"\nPW0.350,7;" +
			"\nPW0.350,8;";
}

function deleteCallback() {
	var li = this.parentNode;
	var ol = li.parentNode;
	ol.removeChild(li);
	if (ol.children.length < 1) {
		var output = document.getElementById("outputArea");
		output.style.display = "none";
	}
}

function downloadCallback(url) {
	console.log(url);
	window.location=url;
}

/*
//Copied from StackOverflow (Use as reference only)
function download(data, filename, type) {
	var file = new Blob([data], {type: type});
	if (window.navigator.msSaveOrOpenBlob) {// IE10+
		window.navigator.msSaveOrOpenBlob(file, filename);
	}
	else { // Others
		var a = document.createElement("a"),
			url = URL.createObjectURL(file);
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		setTimeout(function() {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);  
		}, 0); 
	}
}*/