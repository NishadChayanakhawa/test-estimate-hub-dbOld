package io.github.nishadchayanakhawa.testestimatehub.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class TestEstimateHubApplicationControllers {
	@RequestMapping(path="/login",method = { RequestMethod.GET})
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
}
