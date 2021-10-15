function extractDate(rawDate){
	
	let day = rawDate.substring(0,2);
	let month = rawDate.substring(3,5);
	let year = rawDate.substring(6,10);
	let hour = rawDate.substring(11,13);
	let minute = rawDate.substring(14,16);
	
	return year+month+day+"T"+hour+minute+"00";
	
}

function parseBody(msgBody){

	let msgBodyArray = msgBody.split('\n');

	this.propOrganizer = msgBodyArray[8].substring(30).replace("\r","").replace("\n","");	
	this.propOrganizerMail = msgBodyArray[9].substring(30).replace("\r","").replace("\n","").replace("mailto:","");	
	this.propLocation = msgBodyArray[10].substring(30).replace("\r","").replace("\n","") + ", " + msgBodyArray[11].substring(30).replace("\r","").replace("\n","");	
	this.propSummary = msgBodyArray[5].substring(30).replace("\r","").replace("\n","");	
	this.propStartDate = extractDate(msgBodyArray[6].substring(30).replace("\r","").replace("\n",""));	
	this.propEndDate = extractDate(msgBodyArray[7].substring(30).replace("\r","").replace("\n",""));	
	this.propDateCreated = extractDate(msgBodyArray[12].substring(30).replace("\r","").replace("\n",""));	
	
	return true;
	
}


browser.tabs.query({
  active: true,
  currentWindow: true,
}).then(tabs => {
  let tabId = tabs[0].id;
  browser.messageDisplay.getDisplayedMessage(tabId).then((message) => {
	let msgId = message.id;
	var msgSender = message.author;
	if ((message.subject == "Anmeldebestätigung") && (message.author.includes("mensa.de"))) {
	
		browser.messages.getFull(msgId).then((msgFull) => {
			
			let icsBody = "";
			let msgBody = msgFull.parts[0].body;
			let msgBodyParsed = new parseBody(msgBody);

			// console.log(msgBodyParsed);
			
			icsBody += "BEGIN:VCALENDAR\n";
			icsBody += "VERSION:2.0\n";
			icsBody += "PRODID:https://www.kotori.de/mindfulics/\n";		
			icsBody += "METHOD:PUBLISH\n";
			icsBody += "BEGIN:VTIMEZONE\nTZID:Europe/Berlin\nBEGIN:STANDARD\nDTSTART:16011028T030000\nRRULE:FREQ=YEARLY;BYDAY=-1SU;BYMONTH=10\nTZOFFSETFROM:+0200\nTZOFFSETTO:+0100\nEND:STANDARD\nBEGIN:DAYLIGHT\nDTSTART:16010325T020000\nRRULE:FREQ=YEARLY;BYDAY=-1SU;BYMONTH=3\nTZOFFSETFROM:+0100\nTZOFFSETTO:+0200\nEND:DAYLIGHT\nEND:VTIMEZONE\n";
			icsBody += "BEGIN:VEVENT\n";
			icsBody += "UID:"+Date.now()+"@mensa.de\n";
			icsBody += 'ORGANIZER;CN="'+msgBodyParsed.propOrganizer+'":MAILTO:'+msgBodyParsed.propOrganizerMail+'\n';
			icsBody += "LOCATION:"+msgBodyParsed.propLocation+"\n";
			icsBody += "SUMMARY:"+msgBodyParsed.propSummary+"\n";
			icsBody += "DESCRIPTION:"+msgBodyParsed.propSummary+"\n";
			icsBody += "CLASS:PUBLIC\n";
			icsBody += "DTSTART;TZID=Europe/Berlin:"+msgBodyParsed.propStartDate+"\n";
			icsBody += "DTEND;TZID=Europe/Berlin:"+msgBodyParsed.propEndDate+"\n";
			icsBody += "DTSTAMP:"+msgBodyParsed.propDateCreated+"0000\n";
			icsBody += "END:VEVENT\n";
			icsBody += "END:VCALENDAR";

			// console.log(icsBody);

			var backgroundMessage = browser.runtime.sendMessage({
				payload: icsBody
			});
			//backgroundMessage.then(handleResponse, handleError);
			
							
			return true;
			
		});
	
	} else { document.body.textContent = "Nichts zum Parsen gefunden."; };
	
  });
});

