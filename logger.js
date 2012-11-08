exports.info = function(msg) {
  console.log(getMeta() + msg);
}

exports.error = function(msg) {
  console.error(getMeta() + msg);
}

function getMeta() {
	return '[' + formatTime(new Date()) + '] ';
}

function formatTime(currentTime) {
  var year = currentTime.getFullYear();
  var mon = currentTime.getMonth() + 1;
  var date = currentTime.getDate();
  var hour = currentTime.getHours();
  var min = currentTime.getMinutes();
  var sec = currentTime.getSeconds();
  var millis = currentTime.getMilliseconds();
  var formattedDate = date + '/' + mon + '/' + year;
  
  if (min < 10) {
	min = '0' + min;
  }
  
  if (sec < 10) {
	sec = '0' + sec;
  }
  
  if (millis < 100) {
    if (millis < 10) {
	  millis = '00' + millis;
	} else {
		millis = '0' + millis;
	}
  }
  
  return formattedDate + ' ' + hour + ":" + min + ":" + sec + '.' + millis;
}