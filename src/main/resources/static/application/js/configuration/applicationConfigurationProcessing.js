var applicationConfigurationProcessing = (function() {
	var csrfToken;
	var xpaths = {
		"applicationConfigurationContent" : "div#applicationConfigurationContent",
		"addOrEditApplicationConfigurationRecordModal" : "#addOrEditApplicationConfigurationRecordModal",
		"applicationConfigurationRecordListPlaceholder" : "#applicationConfigurationRecordListPlaceholder",
		"saveApplicationConfigurationButton" : "button#saveApplicationConfiguration",
		"saveApplicationConfigurationForm" : "form#saveApplicationConfigurationForm",
		"applicationConfigurationRecordTable" : "table#applicationConfigurationRecordTable",
		"applicationConfigurationRecordTableBody" : "tbody#applicationConfigurationRecordTableBody",
		"applicationConfigurationRecordListTemplate" : "#applicationConfigurationRecordListTemplate",
		"editApplicationConfigurationButtons" : "button[id^='editApplicationConfiguration_']",
		"deleteApplicationConfigurationButtons" : "button[id^='deleteApplicationConfiguration_']",
		"deleteUserConfirmationModal" : "div#deleteUserConfirmationModal",
		"confirmDeleteApplicationConfigurationRecordButton" : "button#confirmDeleteApplicationConfigurationRecord",
		"deleteApplicationConfigurationDeleteForm" : "form#deleteApplicationConfigurationDeleteForm"
	};

	//DELETE Process
	
	var showDeleteModal=function(event) {
		event.preventDefault();
		var deleteButtonId=$(this).attr("id");
		apiHandling.processRequest("get", "/api/config/application/" + deleteButtonId.split("_")[1], csrfToken, null)
			.done(data => showDeleteModal_success(data))
			.catch(error => console.debug(error));
	};
	
	var showDeleteModal_success=function(applicationConfigurationRecord) {
		$("input#deleteAction_id").val(applicationConfigurationRecord.id);
		$(xpaths["deleteUserConfirmationModal"]).modal("show");
	};
	
	var deleteApplicationConfigurationRecord=function(event) {
		event.preventDefault();
		$(xpaths["deleteUserConfirmationModal"]).modal("hide");
		$(xpaths["applicationConfigurationContent"]).block({ message: '<h5><i class="fa-solid fa-spinner fa-spin"></i> Deleting record...</h5>' });
		var applicationConfigurationId=$(xpaths["deleteApplicationConfigurationDeleteForm"]).serializeObject();
		apiHandling.processRequest("delete", "/api/config/application", csrfToken, applicationConfigurationId)
			.done(data => deleteApplicationConfigurationRecord_success(data))
			.catch(error => console.debug(error));
	}
	
	var deleteApplicationConfigurationRecord_success=function(data) {
		getApplicationConfigurationList();
		$(xpaths["applicationConfigurationContent"]).unblock();
	};
	
	//Load List
	
	var getApplicationConfigurationList = function() {
		//event.preventDefault();
		$(xpaths["applicationConfigurationRecordTableBody"]).html($(xpaths["applicationConfigurationRecordListPlaceholder"]).html());
		$(xpaths["applicationConfigurationContent"]).block({ message: '<h5><i class="fa-solid fa-spinner fa-spin"></i> Just a moment...</h5>' });
		apiHandling.processRequest("get", "/api/config/application", csrfToken, null)
			.done(data => getApplicationConfigurationList_success(data))
			.catch(error => console.debug(error));
	};

	var getApplicationConfigurationList_success = function(applicationConfigurationRecords) {
		console.debug(applicationConfigurationRecords);
		populateDataTable(applicationConfigurationRecords,
			xpaths["applicationConfigurationRecordTable"],
			xpaths["applicationConfigurationRecordTableBody"],
			xpaths["applicationConfigurationRecordListTemplate"]);
		$(xpaths["applicationConfigurationContent"]).unblock();
	};
	
	var populateDataTable=function(data,tableXPath,tableBodyXPath,templateXPath) {
		if($.fn.DataTable.isDataTable(tableXPath)) {
			$(tableXPath).DataTable().destroy();
		}
		$(tableBodyXPath).html("");
		$(templateXPath).tmpl(data).appendTo(tableBodyXPath);
		$(tableXPath).DataTable();
		$(xpaths["applicationConfigurationContent"]).unblock();
	};
	
	//Add/Edit
	
	var saveApplicationConfiguration=function(event) {
		event.preventDefault();
		if($(xpaths["saveApplicationConfigurationForm"]).validate()) {
			$(xpaths["addOrEditApplicationConfigurationRecordModal"]).block({ message: '<h5><i class="fa-solid fa-spinner fa-spin"></i> Adding/updating record...</h5>' });
			$(xpaths["applicationConfigurationContent"]).block({ message: '<h5><i class="fa-solid fa-spinner fa-spin"></i> Adding/updating record...</h5>' });
			var saveApplicationConfigurationData=$(xpaths["saveApplicationConfigurationForm"]).serializeObject();
			console.debug(saveApplicationConfigurationData);
			apiHandling.processRequest("put", "/api/config/application", csrfToken, saveApplicationConfigurationData)
				.done(data => saveApplicationConfiguration_success(data))
				.catch(error => saveApplicationConfiguration_error(error,saveApplicationConfigurationData));
		}
	};
	
	var saveApplicationConfiguration_success=function(applicationConfiguration) {
		console.debug(applicationConfiguration);
		toastr.success("Application Configuration record saved.");
		$(xpaths["addOrEditApplicationConfigurationRecordModal"]).unblock();
		$(xpaths["addOrEditApplicationConfigurationRecordModal"]).modal("hide");
		$(xpaths["saveApplicationConfigurationForm"])[0].reset();
		getApplicationConfigurationList();
	};
	
	var saveApplicationConfiguration_error=function(error,saveApplicationConfigurationData) {
		$(xpaths["addOrEditApplicationConfigurationRecordModal"]).unblock();
		$(xpaths["applicationConfigurationContent"]).unblock();
		toastr.error("Configuration for '" + saveApplicationConfigurationData.applicationName + 
		'-' + saveApplicationConfigurationData.moduleName + '-' + saveApplicationConfigurationData.subModuleName + "' already exists.");
	}
	
	var showEditModal=function(event) {
		event.preventDefault();
		var editButtonId=$(this).attr("id");
		apiHandling.processRequest("get", "/api/config/application/" + editButtonId.split("_")[1], csrfToken, null)
			.done(data => showEditModal_success(data))
			.catch(error => console.debug(error));
	};
	
	var showEditModal_success=function(applicationConfigurationRecord) {
		$("input#id").val(applicationConfigurationRecord.id);
		$("input#application").val(applicationConfigurationRecord.applicationName);
		$("input#module").val(applicationConfigurationRecord.moduleName);
		$("input#subModule").val(applicationConfigurationRecord.subModuleName);
		$("input#baseTestCaseCountFactor").val(applicationConfigurationRecord.baseTestCaseCountFactor);
		$("input#complexity_" + applicationConfigurationRecord.complexityCode).attr("checked",true);
		$(xpaths["addOrEditApplicationConfigurationRecordModal"]).modal("show");
	};
	
	var getApplicationConfigurationId=function(rawId) {
		console.debug(rawId);
		var applicationConfigurationId={
			"applicationName" : rawId.split("_")[1],
			"moduleName" : rawId.split("_")[2],
			"subModuleName" : rawId.split("_")[3]
		};
		return applicationConfigurationId;
	};
	
	var resetAddRecordForm=function(event) {
		event.preventDefault();
		$("input#application").attr("disabled",false);
		$("input#application").attr("readOnly",false);
		$("input#module").attr("disabled",false);
		$("input#module").attr("readOnly",false);
		$("input#subModule").attr("disabled",false);
		$("input#subModule").attr("readOnly",false);
		$(xpaths["saveApplicationConfigurationForm"])[0].reset();
		$(xpaths["addOrEditApplicationConfigurationRecordModal"]).modal("show");
	};

	var init = function() {
		$(xpaths["saveApplicationConfigurationButton"]).click(saveApplicationConfiguration);
		$(xpaths["applicationConfigurationContent"]).on("click",xpaths["editApplicationConfigurationButtons"],showEditModal);
		$(xpaths["applicationConfigurationContent"]).on("click",xpaths["deleteApplicationConfigurationButtons"],showDeleteModal);
		$(xpaths["confirmDeleteApplicationConfigurationRecordButton"]).click(deleteApplicationConfigurationRecord);
		
		$("button#addApplicationConfigurationRecordButton").on("click",resetAddRecordForm);
		
		csrfToken = $("input#csrf").val();
		getApplicationConfigurationList();
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