var changeProcessing = (function() {
	var csrfToken;
	var xpaths = {
		"changeContent" : "div#changeContent",
		"addOrEditChangeRecordModal" : "#addOrEditChangeRecordModal",
		"changeRecordListPlaceholder" : "#changeRecordListPlaceholder",
		"saveChangeButton" : "button#saveChange",
		"saveChangeForm" : "form#saveChangeForm",
		"changeRecordTable" : "table#changeRecordTable",
		"changeRecordTableBody" : "tbody#changeRecordTableBody",
		"changeRecordListTemplate" : "#changeRecordListTemplate",
		"editChangeButtons" : "button[id^='editChange_']",
		"deleteChangeButtons" : "button[id^='deleteChange_']",
		"deleteUserConfirmationModal" : "div#deleteUserConfirmationModal",
		"confirmDeleteChangeRecordButton" : "button#confirmDeleteChangeRecord",
		"deleteChangeDeleteForm" : "form#deleteChangeDeleteForm",
		"startDate" : "input#startDate",
		"endDate" : "input#endDate",
		"calculateEstimationButton" : "button#calculateEstimationButton",
		"calculateEstimationForm" : "form#calculateEstimationForm",
		"addRequirementButton" : "button#addRequirementButton",
		"requirementFormTemplate" : "#requirementFormTemplate",
		"requirementFormsTableBody" : "tbody#requirementFormsTableBody",
		"deleteRequirementButtons" : "button[id^='deleteRequirement_']",
		"requirementForms" : "tr[id^='requirementForm_']"
	};
	
	var requirementIdData={
		'id' : 1
	};
	
	var deleteRequirementForm=function(event) {
		event.preventDefault();
		console.debug("deleting Requirement");
		$("tr#requirementForm_" + $(this).attr("id").split("_")[1]).remove();
	};
	
	var addRequirementForm=function(event) {
		event.preventDefault();
		console.debug("addingRequirement");
		requirementIdData['id']=requirementIdData['id']+1;
		console.debug(requirementIdData);
		$(xpaths["requirementFormTemplate"]).tmpl(requirementIdData).appendTo($(xpaths["requirementFormsTableBody"]));
	};
	
	var updateChangeEndDateMinValue=function(event) {
		event.preventDefault();
		var startDateSelected=$(xpaths["startDate"]).val().split("-");
		var formattedStartDate=new Date(startDateSelected[0],startDateSelected[1]-1,startDateSelected[2]);
		console.debug();
		$(xpaths["endDate"]).val("");
		$(xpaths["endDate"]).datepicker("destroy");
		$(xpaths["endDate"]).datepicker({
			dateFormat: "yy-mm-dd",
			minDate: formattedStartDate
		});
	};

	//DELETE Process
	
	var showDeleteModal=function(event) {
		event.preventDefault();
		var deleteButtonId=$(this).attr("id");
		var changeId=deleteButtonId.split("_")[1];
		$("input#deleteAction_id").val(changeId);
		$(xpaths["deleteUserConfirmationModal"]).modal("show");
	};
	
	var deleteChangeRecord=function(event) {
		event.preventDefault();
		$(xpaths["deleteUserConfirmationModal"]).modal("hide");
		$(xpaths["changeContent"]).block({ message: '<h5><i class="fa-solid fa-spinner fa-spin"></i> Deleting record...</h5>' });
		var changeId=$(xpaths["deleteChangeDeleteForm"]).serializeObject();
		apiHandling.processRequest("delete", "/api/change", csrfToken, changeId)
			.done(data => deleteChangeRecord_success(data))
			.catch(error => console.debug(error));
	}
	
	var deleteChangeRecord_success=function(data) {
		$(xpaths["changeContent"]).unblock();
		getChangeList();
	};
	
	//Load List
	
	var getChangeList = function() {
		//event.preventDefault();
		$(xpaths["changeRecordTableBody"]).html($(xpaths["ChangeRecordListPlaceholder"]).html());
		$(xpaths["changeContent"]).block({ message: '<h5><i class="fa-solid fa-spinner fa-spin"></i> Just a moment...</h5>' });
		apiHandling.processRequest("get", "/api/change", csrfToken, null)
			.done(data => getChangeList_success(data))
			.catch(error => console.debug(error));
	};

	var getChangeList_success = function(changeRecords) {
		console.debug(changeRecords);
		populateDataTable(changeRecords,
			xpaths["changeRecordTable"],
			xpaths["changeRecordTableBody"],
			xpaths["changeRecordListTemplate"]);
		$(xpaths["changeContent"]).unblock();
	};
	
	var populateDataTable=function(data,tableXPath,tableBodyXPath,templateXPath) {
		if($.fn.DataTable.isDataTable(tableXPath)) {
			$(tableXPath).DataTable().destroy();
		}
		$(tableBodyXPath).html("");
		$(templateXPath).tmpl(data).appendTo(tableBodyXPath);
		$(tableXPath).DataTable();
		$(xpaths["ChangeContent"]).unblock();
	};
	
	//Add/Edit
	
	var saveChange=function(event) {
		event.preventDefault();
		console.debug("Saving Change");
		var changeData=$(xpaths["saveChangeForm"]).serializeObject();
		changeData['requirements']=[];
		console.debug(changeData);
		$(xpaths["requirementForms"]).each(function() {
			console.debug($(this).attr('id'));
			var requirementData=$(this).serializeObject()
			changeData['requirements'].push(requirementData);
			console.debug(changeData);
		})
		changeData['identifier']=$("input#changeIdentifier").val();
		changeData['id']=$("input#id").val();
		delete changeData['complexityCode'];
		delete changeData['description'];
		if($(xpaths["saveChangeForm"]).validate()) {
			$(xpaths["addOrEditChangeRecordModal"]).block({ message: '<h5><i class="fa-solid fa-spinner fa-spin"></i> Adding/updating record...</h5>' });
			$(xpaths["changeContent"]).block({ message: '<h5><i class="fa-solid fa-spinner fa-spin"></i> Adding/updating record...</h5>' });
			console.debug(changeData);
			apiHandling.processRequest("put", "/api/change", csrfToken, changeData)
				.done(data => saveChange_success(data))
				.catch(error => saveChange_failure(error,changeData));
		}
	};
	
	var saveChange_success=function(Change) {
		console.debug(Change);
		toastr.success("Change Type Configuration record saved.");
		$(xpaths["saveChangeForm"])[0].reset();
		$(xpaths["addOrEditChangeRecordModal"]).unblock();
		$(xpaths["addOrEditChangeRecordModal"]).modal("hide");
		getChangeList();
	};
	
	var saveChange_failure=function(error,saveChangeData) {
		console.debug("here");
		console.debug(error);
		toastr.error("Functionality name '" + saveChangeData.name + "' already exists.");
		$(xpaths["addOrEditChangeRecordModal"]).unblock();
		$(xpaths["changeContent"]).unblock();
		console.debug("here as well");
	};
	
	var showEditModal=function(event) {
		event.preventDefault();
		var editButtonId=$(this).attr("id");
		var changeId=editButtonId.split("_")[1];
		apiHandling.processRequest("get", "/api/change/" + changeId, csrfToken, null)
			.done(data => showEditModal_success(data))
			.catch(error => console.debug(error));
	};
	
	var showEditModal_success=function(changeRecord) {
		resetAddRecordForm();
		$("input#id").val(changeRecord.id);
		$("input#status").val(changeRecord.statusCode);
		$("select#releaseId").val(changeRecord.releaseId);
		$("input#changeIdentifier").val(changeRecord.identifier);
		$("input#changeName").val(changeRecord.name);
		$("select#changeTypeId").val(changeRecord.changeTypeId);
		$("input#startDate").val(changeRecord.startDate);
		$("input#endDate").val(changeRecord.endDate);
		
		$(changeRecord.requirements).each(function(i,requirement) {
			if(i>0) {
				$(xpaths["addRequirementButton"]).click();
			}
			$("input#id_" + (i+1)).val(requirement.id);
			$("input#identifier_" + (i+1)).val(requirement.identifier);
			$("input#description_" + (i+1)).val(requirement.description);
			$("select#complexityCode_" + (i+1)).val(requirement.complexityCode);
			console.debug(requirement);
		});
		
		$("input#identifier").val(changeRecord.identifier);
		$("input#name").val(changeRecord.name);
		$(xpaths["addOrEditChangeRecordModal"]).modal("show");
	};
	
	var resetAddRecordForm=function(event) {
		if(event!=null) {
			event.preventDefault();	
		}
		$("input#id").val(null);
		$(xpaths["saveChangeForm"])[0].reset();
		$("tr[id^='requirementForm_']").not("tr#requirementForm_1").remove();
		requirementIdData['id']=1;
		$("input#status").val("CREATED");
		$(xpaths["addOrEditChangeRecordModal"]).modal("show");
	};

	var init = function() {
		//$(xpaths["saveChangeButton"]).click(saveChange);
		$(xpaths["saveChangeForm"]).submit(saveChange);
		$(xpaths["saveChangeButton"]).click(saveChange);
		$(xpaths["requirementFormsTableBody"]).on("submit",xpaths["requirementForms"],saveChange);
		
		$(xpaths["changeContent"]).on("click",xpaths["editChangeButtons"],showEditModal);
		$(xpaths["changeContent"]).on("click",xpaths["deleteChangeButtons"],showDeleteModal);
		$(xpaths["confirmDeleteChangeRecordButton"]).click(deleteChangeRecord);
		
		$("button#addChangeRecordButton").on("click",resetAddRecordForm);
		
		$(xpaths["addRequirementButton"]).click(addRequirementForm);
		$(xpaths["requirementFormsTableBody"]).on("click",xpaths["deleteRequirementButtons"],deleteRequirementForm);
		
		$(xpaths["startDate"]).datepicker({
			dateFormat: "yy-mm-dd"
		});
		$(xpaths["endDate"]).datepicker({
			dateFormat: "yy-mm-dd"
		});
		$(xpaths["startDate"]).change(updateChangeEndDateMinValue);
		//$(xpaths["calculateEstimationForm"]).submit(calculateEstimation);
		
		csrfToken = $("input#csrf").val();
		getChangeList();
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