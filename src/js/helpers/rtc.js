class XRTC extends SimpleEvents{
	
	sendChannel = {};
	talkChannel = {};
	
	#connection = {};
	#ices = [];
	#receiveChannel = {};
	
	#iceConfig = {
	  "username": "8526094e3c8e21ec011898f5afe3988c553017ff9ca6c3a988e9309c2202c89c",
	  "iceServers": [
		{
		  "url": "stun:global.stun.twilio.com:3478?transport=udp",
		  "urls": "stun:global.stun.twilio.com:3478?transport=udp"
		},
		{
		  "url": "turn:global.turn.twilio.com:3478?transport=udp",
		  "username": "8526094e3c8e21ec011898f5afe3988c553017ff9ca6c3a988e9309c2202c89c",
		  "urls": "turn:global.turn.twilio.com:3478?transport=udp",
		  "credential": "LAFsceIcaOXWUSH6U3QrOaQIZr5l7mlWQlfktbw2xLw="
		},
		{
		  "url": "turn:global.turn.twilio.com:3478?transport=tcp",
		  "username": "8526094e3c8e21ec011898f5afe3988c553017ff9ca6c3a988e9309c2202c89c",
		  "urls": "turn:global.turn.twilio.com:3478?transport=tcp",
		  "credential": "LAFsceIcaOXWUSH6U3QrOaQIZr5l7mlWQlfktbw2xLw="
		},
		{
		  "url": "turn:global.turn.twilio.com:443?transport=tcp",
		  "username": "8526094e3c8e21ec011898f5afe3988c553017ff9ca6c3a988e9309c2202c89c",
		  "urls": "turn:global.turn.twilio.com:443?transport=tcp",
		  "credential": "LAFsceIcaOXWUSH6U3QrOaQIZr5l7mlWQlfktbw2xLw="
		}
	  ],
	  "date_updated": "Sat, 23 Oct 2021 13:58:03 +0000",
	  "account_sid": "AC220e6ea3ea76ee9c824aea6f736884e5",
	  "ttl": "86400",
	  "date_created": "Sat, 23 Oct 2021 13:58:03 +0000",
	  "password": "LAFsceIcaOXWUSH6U3QrOaQIZr5l7mlWQlfktbw2xLw="
	}
    
    // ////////////////////////////////
    // 
    // ////////////////////////////////
    constructor(name = null){
        
        // S.O.P
        super();
        var that = this;
		
        // 1.) Create a new connection
        that.#connection = new RTCPeerConnection(that.#iceConfig);

        // 2.) When the connection barfs up new ice-candidates;
        //      put them on the class level array to handle them later
        that.#connection.onicecandidate = async function(evt){
            if(evt.candidate != null){
				// log that we got ice
				console.log("ICE", evt);
				// store our ice
                that.#ices.push(evt.candidate.toJSON());
				// percolate our ice
				that.__broadcast("onicecandidate", evt.candidate.toJSON())
            }
        }
        
        // 3.) When our connection is given a data-channel
        //      we need to store it and add some methods to
        //      it
        that.#connection.ondatachannel = ((evt) => {
            that.#receiveChannel = evt.channel;
            that.#receiveChannel.onmessage = ((e) => {that.__broadcast("onmessage", e);console.log(e)})
            that.#receiveChannel.onopen = ((e) => {that.__broadcast("onopen", e); console.log(e,"OPEN")})
            that.#receiveChannel.onclose = ((e) => {that.__broadcast("onclose", e);console.log(e,"CLOSED")})
        })

        //
        // 4.) Create new channels on which to send things
        //
        that.sendChannel = that.#connection.createDataChannel("send-data-channel");
        that.talkChannel = that.#connection.createDataChannel("talk-data-channel");
        //
        // 
        //
    
    }
    
    // ////////////////////////////////
    //
    // ////////////////////////////////
    start(){
        
        var that = this;
        
        return new Promise((res, rej) => {
           
            that.#connection.createOffer()
                .then((offer) => {
                    console.log("OFFER ===>");
					console.log(offer);
					
					if(offer.toJSON){
						that.offer = offer.toJSON();
					} else {
						that.offer = {"type": "offer"};
						that.offer.sdp = (offer.sdp);
						console.log(offer.sdp);
					}
                    return that.#connection.setLocalDescription(offer);
                })
                .then(() => {
                    res(btoa(JSON.stringify(that.offer)));
                })
                .catch((e) => {
                    rej(e)
                });
        });
    }
    
    // ////////////////////////////////
    //
    // ////////////////////////////////
    setRemote(msg){
        
        var that = this;
		
		msg = msg.body;
		msg = JSON.parse(atob(msg));

        
        return new Promise((res, rej) => {
            
            //
            // This is the SDP part of the string
            //
            var desc = new RTCSessionDescription(msg);
            
            that.#connection.setRemoteDescription(desc)
                .then(() => {
                    if(!that.#connection.localDescription){
                        return that.#connection.createAnswer();
                    } else {
                        return true;
                    }
                })
                .then((answer) => {
                    if(!that.#connection.localDescription){
                        return that.#connection.setLocalDescription(answer);
                    } else {
                        return true;
                    }
                })
                .then(() => {
                    res(btoa(JSON.stringify(that.#connection.localDescription.toJSON())));
                })
                .catch((e) => {
                    rej(e)
                });
        });
    }
    
    // ////////////////////////////////
    //
    // ////////////////////////////////
    setIce(data){
        var that = this;        
		var a = JSON.parse(atob(data));
//		var a = JSON.parse(data);

		console.log("SET ICE",a);
		
		//
		// Hopefully they gave us an array of promises,
		//		base64-encoded
		//
		// todo: error handlin'
		//
		return Promise.all(a.map(ice => {
			return new Promise((s,j) => {
				console.log(x);
				//
				// Reuse, Confuse, and Re-Cycle!
				//
				ice = new RTCIceCandidate(ice);
				
				return that.#connection
					.addIceCandidate(ice)
					.then(s(true))
					.catch(j(false));
				
			});
		}));
    }
	
    // ////////////////////////////////
    //
    // ////////////////////////////////
    // Quick / Dirty function to convert our array of ice-candidates
	// into a base64 encoded JSON
	get ice(){
        return btoa(JSON.stringify(this.#ices));
    }
    
}