/*
"use strict";

var cbor = require("cbor");

// main COSE labels
// defined here: https://tools.ietf.org/html/rfc8152#section-7.1
const coseLabels = {
    "1": {
        name: "kty",
        values: {
            "2": "EC",
            "3": "RSA"
        }
    },
    "2": {
        name: "kid",
        values: {}
    },
    "3": {
        name: "alg",
        values: {
            "-7": "ECDSA_w_SHA256",
            "-8": "EdDSA",
            "-35": "ECDSA_w_SHA384",
            "-36": "ECDSA_w_SHA512",
            "-257": "RSASSA-PKCS1-v1_5_w_SHA256",
            "-258": "RSASSA-PKCS1-v1_5_w_SHA384",
            "-259": "RSASSA-PKCS1-v1_5_w_SHA512",
            "-65535": "RSASSA-PKCS1-v1_5_w_SHA1"
        }
    },
    "4": {
        name: "key_ops",
        values: {}
    },
    "5": {
        name: "base_iv",
        values: {}
    }
};

const algHashes = {
    "ECDSA_w_SHA256": "SHA256",
    // EdDSA: ""
    "ECDSA_w_SHA384": "SHA384",
    "ECDSA_w_SHA512": "SHA512",
    "RSASSA-PKCS1-v1_5_w_SHA256": "SHA256",
    "RSASSA-PKCS1-v1_5_w_SHA384": "SHA384",
    "RSASSA-PKCS1-v1_5_w_SHA512": "SHA512",
    "RSASSA-PKCS1-v1_5_w_SHA1": "SHA1"
};

function algToStr(alg) {
    if (typeof alg !== "number") {
        throw new TypeError("expected 'alg' to be a number, got: " + alg);
    }

    var algValues = coseLabels["3"].values;
    return algValues[alg];
}

function algToHashStr(alg) {
    if (typeof alg === "number") alg = algToStr(alg);

    if (typeof alg !== "string") {
        throw new Error("'alg' is not a string or a valid COSE algorithm number");
    }

    return algHashes[alg];
}

// key-specific parameters
const keyParamList = {
    // ECDSA key parameters
    // defined here: https://tools.ietf.org/html/rfc8152#section-13.1.1
    "EC": {
        "-1": {
            name: "crv",
            values: {
                "1": "P-256",
                "2": "P-384",
                "3": "P-521",
                "4": "X25519",
                "5": "X448",
                "6": "Ed25519",
                "7": "Ed448"
            }
        },
        "-2": {
            name: "x"
            // value = Buffer
        },
        "-3": {
            name: "y"
            // value = Buffer
        },
        "-4": {
            name: "d"
            // value = Buffer
        }
    },
    // RSA key parameters
    // defined here: https://tools.ietf.org/html/rfc8230#section-4
    "RSA": {
        "-1": {
            name: "n"
            // value = Buffer
        },
        "-2": {
            name: "e"
            // value = Buffer
        },
        "-3": {
            name: "d"
            // value = Buffer
        },
        "-4": {
            name: "p"
            // value = Buffer
        },
        "-5": {
            name: "q"
            // value = Buffer
        },
        "-6": {
            name: "dP"
            // value = Buffer
        },
        "-7": {
            name: "dQ"
            // value = Buffer
        },
        "-8": {
            name: "qInv"
            // value = Buffer
        },
        "-9": {
            name: "other"
            // value = Array
        },
        "-10": {
            name: "r_i"
            // value = Buffer
        },
        "-11": {
            name: "d_i"
            // value = Buffer
        },
        "-12": {
            name: "t_i"
            // value = Buffer
        }
    }

};


function coseToJwk(cose) {
    if (typeof cose !== "object") {
        throw new TypeError("'cose' argument must be an object, probably an Buffer conatining valid COSE");
    }

    // convert Uint8Array, etc. to ArrayBuffer
    if (cose.buffer instanceof ArrayBuffer && !(cose instanceof Buffer)) {
        cose = cose.buffer;
    }

    if (Array.isArray(cose)) {
        cose = Buffer.from(cose);
    }

    // convert ArrayBuffer to Buffer
    if (cose instanceof ArrayBuffer) {
        cose = Buffer.from(new Uint8Array(cose));
    }

    if (!(cose instanceof Buffer)) {
        throw new TypeError("could not convert 'cose' argument to a Buffer");
    }

    if (cose.length < 3) {
        throw new RangeError("COSE buffer was too short: " + cose.length);
    }

    var parsedCose;
    try {
        parsedCose = cbor.decodeAllSync(Buffer.from(cose));
    } catch (err) {
        throw new Error("couldn't parse authenticator.authData.attestationData CBOR: " + err);
    }
    if (!Array.isArray(parsedCose) || !(parsedCose[0] instanceof Map)) {
        throw new Error("invalid parsing of authenticator.authData.attestationData CBOR");
    }
    var coseMap = parsedCose[0];

    var extraMap = new Map();

    var retKey = {};

    // parse main COSE labels
    for (let kv of coseMap) {
        let key = kv[0].toString();
        let value = kv[1].toString();

        if (!coseLabels[key]) {
            extraMap.set(kv[0], kv[1]);
            continue;
        }

        let name = coseLabels[key].name;
        if (coseLabels[key].values[value]) value = coseLabels[key].values[value];
        retKey[name] = value;
    }

    var keyParams = keyParamList[retKey.kty];

    // parse key-specific parameters
    for (let kv of extraMap) {
        let key = kv[0].toString();
        let value = kv[1];

        if (!keyParams[key]) {
            throw new Error("unknown COSE key label: " + retKey.kty + " " + key);
        }
        let name = keyParams[key].name;

        if (keyParams[key].values) {
            value = keyParams[key].values[value.toString()];
        }

        if (value instanceof Buffer) {
            value = value.toString("base64");
        }

        retKey[name] = value;
    }

    return retKey;
}

coseToJwk.algToStr = algToStr;
coseToJwk.algToHashStr = algToHashStr;
module.exports = coseToJwk;
*/