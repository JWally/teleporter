class FileUtils{
    // ********************************
    // GET A FILE FROM THE USER WITHOUT
	// USING A FORM - AND CONVERT IT TO
	// AN ARRAY BUFFER
    // ********************************
	fileToBuffer(stream = false){
		
		var that = this;
		
		if(!stream){
			return that.getUIFile()
				.then((d) => {
					return that.readFile(d[0]);
				})
		} else {
			return that.getUIFile()
				.then((d) => {
					return d[0].stream().getReader();
				})
		}
	}
	
	
// ......................................
// ......................................
// FORCE DOWNLOAD ARRAY-BUFFER
// ......................................
// ......................................
    dataToFile(filename, data){
		
		return new Promise((rr,rj) => {
			// data = new Uint8Array(data);
			if(!(data instanceof ArrayBuffer)){
				
				data = new TextEncoder().encode(data);
				
				return rr(data);
				
			} else {
				return rr(data);
			}
		})
		.then((buffer) => {
			
			return new Promise((rr,rj) => {
				
				const chunkSize = 16384;
				var chunkCount = Math.ceil(buffer.byteLength / chunkSize);
				var fileObj = [];
				
				for(var i = 0; i < chunkCount; i++){
					fileObj.push(buffer.slice(i*chunkSize, (i+1) * chunkSize));
				}
				
				var blob = new Blob(fileObj);
				
				var link = document.createElement("a");
				link.setAttribute("href", window.URL.createObjectURL(blob));
				link.setAttribute("download", filename);

				link.click();
				
				rr(true);
				
			})

		})
        
    }
	
	
    // ********************************
    // UTITLITY TO GET FILE FROM USER 
	// WITHOUT NEEDING A UI-FORM
    // ********************************
	getUIFile(){
		
		return new Promise((res,rej) => {
			
			var el = document.createElement("input");
			el.setAttribute("type","file");
			el.setAttribute("id","synth_synth_synth");
			
			
			//
			// HOLY S*** THIS IS KIND OF COOL
			// -- Resolve the promise INSIDE
			// -- of the event function
			//
			// -- So basically we can "Promis-ify"
			// -- an event, in this case when a file
			// -- gets loaded onto our element
			//
			el.onchange = ((evt) => {
				//
				// HUGE IF TRUE!
				//			
				res(evt.path[0].files);
				
				
			});
			
			el.click();

			//
			// TEST TO SET TIMEOUT TO BLOW UP
			// IN THE DEVELOPER'S FACE AFTER 3 SECONDS
			// OF WAITING
			//
			setTimeout(() => {
				rej("HURRY UP! YOU...LAZY...F***!!!");
			},35_000);
			
		})
		

	}
	
	
	
    // ********************************
    // UTITLITY TO READ FILE AS A PROMISE
    // ********************************
    readFile(file, type = "buffer"){
        return new Promise((res, rej) => {
            const fr = new FileReader();
            fr.onerror = rej;
            
            fr.onloadend = function() {
                console.log("LOAD END");
                console.log(fr);
                res(fr.result);
            }
            
            
            if(type == "text"){
                fr.readAsText(file);
            } else if(type == "binary"){
                fr.readAsBinaryString(file);
            } else if(type == "buffer"){
                fr.readAsArrayBuffer(file)
            }
        });
    }
	
	
    // ********************************
    // ONE STOP SHOP - GZIP FILE AND SAVE
    // ********************************
	fileToFileGzip(){
		
		var inFile,
			outFile;
		
		// STEP 1.) HAVE THE USER PICK OUT A FILE
		return showOpenFilePicker().then((fil) => {
			
			// Store the in-file to 'global'
			inFile = fil[0];		
			
			// Return the promise to save the file somewhere
			return showSaveFilePicker({"suggestedName": inFile.name + ".gz"});
		})
		
		.then((fil) => {
			
			// Make the out file writable
			return fil.createWritable();
			
		})
		.then((fil) => {
			// THIS IS REALLY ALL YOU NEED TO DO TO THE "OUTFILE"
			// TO PREP IT. IT IS NOW READY TO BE WRITTEN TO AND CLOSED.
			outFile = fil;
			
			//
			// Here, because we can,
			// we're gonna pick back up where
			// we left off wrt handling the inFile
			//
			return inFile.getFile();
		})
		.then((fil) => {
			
			var tmp;
			tmp = fil.stream();
			tmp = tmp.pipeThrough(new CompressionStream('gzip'));
			
			return new Promise((s,j) => {
				
				s({inFile: tmp.getReader(), outFile: outFile});
				
			})
		})
		.then((dat) => {
			console.log("LAST PROMISE");
			
			var loop = (async (val) => {
				let result = false;

				while(!result){
					await dat.inFile.read().then(({done,value}) => {
						result = done;
						if(!done){
							return dat.outFile.write(value);
						} else {
							console.log("DONE BITCHES!!!");
							return dat.outFile.close();
						}
					})

				}

			});
			
			loop();
		})
			
	}
	
	
	
	
}