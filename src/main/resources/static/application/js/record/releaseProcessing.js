var releaseProcessing = (function() {
	var csrfToken;
	var xpaths = {
		"releaseContent" : "div#releaseContent",
		"addOrEditReleaseRecordModal" : "#addOrEditReleaseRecordModal",
		"releaseRecordListPlaceholder" : "#releaseRecordListPlaceholder",
		"saveReleaseButton" : "button#saveRelease",
		"saveReleaseForm" : "form#saveReleaseForm",
		"releaseRecordTable" : "table#releaseRecordTable",
		"releaseRecordTableBody" : "tbody#releaseRecordTableBody",
		"releaseRecordListTemplate" : "#releaseRecordListTemplate",
		"editReleaseButtons" : "button[id^='editRelease_']",
		"deleteReleaseButtons" : "button[id^='deleteRelease_']",
		"deleteUserConfirmationModal" : "div#deleteUserConfirmationModal",
		"confirmDeleteReleaseRecordButton" : "button#confirmDeleteReleaseRecord",
		"deleteReleaseDeleteForm" : "form#deleteReleaseDeleteForm"
	};

	//DELETE Process
	
	var showDeleteModal=function(event) {
		event.preventDefault();
		var deleteButtonId=$(this).attr("id");
		var releaseId=deleteButtonId.split("_")[1];
		$("input#deleteAction_id").val(releaseId);
		$(xpaths["deleteUserConfirmationModal"]).modal("show");
	};
	
	var deleteReleaseRecord=function(event) {
		event.preventDefault();
		$(xpaths["deleteUserConfirmationModal"]).modal("hide");
		$(xpaths["releaseContent"]).block({ message: '<h5><i class="fa-solid fa-spinner fa-spin"></i> Deleting record...</h5>' });
		var releaseId=$(xpaths["deleteReleaseDeleteForm"]).serializeObject();
		apiHandling.processRequest("delete", "/api/release", csrfToken, releaseId)
			.done(data => deleteReleaseRecord_success(data))
			.catch(error => console.debug(error));
	}
	
	var deleteReleaseRecord_success=function(data) {
		$(xpaths["releaseContent"]).unblock();
		getReleaseList();
	};
	
	//Load List
	
	var getReleaseList = function() {
		//event.preventDefault();
		$(xpaths["releaseRecordTableBody"]).html($(xpaths["ReleaseRecordListPlaceholder"]).html());
		$(xpaths["releaseContent"]).block({ message: '<h5><i class="fa-solid fa-spinner fa-spin"></i> Just a moment...</h5>' });
		apiHandling.processRequest("get", "/api/release", csrfToken, null)
			.done(data => getReleaseList_success(data))
			.catch(error => console.debug(error));
	};

	var getReleaseList_success = function(releaseRecords) {
		console.debug(releaseRecords);
		populateDataTable(releaseRecords,
			xpaths["releaseRecordTable"],
			xpaths["releaseRecordTableBody"],
			xpaths["releaseRecordListTemplate"]);
		$(xpaths["releaseContent"]).unblock();
	};
	
	var populateDataTable=function(data,tableXPath,tableBodyXPath,templateXPath) {
		if($.fn.DataTable.isDataTable(tableXPath)) {
			$(tableXPath).DataTable().destroy();
		}
		$(tableBodyXPath).html("");
		$(templateXPath).tmpl(data).appendTo(tableBodyXPath);
		$(tableXPath).DataTable();
		$(xpaths["ReleaseContent"]).unblock();
	};
	
	//Add/Edit
	
	var saveRelease=function(event) {
		event.preventDefault();
		if($(xpaths["saveReleaseForm"]).validate()) {
			$(xpaths["addOrEditReleaseRecordModal"]).block({ message: '<h5><i class="fa-solid fa-spinner fa-spin"></i> Adding/updating record...</h5>' });
			$(xpaths["releaseContent"]).block({ message: '<h5><i class="fa-solid fa-spinner fa-spin"></i> Adding/updating record...</h5>' });
			var saveReleaseData=$(xpaths["saveReleaseForm"]).serializeObject();
			console.debug(saveReleaseData);
			apiHandling.processRequest("put", "/api/release", csrfToken, saveReleaseData)
				.done(data => saveRelease_success(data))
				.catch(error => saveRelease_failure(error,saveReleaseData));
		}
	};
	
	var saveRelease_success=function(Release) {
		console.debug(Release);
		toastr.success("Change Type Configuration record saved.");
		$(xpaths["saveReleaseForm"])[0].reset();
		$(xpaths["addOrEditReleaseRecordModal"]).unblock();
		$(xpaths["addOrEditReleaseRecordModal"]).modal("hide");
		getReleaseList();
	};
	
	var saveRelease_failure=function(error,saveReleaseData) {
		console.debug("here");
		console.debug(error);
		toastr.error("Functionality name '" + saveReleaseData.name + "' already exists.");
		$(xpaths["addOrEditReleaseRecordModal"]).unblock();
		$(xpaths["releaseContent"]).unblock();
		console.debug("here as well");
	};
	
	var showEditModal=function(event) {
		event.preventDefault();
		var editButtonId=$(this).attr("id");
		var releaseId=editButtonId.split("_")[1];
		apiHandling.processRequest("get", "/api/release/" + releaseId, csrfToken, null)
			.done(data => showEditModal_success(data))
			.catch(error => console.debug(error));
	};
	
	var showEditModal_success=function(releaseRecord) {
		$("input#id").val(releaseRecord.id);
		$("input#identifier").val(releaseRecord.identifier);
		$("input#name").val(releaseRecord.name);
		$(xpaths["addOrEditReleaseRecordModal"]).modal("show");
	};
	
	var resetAddRecordForm=function(event) {
		event.preventDefault();
		$("input#id").val(null);
		$(xpaths["saveReleaseForm"])[0].reset();
		$(xpaths["addOrEditReleaseRecordModal"]).modal("show");
	};

	var init = function() {
		$(xpaths["saveReleaseButton"]).click(saveRelease);
		$(xpaths["releaseContent"]).on("click",xpaths["editReleaseButtons"],showEditModal);
		$(xpaths["releaseContent"]).on("click",xpaths["deleteReleaseButtons"],showDeleteModal);
		$(xpaths["confirmDeleteReleaseRecordButton"]).click(deleteReleaseRecord);
		
		$("button#addReleaseRecordButton").on("click",resetAddRecordForm);
		
		csrfToken = $("input#csrf").val();
		getReleaseList();
		toastr.options = {
			"closeButton": true,
			"debug": false,
			"newestOnTop": true,
			"progressBar": true,
			"positionClass": "toast-top-right",
			"preventDuplicates": false,
			"onclick": null,
			"showDuration": "300",
			"hideDuration": "1000",
			"timeOut": "5000",
			"extendedTimeOut": "1000",
			"showEasing": "swing",
			"hideEasing": "linear",
			"showMethod": "fadeIn",
			"hideMethod": "fadeOut"
		}
	};

	return {
		init: init
	}
})();