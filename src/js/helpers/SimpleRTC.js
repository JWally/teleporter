class SimpleRTC extends SimpleEvents{
	
	sendChannel = {};
	talkChannel = {};
	testConnection = {};
	
	#connection = {};
	#ices = [];
	#receiveChannel = {};
	#channels = {};
	
	
//	#iceConfig = {"username": "7b2a1f9dad3719cbdba9206d701fe46d1b09525aecae8180ab6a2e4579586e45", "ice_servers": [{"url": "stun:global.stun.twilio.com:3478?transport=udp", "urls": "stun:global.stun.twilio.com:3478?transport=udp"}, {"url": "turn:global.turn.twilio.com:3478?transport=udp", "username": "7b2a1f9dad3719cbdba9206d701fe46d1b09525aecae8180ab6a2e4579586e45", "urls": "turn:global.turn.twilio.com:3478?transport=udp", "credential": "Fl6uDNzX7SXqWIejw3AKRE7I24fn0MBP+yRENdIOj5U="}, {"url": "turn:global.turn.twilio.com:3478?transport=tcp", "username": "7b2a1f9dad3719cbdba9206d701fe46d1b09525aecae8180ab6a2e4579586e45", "urls": "turn:global.turn.twilio.com:3478?transport=tcp", "credential": "Fl6uDNzX7SXqWIejw3AKRE7I24fn0MBP+yRENdIOj5U="}, {"url": "turn:global.turn.twilio.com:443?transport=tcp", "username": "7b2a1f9dad3719cbdba9206d701fe46d1b09525aecae8180ab6a2e4579586e45", "urls": "turn:global.turn.twilio.com:443?transport=tcp", "credential": "Fl6uDNzX7SXqWIejw3AKRE7I24fn0MBP+yRENdIOj5U="}], "date_updated": "Fri, 05 Nov 2021 11:36:04 +0000", "account_sid": "AC220e6ea3ea76ee9c824aea6f736884e5", "ttl": "86400", "date_created": "Fri, 05 Nov 2021 11:36:04 +0000", "password": "Fl6uDNzX7SXqWIejw3AKRE7I24fn0MBP+yRENdIOj5U="}

	#iceConfig = {"iceServers": [{"urls": "stun:stun.l.google.com:19305"},{"urls": "stun:stun1.l.google.com:19305"}]}

// ////////////////////////////////////////////////////
//
// CALLER - STEP 1: CREATE OFFER
//
// ////////////////////////////////////////////////////
	constructor(){
		
		super();
		var that = this;
		this.#connection = new RTCPeerConnection(this.#iceConfig);
		that.testConnection = this.#connection;
		
		this.#connection.onicecandidate = ((data) => {
			if(data.candidate !== null){
				that.__broadcast("onicecandidate", data); 
			}
		});
		
		this.#connection.onnegotiationneeded = ((data) => {that.__broadcast("onnegotiationneeded", data); });
		this.#connection.oniceconnectionstatechange = ((data) => {that.__broadcast("oniceconnectionstatechange", data); });
		this.#connection.onicegatheringstatechange = ((data) => {that.__broadcast("onicegatheringstatechange", data); });
		this.#connection.onsignalingstatechange = ((data) => {that.__broadcast("onsignalingstatechange", data); });

        //
        // 3.) Create new channels on which to send things
        //
        that.sendChannel = that.#connection.createDataChannel("data");
        that.talkChannel = that.#connection.createDataChannel("text");
		
        // 4.) When our connection is given a data-channel
        //      we need to store it and add some methods to
        //      it
        that.#connection.ondatachannel = ((evt) => {
            that.#receiveChannel = evt.channel;
            that.#receiveChannel.onmessage = ((e) => {that.__broadcast("onmessage", e);})//console.log(e)})
            that.#receiveChannel.onopen = ((e) => {that.__broadcast("onopen", e); console.log(e,"OPEN")})
            that.#receiveChannel.onclose = ((e) => {that.__broadcast("onclose", e);console.log(e,"CLOSED")})
        });
		
		

	}
	
// ////////////////////////////////////////////////////	
//
// CALLER - STEP 1: CREATE OFFER
//
// ////////////////////////////////////////////////////
	createOffer(){
		
		var that = this;
		return this.#connection.createOffer()
			.then((ofr) => {
				return that.#connection.setLocalDescription(ofr);
			})
			.then(() => {
				return new Promise((s,j) => {
					that.__broadcast("createOffer", that.#connection.localDescription);
					s(that.#connection.localDescription);
				})
			})
	}
	
// ////////////////////////////////////////////////////	
//
// CALLEE - STEP 1: CREATE ANSWER
//
// ////////////////////////////////////////////////////
	createAnswer(offer){
		
		var that = this;
		
		var desc = new RTCSessionDescription(offer);
		
		return that.#connection.setRemoteDescription(desc)
			.then(() => {
				return that.#connection.createAnswer();
			})
			.then((answer) => {
				return that.#connection.setLocalDescription(answer);
			})
			.then(() => {
				return new Promise((s,j) => {
					that.__broadcast("createAnswer", that.#connection.localDescription);
					s(that.#connection.localDescription);
				})
			});
	}
	
// ////////////////////////////////////////////////////	
//
// CALLER - STEP 2: HANDLE ANSWER
//
// ////////////////////////////////////////////////////
	catchAnswer(answer){
		
		var that = this;
		var desc = new RTCSessionDescription(answer);
		
		return that.#connection.setRemoteDescription(answer)
			.then((data) => {
				console.log({answer: answer, data: data});
				return new Promise((s,j) => {
					that.__broadcast("catchAnswer", data);
					s(data);
				})
			})
			.catch((e) => {
				console.error("ERROR",e);
				return e;
			})
	}
	
	
// ////////////////////////////////////////////////////	
//
// OMNI - STEP 3: ADD ICE
//
// ////////////////////////////////////////////////////
	addIceCandidate(ice){
		
		var that = this;
		
		ice = new RTCIceCandidate(ice);
	
		return that.#connection.addIceCandidate(ice);
	}
}