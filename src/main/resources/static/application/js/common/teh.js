var teh = (function() {
	var shouldEnableLogging = function() {
		return "@spring.profiles.active@" != "prod"
	};

	var processUnexpectedError = function(error) {
		toastr.error("<b><u>Unexpected error</u></b>: " + error.responseJSON.path + ' ' + error.responseJSON.error + "<br><br><b>Please report this issue to development team.</b>");
	};

	var populateDataTable = function(data, tableXPath, tableBodyXPath, templateXPath) {
		if ($.fn.DataTable.isDataTable(tableXPath)) {
			$(tableXPath).DataTable().destroy();
		}
		$(tableBodyXPath).html("");
		$(templateXPath).tmpl(data).appendTo(tableBodyXPath);
		$(tableXPath).DataTable();
	};

	var updateEditForm = function(editModalXPath, data) {
		$.each(data, function(key, value) {
			logging.log("Processing key " + key);
			logging.log($(editModalXPath).children("input#" + key));
			$("input#" + key).val(value);
		});
	};

	var showSaveSuccessMessage = function(recordType, recordIdentifier) {
		toastr.success(recordType + " '" + recordIdentifier + "' saved successfully");
	}

	var convertToProperCase = function(camelCaseText) {
		var text = camelCaseText;
		var result = text.replace(/([A-Z])/g, " $1");
		var finalResult = result.charAt(0).toUpperCase() + result.slice(1);
		return finalResult;
	}

	var processSaveApiErrors = function(errorDetails) {
		$(".is-invalid").removeClass("is-invalid");
		$.each(errorDetails, function(i, value) {
			var element = value.split(" ")[0];
			logging.log(element);
			var elementIds = element.split("-");
			$.each(elementIds, function(elementIdIndex, elementId) {
				logging.log(i + ":" + elementIdIndex + ":" + value + ":" + elementId);
				$("#" + elementId).addClass("is-invalid");
			});
			toastr.error(value.replace(element, convertToProperCase(element)));
		});
	};

	var onModalDismiss = function(formXPath) {
		logging.log("Dismissed modal");
		$(".is-invalid").removeClass("is-invalid");
		$(formXPath)[0].reset();
	};

	return {
		shouldEnableLogging: shouldEnableLogging,
		processUnexpectedError: processUnexpectedError,
		populateDataTable: populateDataTable,
		showSaveSuccessMessage: showSaveSuccessMessage,
		processSaveApiErrors: processSaveApiErrors,
		onModalDismiss: onModalDismiss,
		updateEditForm : updateEditForm
	}
})();