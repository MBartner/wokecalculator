
function parse(str) {
	var ary = str.split(" ");
	var mon = "";
	switch(ary[1]) {
		case "Jan":
			mon = "01";
			break;
		case "Feb":
			mon = "02";
			break;
		case "Mar":
			mon = "03";
			break;
		case "Apr":
			mon = "04";
			break;
		case "May":
			mon = "05";
			break;
		case "Jun":
			mon = "06";
			break;
		case "Jul":
			mon = "07";
			break;
		case "Aug":
			mon = "08";
			break;
		case "Sep":
			mon = "09";
			break;
		case "Oct":
			mon = "10";
			break;
		case "Nov":
			mon = "11";
			break;
		case "Dec":
			mon = "12";
			break;
	}
	return ary[5] + "-" + mon + "-" + ary[2];
}

module.exports = {
	parse:parse
}