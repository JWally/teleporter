// //////////////////////////////////////////
//
// Class of static methods to help encrypt and decrypt files
// In a secure manner that everyone has access to...
//
// //////////////////////////////////////////
class EzCrypto {

// ......................................
// ......................................
// FORCE DOWNLOAD TEXT
// ......................................
// ......................................
    static forceDownload(filename, data){
        var blob = new Blob([data]);

        var link = document.createElement("a");
        link.setAttribute("href", window.URL.createObjectURL(blob));
        link.setAttribute("download", filename);
        link.click();
        URL.revokeObjectURL(link.href);
    }
    
// ......................................
// ......................................
// FORCE DOWNLOAD ARRAY-BUFFER
// ......................................
// ......................................
    static forceDownloadBuffer(filename, data){
        
        // data = new Uint8Array(data);
        
        return new Promise((rr,rj) => {
            
            const chunkSize = 16384;
            var chunkCount = Math.ceil(data.byteLength / chunkSize);
            var fileObj = [];
            
            for(var i = 0; i < chunkCount; i++){
                fileObj.push(data.slice(i*chunkSize, (i+1) * chunkSize));
            }
            
            var blob = new Blob(fileObj);
            
            var link = document.createElement("a");
            link.setAttribute("href", window.URL.createObjectURL(blob));
            link.setAttribute("download", filename);

            link.click();
            
            rr(true);

        /*
            //
            // instatiate a new filestream
            var fs = new streamSaver.createWriteStream(filename);

            //
            // Get a writer to write to 
            var w = fs.getWriter();
            
            //
            // Pump...
            // ...and Dump!
            //
            w.write(data)
            .then((x) => {
                w.close();
            })
            //
            // Complete the promise
            //
            .then(() =>{
                rr(true);
            })
        */
        
            
        })
    }


// ......................................
// ......................................
// CREATE PUBLIC AND PRIVATE KEYS - RSA
// ......................................
// ......................................
    static createKeys(){
    
        console.log("creating keys");
    
        let that = this;
    
        window.crypto.subtle.generateKey({
                "name": "RSA-OAEP","modulusLength": 4096,"publicExponent": new Uint8Array([1, 0, 1]),
                "hash": "SHA-256",
            },
            true,
            ["encrypt", "decrypt"]
        ).then((keyPair) => {
            // Private Key
            window.crypto.subtle.exportKey("jwk",keyPair.privateKey)
                .then((x) => {that.forceDownload("key.private.json",JSON.stringify(x));});
            // Public Key
            window.crypto.subtle.exportKey("jwk",keyPair.publicKey)
                .then((x) => {
                    that.forceDownload("key.public.json",JSON.stringify(x));
                });
        });
    }
    
// ......................................
// ......................................
// CREATE SYM KEY, ENCRYPT DATA, PK-ENCRYPT SYM KEY...SIMPLE!
// ......................................
// ......................................
    static encrypt(message, publicKey, file_name) {

        // YUCK!
        let that = this;
        let encryptionKey;
        let cipherText;
        let lookup;
        
        //
        // Force Message to be Array Buffer
        //
        if(typeof message !== "object"){
            throw new Error("Message must be an arraybuffer");
        }


        let retObj = {};

        //
        // STEP 1:) GENERATE A SYMETRIC KEY
        // --------------------------------
        //          n.b. this is what will be used to encrypt
        //          your file. 
        //
        //          This key will later be encrypted with the RSA-Public Key
        //
        return window.crypto.subtle.generateKey(
                {"name": "AES-GCM","length": 256},
                true, ["encrypt", "decrypt"]
        )
        //
        // STEP 2:) ENCRYPT DATA WITH SYM KEY
        // -----------------------------------
        //          n.b. we're also storing the key, nonce (iv), and data
        //          on an object called retObj so we can work with it
        //          from call to call (I'm sorry :-(
        //
        .then((key) => {
            
            // Store our symetric key here:
            retObj.key = key;

            // The iv must never be reused with a given key.
            retObj.nonce = window.crypto.getRandomValues(new Uint8Array(16));
                
            return window.crypto.subtle.encrypt({"name": "AES-GCM","iv": retObj.nonce},retObj.key, message);
        })
        //
        // STEP 3:) FORCE USER TO DOWNLOAD THE ENCRYPTED FILE
        // --------------------------------------------------
        .then((encryptedFile) => {
            return that.forceDownloadBuffer(file_name + ".encrypted", encryptedFile);
        })
        //
        // STEP 4:) EXTRACT OUR KEY FOR LATER USE
        //
        .then(() => {
            return window.crypto.subtle.exportKey("raw", retObj.key)
        })
        //
        // STEP 5.) STORE NONCE AND KEY ON `retObj`
        //          also
        //          OPEN UP THE PUBLIC KEY SO WE CAN USES IT!
        //
        .then((data) => {

            retObj.nonce = Array.from(retObj.nonce);

            retObj.key = Array.from(new Uint8Array(data));
            
            publicKey = new TextDecoder().decode(publicKey);
            publicKey = JSON.parse(publicKey);
        
        
            return window.crypto.subtle.importKey(
                "jwk", publicKey,
                {"name": "RSA-OAEP","hash": "SHA-256"},true,
                ["encrypt"]
            );
            
        })
        //
        // STEP 6.) ENCRYPT THE SYM-KEY WITH THE PUBLIC KEY
        //
        .then((key) => {         
            return window.crypto.subtle.encrypt(
                {"name": "RSA-OAEP"},key,
                new TextEncoder().encode(JSON.stringify(retObj))
            );
        })
        //
        // STEP 7.) FORCE DOWNLOAD OF RSA ENCRYPTED SYMETRIC KEY
        //
        .then((encrypted_key) => {
            console.log("DONE");
            return that.forceDownloadBuffer(file_name + ".encrypted.key", encrypted_key);
        })
        .catch((e) => {
            console.log(e);
        })
    }


// ......................................
// ......................................
// USING AN RSA PRIVATE KEY, DECRYPT A SYM KEY
// THEN DECRYPT AN ENCRYPTED FILE...
//
// .. (TODO: BREAK UP INTO SMALLER PARTS, NO?) 
// ......................................
// ......................................

    static decrypt(privateKey, fileKey, encryptedFile, fileName){
        
        // YUCK!
        let that = this;
        let retObj = {};
        let symkey = "";
        

    //
    //
    // STEP 1.) CONVERT OUR PRIVATE KEY TO SOMETHING THE BROWSER WILL USE
    //
    //
        console.log(1);
        window.crypto.subtle.importKey(
            "jwk", JSON.parse(new TextDecoder().decode(privateKey)),
            {"name": "RSA-OAEP", "hash": "SHA-256",},
            true,["decrypt"]
        )
    //
    //
    // STEP 2.) DECRYPT THE FILE KEY WITH OUR PRIVATE KEY
    //
        .then((livePrivateKey) => {
            console.log(2);
            return window.crypto.subtle.decrypt({"name": "RSA-OAEP"}, livePrivateKey, fileKey);
        })
    //
    //
    // STEP 3.) The SymKey is a JSON Object that has a key and nonce on it
    //          --
    //          Parse it, Store it, then convert the Key to a CryptKey
    //          
    //          
    //
        .then((symkey) => {
            console.log(3);
            retObj.fileKey = JSON.parse(new TextDecoder().decode(symkey));
            retObj.fileKey.key = new Uint8Array((retObj.fileKey.key));
            retObj.fileKey.nonce = new Uint8Array((retObj.fileKey.nonce));
            
            return window.crypto.subtle.importKey(
                "raw", 
                retObj.fileKey.key.buffer,
                "AES-GCM", 
                true,
                ["decrypt"]
            );
        })
    //
    //
    // STEP 4.) DECRYPT THE ENCRYPTED FILE WITH THE SYM-KEY
    //
    //
        .then((data) => {
            console.log(4);
            return window.crypto.subtle.decrypt(
                {"name": "AES-GCM","iv": retObj.fileKey.nonce},
                data,
                encryptedFile
            );
        })
    //
    //
    // STEP 5.) FORCE DOWNLOAD OF DECRYPTED FILE
    //
    //
        .then((decrypted_file) => {
            console.log(4);
            return that.forceDownloadBuffer("decrypted." + fileName, decrypted_file);
        })
        
        // Step 4.) 
        //
        .catch((e) => {
            console.log(e);
        })
    }




}