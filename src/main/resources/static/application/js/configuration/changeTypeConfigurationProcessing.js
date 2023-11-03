var changeTypeConfigurationProcessing = (function() {
	var csrfToken;
	var xpaths = {
		"changeTypeConfigurationContent" : "div#changeTypeConfigurationContent",
		"addOrEditChangeTypeConfigurationRecordModal" : "#addOrEditChangeTypeConfigurationRecordModal",
		"changeTypeConfigurationRecordListPlaceholder" : "#changeTypeConfigurationRecordListPlaceholder",
		"saveChangeTypeConfigurationButton" : "button#saveChangeTypeConfiguration",
		"saveChangeTypeConfigurationForm" : "form#saveChangeTypeConfigurationForm",
		"changeTypeConfigurationRecordTable" : "table#changeTypeConfigurationRecordTable",
		"changeTypeConfigurationRecordTableBody" : "tbody#changeTypeConfigurationRecordTableBody",
		"changeTypeConfigurationRecordListTemplate" : "#changeTypeConfigurationRecordListTemplate",
		"editChangeTypeConfigurationButtons" : "button[id^='editChangeTypeConfiguration_']",
		"deleteChangeTypeConfigurationButtons" : "button[id^='deleteChangeTypeConfiguration_']",
		"deleteUserConfirmationModal" : "div#deleteUserConfirmationModal",
		"confirmDeleteChangeTypeConfigurationRecordButton" : "button#confirmDeleteChangeTypeConfigurationRecord",
		"deleteChangeTypeConfigurationDeleteForm" : "form#deleteChangeTypeConfigurationDeleteForm"
	};

	//DELETE Process
	
	var showDeleteModal=function(event) {
		event.preventDefault();
		var deleteButtonId=$(this).attr("id");
		var changeTypeConfigurationId=deleteButtonId.split("_")[1];
		$("input#deleteAction_id").val(changeTypeConfigurationId);
		$(xpaths["deleteUserConfirmationModal"]).modal("show");
	};
	
	var deleteChangeTypeConfigurationRecord=function(event) {
		event.preventDefault();
		$(xpaths["deleteUserConfirmationModal"]).modal("hide");
		$(xpaths["changeTypeConfigurationContent"]).block({ message: '<h5><i class="fa-solid fa-spinner fa-spin"></i> Deleting record...</h5>' });
		var changeTypeConfigurationId=$(xpaths["deleteChangeTypeConfigurationDeleteForm"]).serializeObject();
		apiHandling.processRequest("delete", "/api/config/changeType", csrfToken, changeTypeConfigurationId)
			.done(data => deleteChangeTypeConfigurationRecord_success(data))
			.catch(error => console.debug(error));
	}
	
	var deleteChangeTypeConfigurationRecord_success=function(data) {
		$(xpaths["changeTypeConfigurationContent"]).unblock();
		getChangeTypeConfigurationList();
	};
	
	//Load List
	
	var getChangeTypeConfigurationList = function() {
		//event.preventDefault();
		$(xpaths["changeTypeConfigurationRecordTableBody"]).html($(xpaths["ChangeTypeConfigurationRecordListPlaceholder"]).html());
		$(xpaths["changeTypeConfigurationContent"]).block({ message: '<h5><i class="fa-solid fa-spinner fa-spin"></i> Just a moment...</h5>' });
		apiHandling.processRequest("get", "/api/config/changeType", csrfToken, null)
			.done(data => getChangeTypeConfigurationList_success(data))
			.catch(error => console.debug(error));
	};

	var getChangeTypeConfigurationList_success = function(changeTypeConfigurationRecords) {
		console.debug(changeTypeConfigurationRecords);
		populateDataTable(changeTypeConfigurationRecords,
			xpaths["changeTypeConfigurationRecordTable"],
			xpaths["changeTypeConfigurationRecordTableBody"],
			xpaths["changeTypeConfigurationRecordListTemplate"]);
		$(xpaths["changeTypeConfigurationContent"]).unblock();
	};
	
	var populateDataTable=function(data,tableXPath,tableBodyXPath,templateXPath) {
		if($.fn.DataTable.isDataTable(tableXPath)) {
			$(tableXPath).DataTable().destroy();
		}
		$(tableBodyXPath).html("");
		$(templateXPath).tmpl(data).appendTo(tableBodyXPath);
		$(tableXPath).DataTable();
		$(xpaths["ChangeTypeConfigurationContent"]).unblock();
	};
	
	//Add/Edit
	
	var saveChangeTypeConfiguration=function(event) {
		event.preventDefault();
		if($(xpaths["saveChangeTypeConfigurationForm"]).validate()) {
			$(xpaths["addOrEditChangeTypeConfigurationRecordModal"]).modal("hide");
			$(xpaths["changeTypeConfigurationContent"]).block({ message: '<h5><i class="fa-solid fa-spinner fa-spin"></i> Adding/updating record...</h5>' });
			var saveChangeTypeConfigurationData=$(xpaths["saveChangeTypeConfigurationForm"]).serializeObject();
			console.debug(saveChangeTypeConfigurationData);
			apiHandling.processRequest("put", "/api/config/changeType", csrfToken, saveChangeTypeConfigurationData)
				.done(data => saveChangeTypeConfiguration_success(data))
				.catch(error => saveChangeTypeConfiguration_failure(error,saveChangeTypeConfigurationData));
		}
	};
	
	var saveChangeTypeConfiguration_success=function(ChangeTypeConfiguration) {
		console.debug(ChangeTypeConfiguration);
		toastr.success("Change Type Configuration record saved.");
		$(xpaths["saveChangeTypeConfigurationForm"])[0].reset();
		getChangeTypeConfigurationList();
	};
	
	var saveChangeTypeConfiguration_failure=function(error,saveChangeTypeConfigurationData) {
		console.debug("here");
		console.debug(error);
		toastr.error("Functionality name '" + saveChangeTypeConfigurationData.name + "' already exists.");
		$(xpaths["changeTypeConfigurationContent"]).unblock();
		console.debug("here as well");
	};
	
	var showEditModal=function(event) {
		event.preventDefault();
		var editButtonId=$(this).attr("id");
		var changeTypeConfigurationId=editButtonId.split("_")[1];
		apiHandling.processRequest("get", "/api/config/changeType/" + changeTypeConfigurationId, csrfToken, null)
			.done(data => showEditModal_success(data))
			.catch(error => console.debug(error));
	};
	
	var showEditModal_success=function(changeTypeConfigurationRecord) {
		$("input#id").val(changeTypeConfigurationRecord.id);
		$("input#name").val(changeTypeConfigurationRecord.name);
		$("input#testCaseCountModifier").val(changeTypeConfigurationRecord.testCaseCountModifier);
		$("input#testStrategyPercentage").val(changeTypeConfigurationRecord.testStrategyPercentage);
		$("input#testPlanningPercentage").val(changeTypeConfigurationRecord.testPlanningPercentage);
		$("input#managementUpliftPercentage").val(changeTypeConfigurationRecord.managementUpliftPercentage);
		$(xpaths["addOrEditChangeTypeConfigurationRecordModal"]).modal("show");
	};
	
	var resetAddRecordForm=function(event) {
		event.preventDefault();
		$("input#id").val(null);
		$(xpaths["saveChangeTypeConfigurationForm"])[0].reset();
		$(xpaths["addOrEditChangeTypeConfigurationRecordModal"]).modal("show");
	};

	var init = function() {
		$(xpaths["saveChangeTypeConfigurationButton"]).click(saveChangeTypeConfiguration);
		$(xpaths["changeTypeConfigurationContent"]).on("click",xpaths["editChangeTypeConfigurationButtons"],showEditModal);
		$(xpaths["changeTypeConfigurationContent"]).on("click",xpaths["deleteChangeTypeConfigurationButtons"],showDeleteModal);
		$(xpaths["confirmDeleteChangeTypeConfigurationRecordButton"]).click(deleteChangeTypeConfigurationRecord);
		
		$("button#addChangeTypeConfigurationRecordButton").on("click",resetAddRecordForm);
		
		csrfToken = $("input#csrf").val();
		getChangeTypeConfigurationList();
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