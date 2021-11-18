// ////////////////////////////////
//
// So window is weird, and I'm sure full of code stink,
// but...it works.
//
// I need a way to have window object emit events.
// It doesn't look like HTML-javascript can do window
// without being pegged to an element. So...if its an
// element they wants; its an element they gets!
//
// (but I don't like it...any more than you men)
//
// ////////////////////////////////


class SimpleEvents {

    // ////////////////////////////////
    //
    // ////////////////////////////////
    constructor() {
        this.___radio = document.createDocumentFragment();
    }


    // ////////////////////////////////
    //
    // ////////////////////////////////
    addEventListener(eventType, callBack) {
        this.___radio.addEventListener(eventType, callBack);
    }


    // ////////////////////////////////
    //
    // ////////////////////////////////
    __broadcast(eventName, eventData) {

        let evt = new CustomEvent(eventName, {
            "detail": eventData
        });

        this.___radio.dispatchEvent(evt);

    }
}
