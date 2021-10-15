class Mercury extends EzCrypto {

    //
    // To Do:
    // Need a web socket
    // Need a way to generate 
    //

    //
    // HOLY SHIT! PRIVATE VARIABLES!
    // ...what a time to be alive!
    //
    #myPublicKey = "";
    #myPrivateKey = "";
    #theirPublicKey = "";
    #rtc;


    // /////////////////////////////////////////////////////////
    // Grant read-only-access to my public key
    //
    get MyPublicKey() {
        return this.#myPublicKey;
    }


    // /////////////////////////////////////////////////////////
    // Set and forget their public key
    //
    set TheirPublicKey(key) {
        var that = this;

        return window.crypto.subtle.importKey(
                "spki",
                key, {
                    "name": "RSA-OAEP",
                    "hash": "SHA-256"
                },
                true,
                ["encrypt"]
            )
            .then((data) => {
                that.#theirPublicKey = data;
            });


    }

    // /////////////////////////////////////////////////////////
    // Set Up
    // /////////////////////////////////////////////////////////
    constructor() {

        // S.O.P
        super();
        var that = this;


        //
        // CREATE PUBLIC AND PRIVATE KEYS
        //
        this.createKeys()
            .then((keys) => {
                that.#myPublicKey = keys.publicKey;
                that.#myPrivateKey = keys.privateKey;

                return window.crypto.subtle.exportKey("spki", keys.publicKey);
            })
            .then((rawKey) => {
                that.#myPublicKey = rawKey;
            })

        // Instantiate an XRTC connector
        this.#rtc = new XRTC();
    }

    // /////////////////////////////////////////////////////////
    // Encrypt Chunk
    //
    encryptChunk(chunk) {
        var that = this;

        return this.encrypt(chunk, this.#theirPublicKey)
            .then((data) => {
                return data;
            })
    }


    // /////////////////////////////////////////////////////////
    // Decrypt Chunk
    //   
    decryptChunk(chunk) {
        var that = this;

        var a = chunk.slice(0, 512);
        var b = chunk.slice(512, chunk.length);

        return this.decrypt(this.#myPrivateKey, a, b);

    }




}
