class XRTC extends SimpleEvents {

    #connection;
    #receiveChannel;
    #sendChannel;

    // ////////////////////////////////
    // 
    // ////////////////////////////////
    constructor(name = null) {

        // Seymore Skinner...
        super();

        this.name = name !== null ? name : Math.random();


        var that = this;

        // 1.) Create a new connection
        that.#connection = new RTCPeerConnection();

        // 2.) When the connection barfs up new ice-candidates;
        //      put them on the class level array to handle them later
        that.#connection.onicecandidate = async function (evt) {
            if (evt.candidate != null) {
                //
                // *********************************
                // BROADCAST - ices
                //
                that.__broadcast("ices", evt.candidate.toJSON());
            }
        }

        // 3.) When our connection is given a data-channel
        //      we need to store it and add some methods to
        //      it
        that.#connection.ondatachannel = ((evt) => {
            that.#receiveChannel = evt.channel;
            that.#receiveChannel.onmessage = ((e) => {
                that.__broadcast("channel-message", e)
            })
            that.#receiveChannel.onopen = ((e) => {
                that.__broadcast("channel-open", e)
            })
            that.#receiveChannel.onclose = ((e) => {
                that.__broadcast("channel-close", e)
            })
        })

        // 4.) Create a new channel on which to send things
        //
        that.#sendChannel = that.#connection.createDataChannel("send-data-channel");
        //
        // 
        //
    }


    // ////////////////////////////////
    //
    // ////////////////////////////////
    start() {

        var that = this;
        var ofr;

        return new Promise((res, rej) => {



            that.#connection.createOffer()
                .then((offer) => {
                    ofr = offer.toJSON();
                    return that.#connection.setLocalDescription(ofr);
                })
                .then(() => {
                    //
                    // *********************************
                    // BROADCAST - offer
                    //
                    that.__broadcast("offer", ofr);
                    res(true);
                })
                .catch((e) => {
                    rej(e)
                });
        });
    }

    // ////////////////////////////////
    //
    // ////////////////////////////////
    setRemote(msg) {

        var that = this;


        return new Promise((res, rej) => {

            //
            // This is the SDP part of the string
            //
            var desc = new RTCSessionDescription(msg);

            that.#connection.setRemoteDescription(desc)
                .then(() => {
                    if (!that.#connection.localDescription || that.#connection.currentRemoteDescription == null) {
                        return that.#connection.createAnswer();
                    } else {
                        return true;
                    }
                })
                .then((answer) => {

                    console.log(that.name, that.#connection.localDescription, that.#connection.remoteDescription);

                    if (!that.#connection.localDescription || that.#connection.currentRemoteDescription == null) {
                        return that.#connection.setLocalDescription(answer);
                    } else {
                        return true;
                    }
                })
                .then((x) => {
                    //
                    // *********************************
                    // BROADCAST - offer
                    that.__broadcast("offer", that.#connection.localDescription.toJSON());
                    res(that.#connection.localDescription.toJSON());
                })
            /*
                            .catch((e) => {
                                rej(e)
                            });
            */
        });
    }

    // ////////////////////////////////
    //
    // ////////////////////////////////
    addIce(ice) {

        var that = this;

        return new Promise((res, rej) => {
            that.#connection.addIceCandidate(new RTCIceCandidate(ice))
                .then(res(true));
        })
    }


    // ////////////////////////////////
    //
    // ////////////////////////////////
    send(msg) {
        this.#sendChannel.send(msg);
    }

}
