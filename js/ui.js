// onLoad runs when the page is loaded
function init(){
	console.log("Loading Page");

	//set convert button to disabled
	var convertBtn = document.getElementById("convertBtn");
	convertBtn.disabled = true;

	var output = document.getElementById("outputArea");
	output.style.display = "none";
}

//Button callback to start file upload and conversion
function convertCallback(){
	console.log("Button Pressed");

	//upload/convert/download file
	var file = document.getElementById("fileInput").files[0];
	if (file != ''){
		convert(file);
	}

	var output = document.getElementById("outputArea");
	output.style.display = "block";
}

//Input callback for enabling convert button
function fileCallback(file){
	console.log("File Callback");
	console.log(file);

	//only enable button if a file was chosen by user
	var convertBtn = document.getElementById("convertBtn");
	if (file == ''){
		convertBtn.disabled = true;
	}
	else {
		convertBtn.disabled = false;
	}
}