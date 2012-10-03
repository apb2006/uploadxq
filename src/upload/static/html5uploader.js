/*
*	Upload files to the server using xhr.sendAsBinary
* HTML 5 Drag and drop the folders on your local computer
*
*/

if (XMLHttpRequest.prototype.sendAsBinary==null){
    //http://code.google.com/p/chromium/issues/detail?id=35705#c40
   XMLHttpRequest.prototype.sendAsBinary = function(datastr) {
    function byteValue(x) {
        return x.charCodeAt(0) & 0xff;
    }
    var ords = Array.prototype.map.call(datastr, byteValue);
    var ui8a = new Uint8Array(ords);
    this.send(ui8a.buffer);
	}
};
function uploader(place, input,status, targetXQ, show) {
	
	// Upload image files
	upload = function(file) {
	
		// Firefox 3.6, Chrome 6, WebKit
		if(window.FileReader) { 
				
			// Once the process of reading file
			this.loadEnd = function() {
				bin = reader.result;				
				xhr = new XMLHttpRequest();
				xhr.addEventListener('progress', this.uploadProgress, false);
				xhr.addEventListener('load', this.uploadComplete, false);
				xhr.addEventListener('error',this.uploadError , false);
				xhr.open('POST', targetXQ, true);
				xhr.setRequestHeader('Content-Type', 'application/octet-stream');
				xhr.setRequestHeader('UP-FILENAME', file.name);
				xhr.setRequestHeader('UP-SIZE', file.size);
				xhr.setRequestHeader('UP-TYPE', file.type);
				xhr.sendAsBinary(bin);
				
				if (show) {
					var newFile  = document.createElement('div');
					newFile.innerHTML = 'Loaded : '+file.name+' size '+file.size+' B';
					document.getElementById(show).appendChild(newFile);				
				}
				if (status) {
					document.getElementById(status).innerHTML = 'Loaded : 100%<br/>Next file ...';
				}
			}
				
			// Loading errors
			this.loadError = function(event) {
				switch(event.target.error.code) {
					case event.target.error.NOT_FOUND_ERR:
						document.getElementById(status).innerHTML = 'File not found!';
					break;
					case event.target.error.NOT_READABLE_ERR:
						document.getElementById(status).innerHTML = 'File not readable!';
					break;
					case event.target.error.ABORT_ERR:
					break; 
					default:
						document.getElementById(status).innerHTML = 'Read error.';
				}	
			}
		
			// Reading Progress
			this.loadProgress = function(event) {
				if (event.lengthComputable) {
					var percentage = Math.round((event.loaded * 100) / event.total);
					document.getElementById(status).innerHTML = 'Read : '+percentage+'%';
				}				
			}
			// upload Progress
			this.uploadComplete = function(event) {			
				document.getElementById(status).innerHTML = 'Upload complete';				
			}
			// upload error
			this.uploadError = function(event) {			
				alert("Upload error")				
			}
			// upload Progress
			this.uploadProgress = function(event) {
				if (event.lengthComputable) {
					var percentage = Math.round((event.loaded * 100) / event.total);
					document.getElementById(status).innerHTML = 'Uploaded : '+percentage+'%';
				}				
			}	
			// Preview images
			this.previewNow = function(event) {		
				bin = preview.result;
				var img = document.createElement("img"); 
				img.className = 'addedIMG';
			    img.file = file;   
			    img.src = bin;
				document.getElementById(show).appendChild(img);
			}

		reader = new FileReader();
		// Firefox 3.6, WebKit
		if(reader.addEventListener) { 
			reader.addEventListener('loadend', this.loadEnd, false);
			if (status != null) 
			{
				reader.addEventListener('error', this.loadError, false);
				reader.addEventListener('progress', this.loadProgress, false);
			}
		
		
		var preview = new FileReader(); 
		preview.addEventListener('loadend', this.previewNow, false);
		// The function that starts reading the file as a binary string
		try{
     	    reader.readAsBinaryString(file);
	     	// Preview uploaded files
	       	if (show) {
	   	     	preview.readAsDataURL(file);
	   	 	}
		}catch(err){
			document.getElementById(status).innerHTML ="Error reading: "+file
		} 
    	
		}
  		// Safari 5 does not support FileReader
		} else {
			alert("not supported on this browser")
		}				
	}

	// Function drop file
	this.drop = function(event) {
		event.preventDefault();
	 	var dt = event.dataTransfer;
	 	var files = dt.files;
	 	for (var i = 0; i<files.length; i++) {
			var file = files[i];
			upload(file);
	 	}
	}
	
	// The inclusion of the event listeners (DragOver and drop)

	this.uploadPlace =  document.getElementById(place);
	this.uploadPlace.addEventListener("dragover", function(event) {
		event.stopPropagation(); 
		event.preventDefault();
	}, true);
	this.uploadPlace.addEventListener("drop", this.drop, false);
	
	if(input){
		this.input =  document.getElementById(input);
		this.input.addEventListener("change", function(event) {
			var files = this.files;
		 	for (var i = 0; i<files.length; i++) {
				var file = files[i];
				upload(file);
		 	}
		}, true);
	};
}

	