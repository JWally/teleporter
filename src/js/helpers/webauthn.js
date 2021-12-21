class DataHelpers{

	
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
	static string2buffer(str) {
		return (new Uint8Array(str.length)).map(function (x, i) {
			return str.charCodeAt(i)
		});
	}

/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
	// Encode an ArrayBuffer into a base64 string.
	static bufferEncode(value) {
		return btoa(String.fromCharCode.apply(null, value));
	}

/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
	// Don't drop any blanks
	// decode
	static bufferDecode(value) {
		return Uint8Array.from(atob(value), c => c.charCodeAt(0));
	}

/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
	static buffer2string(buf) {
		let str = "";
		if (!(buf.constructor === Uint8Array)) {
			buf = new Uint8Array(buf);
		}
		buf.map(function (x) {
			return str += String.fromCharCode(x)
		});
		return str;
	}


/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
	static cbor_decode(data){
		var that = this;
		
		return CBOR.decode(that.bufferDecode(data).buffer)
		
	}
	
}










class WebAuthMServer extends DataHelpers{
	
	constructor(){
		super();
		
	}
	// ///////////////////////////////////////////
	// REGISTRATION METHODS
	// ///////////////////////////////////////////
	//
	// THIS SYNTHESIZES WHAT NEEDS TO COME FROM THE SERVER 
	//
	get__AssertionOptions(name, displayName, id){
		
		return new Promise((s,j) => {
			
			if(!name || !displayName || !id){
				//
				// reJect our promise
				//
				return j("YOU NAME A `name` OR `displayName` OR AN `id`");
			}
			
			var challenge = DataHelpers.bufferEncode(crypto.getRandomValues(new Uint8Array(64)));
			
			console.log("CHALLENGE ===> ", challenge);
			
			var output = {
				"publicKey":{
					"challenge": challenge,
					"rp":{"name":"localhost","id":"localhost"},
					"user":{"name":name,"displayName":displayName,"id":id},
					"pubKeyCredParams":[
						{"type":"public-key","alg":-259},
						{"type":"public-key","alg":-258},
						{"type":"public-key","alg":-257},
						{"type":"public-key","alg":-7},
						{"type":"public-key","alg":-35},
						{"type":"public-key","alg":-36},
						{"type":"public-key","alg":-37},
						{"type":"public-key","alg":-38},
						{"type":"public-key","alg":-39},
						{"type":"public-key","alg":-8}
					],
					"authenticatorSelection":{"requireResidentKey":false,"userVerification":"discouraged"},
					"timeout":60000,
					"extensions":{"txAuthSimple":""},
					"attestation":"none"
				}
			}
			
			//
			// reSolve our promise
			//
			return s(output);
			
		})
		
	}
	
	
	
	
	get__ExistingAssertionOptions(name, displayName, id){

			

		return new Promise((s,j) => {
			
			if(!name || !displayName || !id){
				//
				// reJect our promise
				//
				return j("YOU NAME A `name` OR `displayName` OR AN `id`");
			}
			
			var challenge = DataHelpers.bufferEncode(crypto.getRandomValues(new Uint8Array(64)));
			
			console.log("CHALLENGE ===> ", challenge);
			
			var data = {
			  "publicKey": {
				"challenge": challenge,
				"rp": {
				  "name": "localhost",
				  "id": "localhost"
				},
				"user": {
				  "name": name,
				  "displayName": displayName,
				  "id": id
				},
				"pubKeyCredParams":[
					{"type":"public-key","alg":-7},
					{"type":"public-key","alg":-35},
					{"type":"public-key","alg":-36},
					{"type":"public-key","alg":-257},
					{"type":"public-key","alg":-258},
					{"type":"public-key","alg":-259},
					{"type":"public-key","alg":-37},
					{"type":"public-key","alg":-38},
					{"type":"public-key","alg":-39},
					{"type":"public-key","alg":-8}
				],
				"authenticatorSelection": {"requireResidentKey": false,"userVerification": "discouraged"},
				"timeout": 60000,
				"extensions": {"txAuthSimple": ""},
				"attestation": "none"
			  }
			}
			
			
			
			s(data);			
			
		})
		

		
	}
	
	
	
	
	// THIS THIS IS WHAT THE SERVER GETS BACK FROM THE
	// CLIENT (by hook or by crook) AND DOES SOMETHING
	// WITH IT...
	//
	post__MakeCredential(clientData){
		
		return new Promise((s,j) => {

			var data = JSON.parse(clientData.data);
			
			data.response.attestationObject = DataHelpers.cbor_decode(data.response.attestationObject);
			data.response.clientDataJSON = JSON.parse(atob(data.response.clientDataJSON));

			return s(data);   

		});
	}
	
	
	
	
	
	
	//
	// LOCAL FUNCTION TO PARSE / STORE THE AUTH DATA FROM
	// THE CLIENT:
	//
	// https://www.iana.org/assignments/cose/cose.xhtml#algorithms
	//
	static parseAuthData(authData){
		
		
	/*

		The authData is a byte array described in the spec. Parsing it will involve slicing bytes from the array and converting them into usable objects.

		The publicKeyObject retrieved at the end is an object encoded in a standard called COSE, which is a concise way to describe the credential public key and the metadata needed to use it.

		1: The 1 field describes the key type. The value of 2 indicates that the key type is in the Elliptic Curve format.
		3: The 3 field describes the algorithm used to generate authentication signatures. The -7 value indicates this authenticator will be using ES256.
		-1: The -1 field describes this key's "curve type". The value 1 indicates the that this key uses the "P-256" curve.
		-2: The -2 field describes the x-coordinate of this public key.
		-3: The -3 field describes the y-coordinate of this public key.

	*/
		
		// get the length of the credential ID
		var dataView = new DataView(new ArrayBuffer(2));
		var idLenBytes = authData.slice(53, 55);
		idLenBytes.forEach((value, index) => dataView.setUint8(index, value));
		var credentialIdLength = dataView.getUint16();

		// get the credential ID
		var credentialId = authData.slice(55, 55 + credentialIdLength);

		// get the public key object
		var publicKeyBytes = authData.slice(55 + credentialIdLength);

		// the publicKeyBytes are encoded again as CBOR
		var publicKeyObject = CBOR.decode(publicKeyBytes.buffer);
			
		return publicKeyObject;
		
	}	
	
}









class WebAuthM {
	
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
	constructor(){
		
	}
	
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
	makeCredential(makeCredentialOptions){
		
		// THIS OL' CHESTNUT?
		//
		var that = this;
		
		if(!makeCredentialOptions){
			
			// BARF HERE!
			throw new Error("YOU NEED MAKE OPTIONS STUPID!");
		}
		
		// NORMALIZE THE INFORMATION SO IT CAN BE WORKED WITH
		// VIA "credentials.create"
		//
		//
		// N.B. THIS IS UGLY AF...
		// PLZ CLEAN IT UP?!
		//	
		makeCredentialOptions.publicKey.challenge = DataHelpers.bufferDecode(makeCredentialOptions.publicKey.challenge);
		
		makeCredentialOptions.publicKey.user.id = DataHelpers.bufferDecode(makeCredentialOptions.publicKey.user.id);
		
		if (makeCredentialOptions.publicKey.excludeCredentials) {
			for (var i = 0; i < makeCredentialOptions.publicKey.excludeCredentials.length; i++) {
				makeCredentialOptions.publicKey.excludeCredentials[i].id = DataHelpers.bufferDecode(makeCredentialOptions.publicKey.excludeCredentials[i].id);
			}
		}
		
		// PROCESS THE CREDENTIALS
		//
		//
		return navigator.credentials.create({
			"publicKey": makeCredentialOptions.publicKey
		})
		// FORMAT THE RESPONSE INTO SOMETHING WE CAN SEND
		// TO THE SERVER...
		//
		.then((newCredential) => {
			
			// Move data into Arrays incase it is super long
			let attestationObject = new Uint8Array(newCredential.response.attestationObject);
			let clientDataJSON = new Uint8Array(newCredential.response.clientDataJSON);
			let rawId = new Uint8Array(newCredential.rawId);
			
			let data = {
				"url": '/makeCredential',
				"type": 'POST',
				"data": JSON.stringify({
					"id": newCredential.id,
					"rawId": DataHelpers.bufferEncode(rawId),
					"type": newCredential.type,
					"response": {
						"attestationObject": DataHelpers.bufferEncode(attestationObject),
						"clientDataJSON": DataHelpers.bufferEncode(clientDataJSON),
					},
				})
			};
			

			return data;
		
		
		})
		.catch(function (err) {
			return err;
		});
	}
	
	
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
	getCredential(getCredentialOptions){
		
		
		getCredentialOptions.publicKey.challenge = DataHelpers.bufferDecode(getCredentialOptions.publicKey.challenge);
		
		getCredentialOptions.publicKey.user.id = DataHelpers.bufferDecode(getCredentialOptions.publicKey.user.id);
		
		return getCredentialOptions;
		

	}
	
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
	detectWebAuthnSupport() {
		// TEST 1
		if (window.PublicKeyCredential === undefined || typeof window.PublicKeyCredential !== "function") {
			throw new Error("Oh no! This browser doesn't currently support WebAuthn.");
			return false;
		}
		
		// TEST 2
		if (window.location.protocol === "http:" && (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1")){
			throw new Error("WebAuthn only supports secure connections. For testing over HTTP, you can use the origin \"localhost\".");
			return false;
		}
		
		return true;

	}
	
}


/*

function setUser() {
    username = $("input-email").val();
    state.user.name = username.toLowerCase().replace(/\s/g, '');
    state.user.displayName = username.toLowerCase();
}

function checkUserExists() {
    $.get('/user/' + state.user.name + '/exists', {}, null, 'json')
        .done(function (response) {
            return true;
        }).catch(function () {
            return false;
        });
}

function getCredentials() {
    $.get('/credential/' + state.user.name, {}, null, 'json')
        .done(function (response) {
            console.log(response)
        });
}
*/

/*
function makeCredential() {
    hideErrorAlert();
    console.log("Fetching options for new credential");
    if ($("input-email").val() === "") {
        showErrorAlert("Please enter a username");
        return;
    }
    setUser();
    var credential = null;

    var attestation_type = $('select-attestation').find(':selected').val();
    var authenticator_attachment = $('select-authenticator').find(':selected').val();
    
    var user_verification = $('select-verification').find(':selected').val();
    var resident_key_requirement = $('select-residency').find(':selected').val();
    var txAuthSimple_extension = $('extension-input').val();

    $.get('/makeCredential/' + state.user.name, {
            attType: attestation_type,
            authType: authenticator_attachment,
            userVerification: user_verification,
            residentKeyRequirement: resident_key_requirement,
            txAuthExtension: txAuthSimple_extension,
        }, null, 'json')
        .done(function (makeCredentialOptions) {            
            makeCredentialOptions.publicKey.challenge = bufferDecode(makeCredentialOptions.publicKey.challenge);
            makeCredentialOptions.publicKey.user.id = bufferDecode(makeCredentialOptions.publicKey.user.id);
            if (makeCredentialOptions.publicKey.excludeCredentials) {
                for (var i = 0; i < makeCredentialOptions.publicKey.excludeCredentials.length; i++) {
                    makeCredentialOptions.publicKey.excludeCredentials[i].id = bufferDecode(makeCredentialOptions.publicKey.excludeCredentials[i].id);
                }
            }
            console.log("Credential Creation Options");
            console.log(makeCredentialOptions);
            navigator.credentials.create({
                publicKey: makeCredentialOptions.publicKey
            }).then(function (newCredential) {
                console.log("PublicKeyCredential Created");
                console.log(newCredential);
                state.createResponse = newCredential;
                registerNewCredential(newCredential);
            }).catch(function (err) {
                console.info(err);
            });
        });
}
*/


// This should be used to verify the auth data with the server
function registerNewCredential(newCredential) {
    // Move data into Arrays incase it is super long
    let attestationObject = new Uint8Array(newCredential.response.attestationObject);
    let clientDataJSON = new Uint8Array(newCredential.response.clientDataJSON);
    let rawId = new Uint8Array(newCredential.rawId);

    $.ajax({
        url: '/makeCredential',
        type: 'POST',
        data: JSON.stringify({
            id: newCredential.id,
            rawId: bufferEncode(rawId),
            type: newCredential.type,
            response: {
                attestationObject: bufferEncode(attestationObject),
                clientDataJSON: bufferEncode(clientDataJSON),
            },
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("login-button").popover('show')
        }
    });
}

function addUserErrorMsg(msg) {
    if (msg === "username") {
        msg = 'Please add username';
    } else {
        msg = 'Please add email';
    }
    document.getElementById("user-create-error").innerHTML = msg;
}

function getAssertion() {
    hideErrorAlert();
    if ($("input-email").val() === "") {
        showErrorAlert("Please enter a username");
        return;
    }
    setUser();
    $.get('/user/' + state.user.name + '/exists', {}, null, 'json').done(function (response) {
            console.log(response);
        }).then(function () {
            
            var user_verification = $('select-verification').find(':selected').val();            
            var txAuthSimple_extension = $('extension-input').val();

            $.get('/assertion/' + state.user.name, {
                userVer: user_verification,
                txAuthExtension: txAuthSimple_extension
            }, null, 'json')
                .done(function (makeAssertionOptions) {
                    console.log("Assertion Options:");
                    console.log(makeAssertionOptions);
                    makeAssertionOptions.publicKey.challenge = bufferDecode(makeAssertionOptions.publicKey.challenge);
                    makeAssertionOptions.publicKey.allowCredentials.forEach(function (listItem) {
                        listItem.id = bufferDecode(listItem.id)
                    });
                    console.log(makeAssertionOptions);
                    navigator.credentials.get({
                            publicKey: makeAssertionOptions.publicKey
                        })
                        .then(function (credential) {
                            console.log(credential);
                            verifyAssertion(credential);
                        }).catch(function (err) {
                            console.log(err.name);
                            showErrorAlert(err.message);
                        });
                });
        })
        .catch(function (error) {
            if (!error.exists) {
                showErrorAlert("User not found, try registering one first!");
            }
            return;
        });
}

function verifyAssertion(assertedCredential) {
    // Move data into Arrays incase it is super long
    console.log('calling verify')
    let authData = new Uint8Array(assertedCredential.response.authenticatorData);
    let clientDataJSON = new Uint8Array(assertedCredential.response.clientDataJSON);
    let rawId = new Uint8Array(assertedCredential.rawId);
    let sig = new Uint8Array(assertedCredential.response.signature);
    let userHandle = new Uint8Array(assertedCredential.response.userHandle);
    $.ajax({
        url: '/assertion',
        type: 'POST',
        data: JSON.stringify({
            id: assertedCredential.id,
            rawId: bufferEncode(rawId),
            type: assertedCredential.type,
            response: {
                authenticatorData: bufferEncode(authData),
                clientDataJSON: bufferEncode(clientDataJSON),
                signature: bufferEncode(sig),
                userHandle: bufferEncode(userHandle),
            },
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            window.location = "/dashboard"
            console.log(response)
        }
    });
}

/*
function setCurrentUser(userResponse) {
    state.user.name = userResponse.name;
    state.user.displayName = userResponse.display_name;
}

function showErrorAlert(msg) {
    $("alert-msg").text(msg)
    $("alert").show();
}

function hideErrorAlert() {
    $("alert").hide();
}

function popoverPlacement(context, source) {
    if ($(window).width() < 992) {
        return "bottom"
    }
    return "right";
}

$(document).ready(function () {
    $('[data-toggle="popover"]').popover({
        trigger: 'manual',
        container: 'body',
        placement: popoverPlacement
    })
})
*/