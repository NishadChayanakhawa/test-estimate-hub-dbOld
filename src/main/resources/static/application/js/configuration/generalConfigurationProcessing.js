var generalConfigurationProcessing = (function() {
	var csrfToken;
	var xpaths = {
		"saveGeneralConfigurationButton" : "button#saveGeneralConfigurationButton",
		"generalConfigurationForm" : "form#generalConfigurationForm",
		"complexityWeightagePercentageForTestDataPreparation" : "input[name='complexityWeightagePercentageForTestDataPreparation']",
		"complexityWeightagePercentageForTestConfiguration" : "input[name='complexityWeightagePercentageForTestConfiguration']",
		"complexityWeightagePercentageForTestValidation" : "input[name='complexityWeightagePercentageForTestValidation']"
	};
	
	var saveGeneralConfiguration=function(event) {
		event.preventDefault();
		if($(xpaths["generalConfigurationForm"]).validate()) {
			//check % distribution
			var testDataWeightage=parseFloat($(xpaths["complexityWeightagePercentageForTestDataPreparation"]).val());
			var testConfigWeightage=parseFloat($(xpaths["complexityWeightagePercentageForTestConfiguration"]).val());
			var testValidationWeightage=parseFloat($(xpaths["complexityWeightagePercentageForTestValidation"]).val());
			
			if((testDataWeightage+testConfigWeightage+testValidationWeightage)!=100.0) {
				console.debug(testDataWeightage);
				console.debug(testConfigWeightage);
				console.debug(testValidationWeightage);
				console.debug(testValidationWeightage);
				if(!$(xpaths["complexityWeightagePercentageForTestDataPreparation"]).hasClass("is-invalid")) {
					$(xpaths["complexityWeightagePercentageForTestDataPreparation"]).addClass("is-invalid");
				}
				if(!$(xpaths["complexityWeightagePercentageForTestConfiguration"]).hasClass("is-invalid")) {
					$(xpaths["complexityWeightagePercentageForTestConfiguration"]).addClass("is-invalid");
				}
				if(!$(xpaths["complexityWeightagePercentageForTestValidation"]).hasClass("is-invalid")) {
					$(xpaths["complexityWeightagePercentageForTestValidation"]).addClass("is-invalid");
				}
				toastr.error('Please ensure % weightage add up to 100.0%.');
			} else {
				apiHandling.processRequest("put", "/api/config/general", csrfToken, $(xpaths["generalConfigurationForm"]).serializeObject())
					.done(data => saveGeneralConfiguration_success(data))
					.catch(error => console.debug(error));
			}	
		}
	}
	
	var saveGeneralConfiguration_success=function(data) {
		console.debug(data);
		location.reload(true);
	}

	var init = function() {
		//$(xpaths["saveTestTypeConfigurationButton"]).click(saveTestTypeConfiguration);
		//$(xpaths["testTypeConfigurationContent"]).on("click",xpaths["editTestTypeConfigurationButtons"],showEditModal);		
		csrfToken = $("input#csrf").val();
		
		$(xpaths["generalConfigurationForm"]).submit(saveGeneralConfiguration);

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