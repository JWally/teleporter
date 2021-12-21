const https = require('https');

// var postData =  "{\"id\":\"P09laM-FjFf6KXSO7Ue6dcQ1tv0t9Yft_0wDrocxffU\",\"rawId\":\"P09laM+FjFf6KXSO7Ue6dcQ1tv0t9Yft/0wDrocxffU=\",\"type\":\"public-key\",\"response\":{\"attestationObject\":\"o2NmbXRkbm9uZWdhdHRTdG10oGhhdXRoRGF0YVkBZ0mWDeWIDoxodDQXD2R2YFuP5K65ooYyx5lc87qDHZdjRQAAAAAAAAAAAAAAAAAAAAAAAAAAACA/T2Voz4WMV/opdI7tR7p1xDW2/S31h+3/TAOuhzF99aQBAwM5AQAgWQEAyyaz9MbzIltvwUHeiygFWvrZV2tsFiyweDjZGS2KsQdUdrC5vvwVZJc2L0/TlZsjQ3njafxc/FfEKi8/1ngoUvXI1464ynSWbES6tiWWQOviIH0Ss7MseX2eEN21On50V8L9Stf7hoBep7As9Wq6c48XJciuHbJ1fZx82z2hSIvQxtt09vDjruBfyjmokVckUOkqs4kiErnDByP8sZTZU2BNI3hAb4z9AuzSi9YUDbnAfQHohMvvb04EvM2PXms/FebJMiD9Vst0agmYHXyis0UOAPH5Rlc4GtvYoHn7pb2IGiX10OEUrkF8oJj3ybGBJf8kAzWPYa+YoTYs5HRurSFDAQAB\",\"clientDataJSON\":\"eyJ0eXBlIjoid2ViYXV0aG4uY3JlYXRlIiwiY2hhbGxlbmdlIjoieWhidkNFeDZHcU9yT2lvdVlWOFA0Z21RM2NjN0FERG05Y0J5OHNJR0g3ayIsIm9yaWdpbiI6Imh0dHA6Ly9sb2NhbGhvc3QiLCJjcm9zc09yaWdpbiI6ZmFsc2V9\"}}";
// var postData = '{"id":"R-p8oXusJccnPVMMh3R0JwRhrkgiYCSis9vFgjIRqoE","rawId":"R-p8oXusJccnPVMMh3R0JwRhrkgiYCSis9vFgjIRqoE","type":"public-key","response":{"attestationObject":"o2NmbXRkbm9uZWdhdHRTdG10oGhhdXRoRGF0YVkBZ3Sm6pITyZwvdLIkkrMgz0AmKpTBqVCgOX8pJQtghB7wRQAAAAAAAAAAAAAAAAAAAAAAAAAAACBH6nyhe6wlxyc9UwyHdHQnBGGuSCJgJKKz28WCMhGqgaQBAwM5AQAgWQEA993x-Y2c2kzhcnc1wk_H4WmwGb-ELmJ7ChZwGfehkaqImf4_mKMb8RMouDuEb4NO6YvXGDtpfUH5OYc32bR-bbVCXG390zPTgrrFRL-SfxHw7F5dPb98A-ebz_ysH0CcdCRxUnUPN8ozmKzCsc6618ZEskkNASmcLgB7nlCsP1EuijKR2iXaurn_RSkuAs-gM6sVTJj0SSiEoqFYoXGz7bj-PcHlCCFTLUonmqfFFlsjFG4ezmBe1dz93rEorQcxW_Irr8xeGFJ7-2mgonexRGVGmmdRynseC8cjAasTEuwH0W8QJDoFB0ConrXNHFJhw-7jo9MFiHLtK6NHlxYHHSFDAQAB","clientDataJSON":"eyJjaGFsbGVuZ2UiOiJ1Z0l0WnQ5SFhoQWgzMzdILWhrT0Jaa20wYVlSNEV1OUtLV24zVkd2T2gwIiwiY2xpZW50RXh0ZW5zaW9ucyI6e30sImhhc2hBbGdvcml0aG0iOiJTSEEtMjU2Iiwib3JpZ2luIjoiaHR0cHM6Ly93ZWJhdXRobi5pbyIsInR5cGUiOiJ3ZWJhdXRobi5jcmVhdGUifQ"}}';
var postData = {"id":"eGkecY6krRRu6c8V4_dxNXaNSSTfrEZuM6HIdaxn1zo","rawId":"eGkecY6krRRu6c8V4_dxNXaNSSTfrEZuM6HIdaxn1zo","type":"public-key","response":{"attestationObject":"o2NmbXRkbm9uZWdhdHRTdG10oGhhdXRoRGF0YVkBZ3Sm6pITyZwvdLIkkrMgz0AmKpTBqVCgOX8pJQtghB7wRQAAAAAAAAAAAAAAAAAAAAAAAAAAACB4aR5xjqStFG7pzxXj93E1do1JJN-sRm4zoch1rGfXOqQBAwM5AQAgWQEAxKFhzaOoCtSg0vVpkl7LqRLNLAw8XPysac4iTCF1QkU-PrChrgrzyrzSGSZGhfmmPlO67JCoWS8RmJa1fU2YgRo0oEXJsMlYmjqvbPR0NiIJgrcAMAoj0qsSZ5PfweCC7VA0V5WVveRPkmfEwSA8BJrUHtdekDLiPvSKEu8wBk_NKccSj85jIsHMVgwrRhy4fOaQyKG3dKCVW6CmB0TjD7npG_XNAY_jtdYaKLCu5VeRsou3CVCiLbTelh_VVTOtUtJ8UmCh04qxBG5NbCqIR1_0q6WAe6Bzr2DIK8TpW7JiyrpdQL6zcy_JeCrOg6Q8m-V9Z1mvu_4L9Eskbd-VIyFDAQAB","clientDataJSON":"eyJjaGFsbGVuZ2UiOiJQSzNjV20wVkM2MmNCN1p1aGVCNFRGNERjZXZZQ25zUE9lQVNXNTZfM0VVIiwiY2xpZW50RXh0ZW5zaW9ucyI6e30sImhhc2hBbGdvcml0aG0iOiJTSEEtMjU2Iiwib3JpZ2luIjoiaHR0cHM6Ly93ZWJhdXRobi5pbyIsInR5cGUiOiJ3ZWJhdXRobi5jcmVhdGUifQ"}};


postData = JSON.stringify(postData);
console.log(postData.length);

const options = {
  hostname: 'webauthn.io',
  port: 443,
  path: '/makeCredential',
  method: 'POST',
  headers: {
	  "Content-Type": "application/json"
	  ,"Content-Length": postData.length
	  ,"Host": "webauthn.io"
	  ,"Origin": "https://webauthn.io"
	  ,"Cookie": "webauthn-session=MTY0MDEwODIyOXxEdi1CQkFFQ180SUFBUkFCRUFBQV83UF9nZ0FDQm5OMGNtbHVad3dPQUF4eVpXZHBjM1J5WVhScGIyNEhXMTExYVc1ME9BcHdBRzU3SW1Ob1lXeHNaVzVuWlNJNklsQkxNMk5YYlRCV1F6WXlZMEkzV25Wb1pVSTBWRVkwUkdObGRsbERibk5RVDJWQlUxYzFObDh6UlZVaUxDSjFjMlZ5WDJsa0lqb2lNMk0wVVVGQlFVRkJRVUZCUVVFOVBTSXNJblZ6WlhKV1pYSnBabWxqWVhScGIyNGlPaUlpZlFaemRISnBibWNNQ1FBSGRYTmxjbDlwWkFSMWFXNTBCZ1VBX1FRblBnPT18uSu43DPCKaazwqEQy2C1cN6hmiLK4Zoalr8eMYOmfcY="
	  
  }
};

const req = https.request(options, (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error(e);
});

req.write(postData);
req.end();