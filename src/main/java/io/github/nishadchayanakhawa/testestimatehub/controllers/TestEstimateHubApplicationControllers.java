package io.github.nishadchayanakhawa.testestimatehub.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import io.github.nishadchayanakhawa.testestimatehub.services.ReleaseService;
import io.github.nishadchayanakhawa.testestimatehub.services.ChangeTypeService;
import io.github.nishadchayanakhawa.testestimatehub.services.ApplicationConfigurationService;
import io.github.nishadchayanakhawa.testestimatehub.services.ChangeService;
import io.github.nishadchayanakhawa.testestimatehub.services.TestTypeService;

@Controller
public class TestEstimateHubApplicationControllers {
	private ReleaseService releaseService;
	private ChangeTypeService changeTypeService;
	private ChangeService changeService;
	private ApplicationConfigurationService applicationConfigurationService;
	private TestTypeService testTypeService;

	@Autowired
	public TestEstimateHubApplicationControllers(ReleaseService releaseService, ChangeTypeService changeTypeService,
			ChangeService changeService,
			ApplicationConfigurationService applicationConfigurationService,
			TestTypeService testTypeService) {
		this.releaseService = releaseService;
		this.changeTypeService = changeTypeService;
		this.changeService=changeService;
		this.applicationConfigurationService = applicationConfigurationService;
		this.testTypeService=testTypeService;
	}

	@GetMapping("/login")
	public String getLoginPage() {
		return "login";
	}

	@GetMapping("/home")
	public String getHomePage() {
		return "home";
	}

	@GetMapping("/configuration/userManagement")
	public String getUserManagementPage() {
		return "configuration/userManagement";
	}

	@GetMapping("/configuration/testType")
	public String getTestTypeConfigurationPage() {
		return "configuration/testType";
	}

	@GetMapping("/configuration/changeType")
	public String getChangeTypeConfigurationPage() {
		return "configuration/changeType";
	}

	@GetMapping("/configuration/general")
	public String getGeneralConfigurationPage() {
		return "configuration/general";
	}

	@GetMapping("/configuration/application")
	public String getApplicationConfigurationPage() {
		return "configuration/application";
	}

	@GetMapping("/release")
	public String getReleaseRecordManagementPage() {
		return "record/release";
	}

	@GetMapping("/change")
	public String getChangeRecordManagementPage(Model model) {
		model.addAttribute("releases", this.releaseService.getAll());
		model.addAttribute("changeTypes", this.changeTypeService.getAll());
		model.addAttribute("applicationConfigurationRecords", this.applicationConfigurationService.getAll());
		return "record/change";
	}
	
	@GetMapping("/estimationForm/{id}")
	public String getChangeEstimationFormPage(@PathVariable Long id,Model model) {
		model.addAttribute("change", this.changeService.get(id));
		model.addAttribute("testTypes", this.testTypeService.getAll());
		return "record/estimationForm";
	}
}
