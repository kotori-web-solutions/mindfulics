function handleMessage(request) {
 
	// console.log(request.payload);
	
	icsBody = request.payload;
			
	let blob = new Blob([icsBody], {type: "text/calendar"});
	let blobCreatedURL = URL.createObjectURL(blob);
	
	browser.downloads.download({filename:'mindtermin'+Date.now()+'.ics', url: blobCreatedURL});	
 
}

browser.runtime.onMessage.addListener(handleMessage);

