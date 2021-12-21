const https = require('https');


exports.makeCredential = ((name) => {
	return new Promise((s,j) => {

	//
	// These are the options for hitting the API so we can create
	// a credential on the client...
	//
		var options = {
		  hostname: 'webauthn.io',
		  port: 443,
		  path: '/makeCredential/' + name + '?attType=none&authType=&userVerification=discouraged&residentKeyRequirement=false&txAuthExtension=',
		  method: 'GET'
		};

		//
		// This opts-in to connection-pooling (whatever the hell that means...)
		// https://nodejs.org/api/https.html#httpsrequestoptions-callback
		//
		options.agent = new https.Agent(options);

		
		//
		// Offically make the request ... here
		// 
		var req = https.request(options, (res) => {

		  //
		  // Anything useful from the api-server, we'll store
		  // in this object, and return it here...
		  //
		  var data = {
			  "statusCode" : res.statusCode,
			  "headers" : res.headers,
			  "body": ""
		  }

		  data.statusCode = res.statusCode;
		  data.headers = res.headers;
		  data.body = "";
		  
		  //
		  // Every time the server gives us data,
		  // convert it to a string, and pack it into
		  // our data.body (GROSS!)
		  //
		  res.on('data', (d) => {
			data.body += d.toString("utf8");
		  });
		  
		  //
		  // This tells us we're done collecting data
		  // so let's go ahead and clean up our data
		  // object, and return it to whoever is listening
		  //
		  res.on("end", (x) => {
			  data.body = JSON.parse(data.body);
			  return s(data);
		  });
		  
		});

		req.on('error', (e) => {
			
			console.error(e);
			return j(e);
			
		});
		
		req.end();

	})
})
