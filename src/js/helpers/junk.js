






var makeOptions = {
  "publicKey": {
    "challenge": "QR+QAd8foRrl5hKaDtpN6GnsTvsVYoy3d5k3ugXXQO8=",
    "rp": {
      "name": "localhost",
      "id": "localhost"
    },
    "user": {
      "name": "Jimmy",
      "displayName": "Jimmy",
      "id": btoa("Larry")
    },
    "pubKeyCredParams": [
      {
        "type": "public-key",
        "alg": -7
      },
      {
        "type": "public-key",
        "alg": -35
      },
      {
        "type": "public-key",
        "alg": -36
      },
      {
        "type": "public-key",
        "alg": -257
      },
      {
        "type": "public-key",
        "alg": -258
      },
      {
        "type": "public-key",
        "alg": -259
      },
      {
        "type": "public-key",
        "alg": -37
      },
      {
        "type": "public-key",
        "alg": -38
      },
      {
        "type": "public-key",
        "alg": -39
      },
      {
        "type": "public-key",
        "alg": -8
      }
    ],
    "authenticatorSelection": {
    //  "authenticatorAttachment": "cross-platform",
      "requireResidentKey": false,
      "userVerification": "discouraged"
    },
    "timeout": 60000,
    "extensions": {
      "txAuthSimple": ""
    },
    "attestation": "none"
  }
}
/*

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
	
	
	
	
	
	
	
// This should be used to verify the auth data with the server
function registerNewCredential(newCredential) {
    // Move data into Arrays incase it is super long
    let attestationObject = new Uint8Array(newCredential.response.attestationObject);
    let clientDataJSON = new Uint8Array(newCredential.response.clientDataJSON);
    let rawId = new Uint8Array(newCredential.rawId);

    console.log("SEND THIS TO SERVER",{
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
            $("#login-button").popover('show')
        }
    });
}
*/