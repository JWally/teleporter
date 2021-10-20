class XRTC{
    
    // ////////////////////////////////
    // 
    // ////////////////////////////////
    constructor(name = null){
        
        this.connection = {};
        this.ices = [];
        this.sendChannel = {};
        this.receiveChannel = {};
        
        
        
        var that = this;
        
        if(name){
            that.name = name;
        } else {
            that.name = Math.random().toString().replace(".","");
        }
        
        // 0.) Throat Clearing / Preamble
        that.ices = [];

        // 1.) Create a new connection
        that.connection = new RTCPeerConnection();

        // 2.) When the connection barfs up new ice-candidates;
        //      put them on the class level array to handle them later
        that.connection.onicecandidate = async function(evt){
            if(evt.candidate != null){
                that.ices.push(evt.candidate.toJSON());
            }
        }
        
        // 3.) When our connection is given a data-channel
        //      we need to store it and add some methods to
        //      it
        that.connection.ondatachannel = ((evt) => {
            that.receiveChannel = evt.channel;
            that.receiveChannel.onmessage = ((e) => {console.log(that.name,e)})
            that.receiveChannel.onopen = ((e) => {console.log(e,"OPEN")})
            that.receiveChannel.onclose = ((e) => {console.log(e,"CLOSED")})
        })

        
        //
        // 1.) Create a new channel on which to send things
        //
        that.sendChannel = that.connection.createDataChannel("send-data-channel");
        that.talkChannel = that.connection.createDataChannel("talk-data-channel");
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
           
            that.connection.createOffer()
                .then((offer) => {
                    console.log("OFFER.SDP",offer.sdp);
					
					if(offer.toJSON){
						that.offer = offer.toJSON();
					} else {
						that.offer = {"type": "offer"};
						that.offer.sdp = (offer.sdp);
					}
                    return that.connection.setLocalDescription(offer);
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
		
		msg = JSON.parse(atob(msg));
        
        return new Promise((res, rej) => {
            
            //
            // This is the SDP part of the string
            //
            var desc = new RTCSessionDescription(msg);
            
            that.connection.setRemoteDescription(desc)
                .then(() => {
                    if(!that.connection.localDescription){
                        return that.connection.createAnswer();
                    } else {
                        return true;
                    }
                })
                .then((answer) => {
                    if(!that.connection.localDescription){
                        return that.connection.setLocalDescription(answer);
                    } else {
                        return true;
                    }
                })
                .then(() => {
                    res(btoa(JSON.stringify(that.connection.localDescription.toJSON())));
                })
                .catch((e) => {
                    rej(e)
                });
        });
    }
    
    // ////////////////////////////////
    //
    // ////////////////////////////////
    addIce(ice){
        
        var that = this;
        
        return new Promise((res, rej) => {
            
            console.log(that.name, ice)
            
            ice = new RTCIceCandidate(ice);
            
            that.connection.addIceCandidate(ice)
                .then(res(true));
        })
        
    }
    
}