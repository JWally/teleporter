// //////////////////////////////////////////
//
// Class of static methods to help encrypt and decrypt files
// In a secure manner that everyone has access to...
//
// //////////////////////////////////////////
class EzCrypto extends SimpleEvents {

    // ......................................
    // ......................................
    // FORCE DOWNLOAD TEXT
    // ......................................
    // ......................................
    static forceDownload(filename, data) {
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
    static forceDownloadBuffer(filename, data) {

        // data = new Uint8Array(data);

        return new Promise((rr, rj) => {

            const chunkSize = 16384;
            var chunkCount = Math.ceil(data.byteLength / chunkSize);
            var fileObj = [];

            for (var i = 0; i < chunkCount; i++) {
                fileObj.push(data.slice(i * chunkSize, (i + 1) * chunkSize));
            }

            var blob = new Blob(fileObj);

            var link = document.createElement("a");
            link.setAttribute("href", window.URL.createObjectURL(blob));
            link.setAttribute("download", filename);

            link.click();

            rr(true);

        })
    }


    // ......................................
    // ......................................
    // CREATE PUBLIC AND PRIVATE KEYS - RSA
    // ......................................
    // ......................................
    createKeys() {
        return new Promise((res, rej) => {
            window.crypto.subtle.generateKey({
                        "name": "RSA-OAEP",
                        "modulusLength": 4096,
                        "publicExponent": new Uint8Array([1, 0, 1]),
                        "hash": "SHA-256",
                    },
                    true,
                ["encrypt", "decrypt"]
                )
                .then((data) => {
                    res(data);
                });
        });
    }

    // ......................................
    // ......................................
    // CREATE SYM KEY, ENCRYPT DATA, PK-ENCRYPT SYM KEY...SIMPLE!
    // ......................................
    // ......................................
    encrypt(message, publicKey) {

        // YUCK!
        let that = this;
        let eKey;
        let eData;
        let nonce = "";

        //
        // Force Message to be Array Buffer
        //
        if (typeof message !== "object") {
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
        return window.crypto.subtle.generateKey({
                    "name": "AES-GCM",
                    "length": 256
                },
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
                nonce = window.crypto.getRandomValues(new Uint8Array(16));

                return window.crypto.subtle.encrypt({
                    "name": "AES-GCM",
                    "iv": nonce
                }, retObj.key, message);
            })
            //
            // STEP 3:) FORCE USER TO DOWNLOAD THE ENCRYPTED FILE
            // --------------------------------------------------
            .then((encryptedFile) => {
                eData = encryptedFile;
                return true;
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

                var key = new Uint8Array(data);

                var c = new Uint8Array(nonce.length + key.length);
                c.set(nonce);
                c.set(key, nonce.length);

                return window.crypto.subtle.encrypt({
                        "name": "RSA-OAEP"
                    },
                    publicKey,
                    c.buffer
                );
            })
            //
            // STEP 7.) FORCE DOWNLOAD OF RSA ENCRYPTED SYMETRIC KEY
            //
            .then((encrypted_key) => {
                eKey = new Uint8Array(encrypted_key);
                eData = new Uint8Array(eData);
                var eTotal = new Uint8Array(eKey.length + eData.length);
                eTotal.set(eKey);
                eTotal.set(eData, eKey.length);

                return eTotal.buffer;

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

    decrypt(privateKey, fileKey, encryptedFile) {

        // YUCK!
        let that = this;
        let retObj = {};
        let symkey = "";
        let nonce = "";
        let key = "";


        //
        //
        // STEP 1.) DECRYPT THE SYM-KEY WITH *OUR* PRIVATE KEY
        //
        //
        return window.crypto.subtle.decrypt({
                "name": "RSA-OAEP"
            }, privateKey, fileKey)

            //
            //
            // STEP 3.) The SymKey is a JSON Object that has a key and nonce on it
            //          --
            //          Parse it, Store it, then convert the Key to a CryptKey
            //          
            //          
            //
            .then((symkey) => {

                nonce = symkey.slice(0, 16);
                key = symkey.slice(16, 528)

                return window.crypto.subtle.importKey(
                    "raw",
                    key,
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

                return window.crypto.subtle.decrypt({
                        "name": "AES-GCM",
                        "iv": new Uint8Array(nonce)
                    },
                    data,
                    encryptedFile
                );
            })
            //
            //
            // STEP 5.) FORCE DOWNLOAD OF DECRYPTED FILE
            //
            //
            .then((decrypted_data) => {
                return decrypted_data;
            })

            // Step 4.) 
            //
            .catch((e) => {
                console.log(e);
            })
    }
}
