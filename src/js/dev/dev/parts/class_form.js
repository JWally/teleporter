// ////////////////////////////////
//
// Simple Class to manage forms in a uniform way,
// and handle errors and validation.
//
// ////////////////////////////////


class SimpleForm extends SimpleEvents {
    // ////////////////////////////////
    //
    //
    // ////////////////////////////////
    constructor(el_form) {

        super();

        this._private_ = {};
        this._private_.fields = {};
        this._private_.field_array = [];

        // Set reference to each one of the fields...
        //
        let els = Array.from(el_form.elements);

        for (let i = 0; i < els.length; i++) {
            // 
            this._private_.fields[els[i].id] = new SimpleField(els[i]);

            // Easy to iterate over array of fields;
            this._private_.field_array.push(this._private_.fields[els[i].id]);
        }


    }

    // ////////////////////////////////
    //
    //
    // ////////////////////////////////
    get fields() {
        return this._private_.fields;
    }

    // ////////////////////////////////
    //
    //
    // ////////////////////////////////
    get values() {
        return this._private_.field_array.map(function (field) {

            return {
                "id": field.id,
                "value": field.value
            };
        });
    }


    // ////////////////////////////////
    //
    //
    // ////////////////////////////////
    validate() {
        let valid = true;

        for (let i = 0; i < this._private_.field_array.length; i++) {

            let field = this._private_.field_array[i];

            if (!field.validate()) {
                valid = false;
            }
        }

        return valid;
    }


    // ////////////////////////////////
    //
    //
    // ////////////////////////////////
    empty() {

        for (let i = 0; i < this._private_.field_array.length; i++) {
            let field = this._private_.field_array[i];
            field.empty();
        }
    }


}
