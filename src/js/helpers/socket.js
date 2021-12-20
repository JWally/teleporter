
class Socket extends SimpleEvents{

	#socket = {};
	#connectionData = {
		"myId": "",
		"theirId": ""
	};
	
    // ////////////////////////////////
    //
    // ////////////////////////////////
	constructor(){
		
        // S.O.P
        super();
        var that = this;
		
		
		// Instantiante a WebSocket
		that.#socket = new WebSocket("wss://0lo7gya2i1.execute-api.us-east-1.amazonaws.com/dev");

		// Find out who we are...
		that.#socket.onopen = ((data) => {
			that.#socket.send(JSON.stringify({"action": "x-message","type": "identify"}));
		});
		
		// Generic Message Handling Method
		that.#socket.onmessage = ((data) => {
			that.#socketMessageHandler(data);
		})
		
	}

    // ////////////////////////////////
    // (what's my motherf*ckin' name?)
    // ////////////////////////////////
	get id(){
		return this.#connectionData.myId;
	}
	
    // ////////////////////////////////
    // Who is the idiot we're dealing with?
    // ////////////////////////////////
	get peerId(){
		return this.#connectionData.theirId;
	}
	
	
    // ////////////////////////////////
    //
    // ////////////////////////////////
    connect(peerId){
		this.#socket.send(JSON.stringify({"action": "x-message", "type": "set-connect", "body": "Hello", "to": peerId}));
	}
	
	
    // ////////////////////////////////
    //
    // ////////////////////////////////
    send(dataType, data, peerId = false){
		if(!peerId){peerId = this.peerId;}
		this.#socket.send(JSON.stringify({"action": "x-message", "type": dataType, "body": data, "to": peerId}));
	}
	
    // ////////////////////////////////
    // Generic message handler -
	// basically, we're assuming that data coming
	// down the pike has a "type" attribute which
	// tells us what it is they're sending.
	//
	// If they give us an "identify" or "set-connect"
	// message, we'll personally handle it...
	//
	// otherwise, we'll percolate it to the top as
	// an event and wash our hands of the whole affair...
    // ////////////////////////////////
	#socketMessageHandler(data){
		
		data = JSON.parse(data.data);
			
		if(!data.type){
			
		} else if(data.type == "identify"){
			this.#connectionData.myId = data.to;
			this.__broadcast("identify", data.to);
		} else if(data.type == "set-connect"){
			if(this.#connectionData.theirId == ""){
				this.#connectionData.theirId = data.from;
				this.__broadcast("set-connect", data.from);
				this.connect(this.#connectionData.theirId);
			}
		} else {
			this.__broadcast(data.type, data);
		}
		

	}
	
	
	
}