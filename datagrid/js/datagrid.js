function DataGrid(tInfo) {

	var dataArray = tInfo.data;
	var element = tInfo.rootElement;
	var columnArray = tInfo.columns;
	var fDraw = tInfo.onDraw;

	var validkeys = new Array();
	for (var i = 0; i < columnArray.length; i++) {
		validkeys.push(columnArray[i].dataName);
	}
	if (fDraw !== undefined) {
		var f = fDraw.bind(this);
		f(this);
	}

	var columns = columnArray.length;
	var rows = dataArray.length;

	var keySet = Object.keys(dataArray[0]);
	var fieldCount = Object.keys(dataArray[0]).length;

	var fieldsArray = new Array(fieldCount);
	var newArray = new Array(fieldCount);
	var flag = new Array();
	var bg = new Array();
	bg.push(1);
	for (var i = 1; i <fieldCount; i++) {
		bg.push(0);
	}

	for (var c = 0; c < fieldCount; c++) {
		fieldsArray[c] = new Array(rows);
		for (var d = 0; d < rows; d++) {
			fieldsArray[c][d] = dataArray[d][keySet[c]];
		}
	}

	var dumbArray = new Array(rows);
	for (var d = 0; d < rows; d++) {
		dumbArray[d] = new Array(fieldCount);
		for (var c = 0; c < fieldCount; c++) {
			dumbArray[d][c] = dataArray[d][keySet[c]];
		}
	}
	dumbArray.sort(function(a, b) {
		return (a[0] < b[0] ? -1 : (a[0] > b[0] ? 1 : 0));
	});

	var draw = function() {
		var mTable = document.createElement('table');
		var tHead = mTable.createTHead();
		var row = tHead.insertRow(0);
		var cell = new Array(columns);
		var width;
		var wd;

		for (var i = 0; i < columns; i++) {
			if (i == 0) {
				flag.push(true);
			} else {
				flag.push(false);
			}
			cell[i] = row.insertCell(i);
			cell[i].addEventListener("click", sortWrapper(i), false);
			cell[i].className = "headClass";
			cell[i].innerHTML = columnArray[i].name;
			width = columnArray[i].width;
			width = width + "px";
			wd = "width:" + width + ";text-align:" + columnArray[i].align;
			cell[i].setAttribute("style", wd);
			cell[i].setAttribute("title", "Sort by " + columnArray[i].name);
		}

		for (var j = 1; j <= rows; j++) {
			var row = mTable.insertRow(j);
			var z = 0;
			for (var i = 0; i < columns; i++) {
				var key = 0;
				while (columnArray[i].dataName !== keySet[key])
					key++;
				var cell = row.insertCell(z);
				
				if (bg[key] === 1) {
					cell.className = "bgClass";
				} else
					cell.className = "cellClass";
				cell.innerHTML = dumbArray[j - 1][key];
				cell.style.textAlign = columnArray[i].align;
				width = columnArray[i].width;
				width = width + "px";
				wd = "width:" + width + ";text-align:" + columnArray[i].align;
				cell.setAttribute("style", wd);
				z++;
			}
		}

		element.appendChild(mTable);
	}

	draw();

	function sortWrapper(i) {
		return function() {
			cSort(validkeys[i], i);
		}
	}

	function cSort(key, car) {
		var man = 0;
		for (var i = 0; i < fieldCount; i++) {
			if (keySet[i] == key)
				break;
			man++;
		}
		for (var ct = 0; ct < fieldCount; ct++) {
			if (ct == man) {
				bg[ct] = 1;
			} else {
				bg[ct] = 0;
			}
		}

		if (flag[car] === false) {
			dumbArray.sort(function(a, b) {
				return (a[man] < b[man] ? -1 : (a[man] > b[man] ? 1 : 0));
			});
			flag[car] = true;
		} else {
			dumbArray.sort(function(a, b) {
				return (a[man] > b[man] ? -1 : (a[man] < b[man] ? 1 : 0));
			});
			flag[car] = false;
		}

		element.innerHTML = "";
		draw();
	}

	this.destroy = function() {
		element.innerHTML = "";
	}

}