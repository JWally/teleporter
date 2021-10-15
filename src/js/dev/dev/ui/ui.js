class UserInterface {

    #pforms = {
        "home": {
            "template": "home/index"
        },
        "genkey": {
            "template": "genkey/index"
        },
        "encrypt": {
            "template": "encrypt/index"
        },
        "decrypt": {
            "template": "decrypt/index"
        }

    }

    constructor() {

        var that = this;

        console.log(that, Object.keys(that.#pforms));

        for (var x in Object.keys(that.#pforms)) {

            // Create the element
            var tmp = document.createElement("form")
            that.#pforms[x] = new SimpleForm(x, templates[that.#pforms[x].template]);
            that.#pforms[x].render();

        }
    }


    render() {



    }

}
