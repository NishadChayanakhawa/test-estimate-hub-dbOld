var testTypeConfigurationProcessing = (function() {
	var csrfToken;
	var xpaths = {
		"testTypeConfigurationContent" : "div#testTypeConfigurationContent",
		"addOrEditTestTypeConfigurationRecordModal" : "#addOrEditTestTypeConfigurationRecordModal",
		"testTypeConfigurationRecordListPlaceholder" : "#testTypeConfigurationRecordListPlaceholder",
		"saveTestTypeConfigurationButton" : "button#saveTestTypeConfiguration",
		"saveTestTypeConfigurationForm" : "form#saveTestTypeConfigurationForm",
		"testTypeConfigurationRecordTable" : "table#testTypeConfigurationRecordTable",
		"testTypeConfigurationRecordTableBody" : "tbody#testTypeConfigurationRecordTableBody",
		"testTypeConfigurationRecordListTemplate" : "#testTypeConfigurationRecordListTemplate",
		"editTestTypeConfigurationButtons" : "button[id^='editTestTypeConfiguration_']",
		"deleteTestTypeConfigurationButtons" : "button[id^='deleteTestTypeConfiguration_']",
		"deleteUserConfirmationModal" : "div#deleteUserConfirmationModal",
		"confirmDeleteTestTypeConfigurationRecordButton" : "button#confirmDeleteTestTypeConfigurationRecord",
		"deleteTestTypeConfigurationDeleteForm" : "form#deleteTestTypeConfigurationDeleteForm"
	};

	//DELETE Process
	
	var showDeleteModal=function(event) {
		event.preventDefault();
		var deleteButtonId=$(this).attr("id");
		var testTypeConfigurationId=deleteButtonId.split("_")[1];
		$("input#deleteAction_id").val(testTypeConfigurationId);
		$(xpaths["deleteUserConfirmationModal"]).modal("show");
	};
	
	var deleteTestTypeConfigurationRecord=function(event) {
		event.preventDefault();
		$(xpaths["deleteUserConfirmationModal"]).modal("hide");
		$(xpaths["testTypeConfigurationContent"]).block({ message: '<h5><i class="fa-solid fa-spinner fa-spin"></i> Deleting record...</h5>' });
		var testTypeConfigurationId=$(xpaths["deleteTestTypeConfigurationDeleteForm"]).serializeObject();
		apiHandling.processRequest("delete", "/api/config/testType", csrfToken, testTypeConfigurationId)
			.done(data => deleteTestTypeConfigurationRecord_success(data))
			.catch(error => console.debug(error));
	}
	
	var deleteTestTypeConfigurationRecord_success=function(data) {
		$(xpaths["testTypeConfigurationContent"]).unblock();
		getTestTypeConfigurationList();
	};
	
	//Load List
	
	var getTestTypeConfigurationList = function() {
		//event.preventDefault();
		$(xpaths["testTypeConfigurationRecordTableBody"]).html($(xpaths["TestTypeConfigurationRecordListPlaceholder"]).html());
		$(xpaths["testTypeConfigurationContent"]).block({ message: '<h5><i class="fa-solid fa-spinner fa-spin"></i> Just a moment...</h5>' });
		apiHandling.processRequest("get", "/api/config/testType", csrfToken, null)
			.done(data => getTestTypeConfigurationList_success(data))
			.catch(error => console.debug(error));
	};

	var getTestTypeConfigurationList_success = function(testTypeConfigurationRecords) {
		console.debug(testTypeConfigurationRecords);
		populateDataTable(testTypeConfigurationRecords,
			xpaths["testTypeConfigurationRecordTable"],
			xpaths["testTypeConfigurationRecordTableBody"],
			xpaths["testTypeConfigurationRecordListTemplate"]);
		$(xpaths["testTypeConfigurationContent"]).unblock();
	};
	
	var populateDataTable=function(data,tableXPath,tableBodyXPath,templateXPath) {
		if($.fn.DataTable.isDataTable(tableXPath)) {
			$(tableXPath).DataTable().destroy();
		}
		$(tableBodyXPath).html("");
		$(templateXPath).tmpl(data).appendTo(tableBodyXPath);
		$(tableXPath).DataTable();
		$(xpaths["TestTypeConfigurationContent"]).unblock();
	};
	
	//Add/Edit
	
	var saveTestTypeConfiguration=function(event) {
		event.preventDefault();
		if($(xpaths["saveTestTypeConfigurationForm"]).validate()) {
			$(xpaths["addOrEditTestTypeConfigurationRecordModal"]).modal("hide");
			$(xpaths["testTypeConfigurationContent"]).block({ message: '<h5><i class="fa-solid fa-spinner fa-spin"></i> Adding/updating record...</h5>' });
			var saveTestTypeConfigurationData=$(xpaths["saveTestTypeConfigurationForm"]).serializeObject();
			console.debug(saveTestTypeConfigurationData);
			apiHandling.processRequest("put", "/api/config/testType", csrfToken, saveTestTypeConfigurationData)
				.done(data => saveTestTypeConfiguration_success(data))
				.catch(error => saveTestTypeConfiguration_failure(error,saveTestTypeConfigurationData));
		}
	};
	
	var saveTestTypeConfiguration_success=function(TestTypeConfiguration) {
		console.debug(TestTypeConfiguration);
		toastr.success("Change Type Configuration record saved.");
		$(xpaths["saveTestTypeConfigurationForm"])[0].reset();
		getTestTypeConfigurationList();
	};
	
	var saveTestTypeConfiguration_failure=function(error,saveTestTypeConfigurationData) {
		console.debug("here");
		console.debug(error);
		toastr.error("Functionality name '" + saveTestTypeConfigurationData.name + "' already exists.");
		$(xpaths["testTypeConfigurationContent"]).unblock();
		console.debug("here as well");
	};
	
	var showEditModal=function(event) {
		event.preventDefault();
		var editButtonId=$(this).attr("id");
		var testTypeConfigurationId=editButtonId.split("_")[1];
		apiHandling.processRequest("get", "/api/config/testType/" + testTypeConfigurationId, csrfToken, null)
			.done(data => showEditModal_success(data))
			.catch(error => console.debug(error));
	};
	
	var showEditModal_success=function(testTypeConfigurationRecord) {
		$("input#id").val(testTypeConfigurationRecord.id);
		$("input#name").val(testTypeConfigurationRecord.name);
		$("input#relativeTestCasePercentage").val(testTypeConfigurationRecord.relativeTestCasePercentage);
		$("input#reExecutionPercentage").val(testTypeConfigurationRecord.reExecutionPercentage);
		$("input#additionalCycleExecutionPercentage").val(testTypeConfigurationRecord.additionalCycleExecutionPercentage);
		$(xpaths["addOrEditTestTypeConfigurationRecordModal"]).modal("show");
	};
	
	var resetAddRecordForm=function(event) {
		event.preventDefault();
		$("input#id").val(null);
		$(xpaths["saveTestTypeConfigurationForm"])[0].reset();
		$(xpaths["addOrEditTestTypeConfigurationRecordModal"]).modal("show");
	};

	var init = function() {
		$(xpaths["saveTestTypeConfigurationButton"]).click(saveTestTypeConfiguration);
		$(xpaths["testTypeConfigurationContent"]).on("click",xpaths["editTestTypeConfigurationButtons"],showEditModal);
		$(xpaths["testTypeConfigurationContent"]).on("click",xpaths["deleteTestTypeConfigurationButtons"],showDeleteModal);
		$(xpaths["confirmDeleteTestTypeConfigurationRecordButton"]).click(deleteTestTypeConfigurationRecord);
		
		$("button#addTestTypeConfigurationRecordButton").on("click",resetAddRecordForm);
		
		csrfToken = $("input#csrf").val();
		getTestTypeConfigurationList();
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