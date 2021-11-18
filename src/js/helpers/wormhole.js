class WormHole {

	#id = "";
	#peerId = "";

    // /////////////////////////////////////////////////////////
	#keys = {
		"self": {
			"public": "",
			"private": ""
		},
		"peer": {
			"public": ""
		}
	};
	
	// ///////////////////////////////////
	// FOR TESTING ONLY!!!
	// ///////////////////////////////////
	testRTC = {};
	

	
    // /////////////////////////////////////////////////////////
	#ws = {};
	
	// /////////////////////////////////////////////////////////
	#srtc = {};
	
    // /////////////////////////////////////////////////////////
	// Get Self ID
    // /////////////////////////////////////////////////////////
	get id(){
		return this.#id;
	}
	
    // /////////////////////////////////////////////////////////
	// Get Peer Public Key
    // /////////////////////////////////////////////////////////
	get peerId(){
		return this.#peerId;
	}
	
    // /////////////////////////////////////////////////////////
	// Get My Public Key
    // /////////////////////////////////////////////////////////
	get selfPublicKey(){
		return this.#keys.self.public;
	}
	
    // /////////////////////////////////////////////////////////
	// Get Peer's Public Key
    // /////////////////////////////////////////////////////////
	get peerPublicKey(){
		return this.#keys.peer.public;
	}
	

    // /////////////////////////////////////////////////////////
    // Set and forget their public key
    // /////////////////////////////////////////////////////////
    set peerPublicKey(key) {
        var that = this;

        return window.crypto.subtle.importKey(
                "jwk",
                key, {
                    "name": "RSA-OAEP",
                    "hash": "SHA-256"
                },
                true,
                ["encrypt"]
            )
            .then((data) => {
                that.#keys.peer.public = key;
            });

    }

	// /////////////////////////////////////////////////////////
	//
	//
    // /////////////////////////////////////////////////////////
    // Set Up
    // /////////////////////////////////////////////////////////
	//
	//
	// /////////////////////////////////////////////////////////
    constructor() {
		


			// S.O.P
			// super();
			var that = this;


			//
			// CREATE PUBLIC AND PRIVATE KEYS
			//
			EzCrypto.createKeys()
				.then((keys) => {
					that.#keys.self.public = keys[1];
					that.#keys.self.private = keys[0];
				})
				
			// Set up our websocket
			that.#ws = new Socket();
			
			// Set up our XRTC Object
			that.#srtc = new SimpleRTC();
			
			
			// FOR TESTING ONLY!!!
			that.testRTC = that.#srtc;
			
			// //////
			// Get My Id
			// //////
			that.#ws.addEventListener("identify", ((data) => {
				that.#id = data.detail;
			}));
			
			// //////
			// Get Their Id
			// //////
			that.#ws.addEventListener("set-connect", ((data) => {
				
				that.#peerId = data.detail;
				
				// Send our peer our public key
				that.#ws.send("publicKey", that.selfPublicKey);
			}));
			
			// //////
			// Listen for Public Key Transfer
			// //////
			that.#ws.addEventListener("publicKey", ((data) => {
				that.#keys.peer.public = data.detail.body;
				
				// Connect the RTC objects...
				if(that.#id > that.#peerId){
					console.log(that.id, " IS STARTING RTC...");
					console.log(that.id, " IS STARTING RTC...");
					console.log(that.id, " IS STARTING RTC...");
					
					that.#srtc.createOffer()
						.then((ofr) => {
							that.#ws.send("createOffer", ofr);
						});
				}
			}));
			
			
			// ////////
			// Listen for RTC First Offer
			// ///////
			that.#ws.addEventListener("createOffer", ((data) => {
				that.#srtc.createAnswer(data.detail.body)
					.then((ans) => {
						that.#ws.send("createAnswer", ans);
					});
			}));
			
			
			// ////////
			// Listen for RTC First ANSWER
			// ///////
			that.#ws.addEventListener("createAnswer", ((data) => {
				that.#srtc.catchAnswer(data.detail.body)
			}));
			
			
			// ////////
			// Listen for RTC ICE-CANDIDATES FROM RTC
			// ///////
			that.#srtc.addEventListener("onicecandidate", ((data) => {
				that.#ws.send("onicecandidate", data.detail.candidate);
			}));
			
			// ////////
			// Listen for RTC ICE-CANDIDATES FROM WS
			// ///////
			that.#ws.addEventListener("onicecandidate", ((data) => {
				that.#srtc.addIceCandidate(data.detail.body);
			}));
			
			
			
			// ////////
			// Listen for RTC MESSAGES
			// ///////
			that.#srtc.addEventListener("onmessage", ((data) => {
				data = data.detail;
				
				console.log(data.data, data.currentTarget.label);
			}));
			


    }
	
	
    // /////////////////////////////////////////////////////////
	// Connect
    // /////////////////////////////////////////////////////////
	connect(peerId){
		var that = this;
		
		that.#keys.peer.public = peerId;
		that.#ws.connect(peerId);
	}


    // /////////////////////////////////////////////////////////
    // Encrypt Chunk
    //
    encryptChunk(chunk) {
        var that = this;
        return EzCrypto.encrypt(chunk, this.peerPublicKey)
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

        return EzCrypto.decrypt(this.#keys.self.private, a, b);

    }
	
	
    // /////////////////////////////////////////////////////////
    // Chat
    //   
	chat(data) {
		var that = this;
		that.#srtc.talkChannel.send(data);
	}
	
	sendFile(fileArrayBuffer){
		var that = this;
		
		
		
	}

}
