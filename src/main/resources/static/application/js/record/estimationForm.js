var estimationForm = (function() {
	//csrf token
	var csrfToken;
	//api path
	const API_PATH = "/api/change";
	var useCaseCount={
		
	};
	
	var updateUseCaseCount=function() {
		
	};
	
	var showUseCaseModal=function(event) {
		event.preventDefault();
		var requirementId=$(this).attr('id').split("_")[1];
		logging.log("Requirement ID: " + requirementId);
		$("#requirementId").val(requirementId);
		$("#useCaseModal").modal('show');
	};
	
	/**
	 * Initialize module
	 */
	var init = function() {
		//enable or disable logging
		logging.setLoggingSwitch(teh.shouldEnableLogging());
		//get csrf token
		csrfToken = $("input#csrf").val();
		//set toastr options
		toastr.options = getToastrOptions();
		
		$("button[id^='addUseCases_']").click(showUseCaseModal);
		
		logging.log("Estimation form initialized!!!");
	};

	return {
		init: init
	}
})();