var browser = window.browser.extension.getBackgroundPage().browser;

function saveOptions(e) {
	
	browser.storage.sync.set({
		numeric: document.querySelector("#remindernumeric").value,
		categorial: document.querySelector("#remindercategorial").value
	});
	
	document.getElementById("remindersavedspan").style.display = "inline";
	setTimeout(function(){ document.getElementById("remindersavedspan").style.display = "none"; }, 3000);
	
	e.preventDefault();
	
}

function restoreOptions() {

	var gettingItemNumeric = browser.storage.sync.get('numeric');
	
	gettingItemNumeric.then((res) => {
		
		document.querySelector("#remindernumeric").value = res.numeric || '30';
		
	});

	var gettingItemCategorial = browser.storage.sync.get('categorial');
	
	gettingItemCategorial.then((res) => {
		
		document.querySelector("#remindercategorial").value = res.categorial || 'i';
		
	});	
	
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);