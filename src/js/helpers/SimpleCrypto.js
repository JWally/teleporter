/*
Before we start getting too cute, let's simplify...
What do we need to be able to do?

- Create a pair of RSA Keys

- Convert a key to ArrayBuffer for transport
- Import a key from ArrayBuffer

- Convert a file into a key
- Export a key to a file

- RSA Encrypt
- RSA Decrypt


*/













class SimpleCrypto extends FileUtils{
	
	
	
// ......................................
// ......................................
// CREATE PUBLIC AND PRIVATE KEYS - RSA
// ......................................
// ......................................
//
// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey
//
    createKeys(){
    
        console.log("creating keys");
   
        return window.crypto.subtle.generateKey({
                "name": "RSA-OAEP",
				"modulusLength": 4096,
				"publicExponent": new Uint8Array([1, 0, 1]),
                "hash": "SHA-256"
            },
            true,["encrypt", "decrypt"]
        ).then((keyPair) => {
			return keyPair;
        })
		.catch((e) => {
			console.log(e);
			return e;
		});
		
    }
	
	
// ......................................
// ......................................
// EXPORT A SINGLE KEY INTO AN ARRAY BUFFER
// ......................................
// ......................................
//
	keyToBuffer(key, keyType){
		
		if(keyType === "public"){
			return window.crypto.subtle.exportKey("spki",key);
		} else if(keyType === "private"){
			return window.crypto.subtle.exportKey("pkcs8",key);
		} else {
			return new Promise((res, rej) => {
				rej("YOU MUST SELECT PUBLIC OR PRIVATE...");
			})
		}
		
	}
	
	
// ......................................
// ......................................
// CONVERT A BUFFER INTO A KEY
// ......................................
// ......................................
//
	bufferToKey(key, keyType){

		
		if(keyType === "public"){
			return window.crypto.subtle.importKey("spki",key,{"name": "RSA-OAEP","hash": "SHA-256"},true,["encrypt"]);			
		} else if(keyType === "private"){
			return window.crypto.subtle.importKey("pkcs8",key, {"name": "RSA-OAEP", "hash": "SHA-256"}, true, ["decrypt"]);
		} else {
			return new Promise((res, rej) => {
				rej("YOU MUST SELECT PUBLIC OR PRIVATE...");
			})
		}
		
	}
	
	
// ......................................
// ......................................
// CONVERT AN *EXPORTED* KEY (aka buffer) TO TEXT
// ......................................
// ......................................
//
	keyBufferToText(buf, keyType){
		
		return new Promise((s,j) => {
			if(keyType !== "public" && keyType !== "private"){
				return j("YOU MUST SELECT PUBLIC OR PRIVATE FOR KEY TYPE");
			}
			
			// Convert ArrayBuffer to base64 String
			var output = String.fromCharCode.apply(null, new Uint8Array(buf));
			output = btoa(output);
			
			output = output.match(/.{1,70}/g).join(`\n`);
			
			if(keyType === "private"){
				return s(`-----BEGIN RSA PRIVATE KEY-----\n${output}\n-----END RSA PRIVATE KEY-----`);
			} else {
				return s(`-----BEGIN PUBLIC KEY-----\n${output}\n-----END PUBLIC KEY-----`);
			}
			
		})
	}
	
	
// ......................................
// ......................................
// CONVERT FILE TEXT DATA TO AN EXPORTED KEY
// ......................................
// ......................................
//
	textToKeyBuffer(txt, keyType){
		
		
		//
		// Need to handle if we're catching
		// An array buffer from FileHandler
		// ...
		//
		if(txt instanceof ArrayBuffer){
			txt = new TextDecoder().decode(txt);
		}
	

		//
		// WHAT WE'VE GOT HERE IS...
		// FAILURE...TO...COMMUNICATE
		//
		//
		txt = txt.replaceAll("\n","").match(/([a-zA-Z0-9+\/]={0,3}){15,}/)[0]
		console.log(txt);
		
		return new Promise((s,j) => {
			return s(
				Uint8Array.from(atob(txt), c => c.charCodeAt(0)).buffer
			);
		});
	}
	
// ......................................
// ......................................
// CREATE AND DOWNLOAD KEYS
// ......................................
// ......................................
	keysToFiles(){
		var that = this;
		var retKeys = {};
		
		return that.createKeys().then((keys) => {
			//
			// Store the keys AS keys here
			// and pass them out of this promise chain
			// so we can use them if we want to later
			//
			retKeys = keys;
			
			return Promise.all([
				that.keyToBuffer(keys.privateKey,"private"),
				that.keyToBuffer(keys.publicKey, "public")
			])
		})
		.then((d) => {
			return Promise.all([
				that.keyBufferToText(d[0],"private"),
				that.keyBufferToText(d[1],"public")
			]);
		})
		.then((d) => {
			return Promise.all([
				that.dataToFile("private.pem",d[0]),
				that.dataToFile("public.pem",d[1])
			]);
		})
		.then((d) => {
			return new Promise((s,j) => {
				return s(retKeys);
			})
		})
	}
	
	
// ......................................
// ......................................
// LOAD A KEY FROM A TEXT FILE
// ......................................
// ......................................
	keyFromTextFile(keyType){
		var that = this;
		
		return that.fileToBuffer()
			.then((b) => {
				console.log(0,b);
				return that.textToKeyBuffer(b,keyType);
			})
			.then((b) => {
				console.log(1,b);
				return that.bufferToKey(b, keyType);
			})
		
	}

// ......................................
// ......................................
// ENCRYPTION - KISS
// ......................................
// ......................................
	encrypt(publicKey, ary_buf){
		return window.crypto.subtle.encrypt("RSA-OAEP", publicKey, ary_buf);
	}
	
// ......................................
// ......................................
// DECRYPTION - KISS
// ......................................
// ......................................
	decrypt(privateKey, ary_buf){
		return window.crypto.subtle.decrypt("RSA-OAEP", privateKey, ary_buf);
	}
	
	
}