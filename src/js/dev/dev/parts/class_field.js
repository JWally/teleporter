// ////////////////////////////////
//
// Simple Class to manage fields in a uniform way,
// and handle errors and validation.
//
// ////////////////////////////////


class SimpleField extends SimpleEvents {
    // ////////////////////////////////
    //
    //
    // ////////////////////////////////
    constructor(el) {

        super();
        //
        // Ugly, but it works...
        //
        this._private_ = {};
        let that = this;

        // Set the element to private.
        //
        this._private_.el = el;

        // Look for warning flags we can communicate
        // with...
        this._private_.flag_el = el.parentElement.querySelector(`[data-flag-for='${el.id}']`);

        // Validate on blur
        el.onblur = function () {
            that.validate()
        };


        // Hack around with what type of field
        // we're looking at...
        // 
        switch (el.type) {
        case "date":
            this.__setDateMinAndMax();
            break;
        }


    }

    // ////////////////////////////////
    //
    //
    // ////////////////////////////////
    validate() {


        //
        // We've been "Touched".
        // Make us dirty so that CSS Selectors
        // Can start to do their job.
        this._private_.el.classList.add("dirty");


        if (this._private_.el.checkValidity()) {
            return true;
        } else {
            this.flag = this._private_.el.validationMessage;
            return false;
        };
    }

    // ////////////////////////////////
    //
    //
    // ////////////////////////////////
    get flag() {
        if (this._private_.flag_el) {
            return this._private_.flag_el.innerText;
        } else {
            return null;
        }
    }


    // ////////////////////////////////
    //
    //
    // ////////////////////////////////
    set flag(txt) {
        if (this._private_.flag_el) {
            this._private_.flag_el.innerText = txt;
            return true;
        } else {
            return false;
        }
    }

    // ////////////////////////////////
    //
    //
    // ////////////////////////////////
    get value() {
        return this._private_.el.value;
    }

    // ////////////////////////////////
    //
    //
    // ////////////////////////////////
    set value(x) {
        this._private_.el.value = x;
    }

    // ////////////////////////////////
    //
    //
    // ////////////////////////////////
    get id() {
        return this._private_.el.id;
    }

    // ////////////////////////////////
    //
    //
    // ////////////////////////////////
    empty() {
        this._private_.el.classList.remove("dirty");
        this._private_.el.value = "";
    }


    // ////////////////////////////////
    //
    //
    // ////////////////////////////////
    __setDateMinAndMax() {

        let field = this._private_.el;

        // Hack if they have "today" in there
        if (field.min) {
            if (field.min === "today") {
                var date = new Date();
                var dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
                    .toISOString()
                    .split("T")[0];

                field.min = dateString;
            } else if (/^[0-9]+$/.test(field.min)) {

                date = new Date();
                dateString = new Date((1000 * 60 * 60 * 24 * parseFloat(field.min)) + date.getTime() - (date.getTimezoneOffset() * 60000))
                    .toISOString()
                    .split("T")[0];
                field.min = dateString;
            }
        }


        // If they have a max that isn't a date,
        // Assume they want that many days in advance...
        if (/^[0-9]+$/.test(field.max)) {

            date = new Date();
            dateString = new Date((1000 * 60 * 60 * 24 * parseFloat(field.max)) + date.getTime() - (date.getTimezoneOffset() * 60000))
                .toISOString()
                .split("T")[0];
            field.max = dateString;

        }
    }

}
