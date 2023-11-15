package io.github.nishadchayanakhawa.testestimatehub.tests.uitests.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import io.github.nishadchayanakhawa.testestimatehub.model.dto.ApplicationConfigurationDTO;

public class ApplicationConfigurationPage extends BasePage {
	private static final String EDIT_BUTTON_XPATH = 
			"//td[text()='<APPLICATION>']/parent::tr//button[starts-with(@id,'editRecordButton_')]";
			
	private static final String DELETE_BUTTON_XPATH = 
			"//td[text()='<APPLICATION>']/parent::tr//button[starts-with(@id,'deleteRecordButton_')]";
	
	@FindBy(xpath="//*[@id='addRecordButton']")
	WebElement addRecordButton;
	
	@FindBy(xpath="//*[@id='confirmDeleteOperation']")
	WebElement confirmDeleteOperation;
	
	@FindBy(xpath="//*[@id='saveRecordButton']")
	WebElement saveRecordButton;
	
	@FindBy(xpath="//*[@id='application']")
	WebElement application;
	
	@FindBy(xpath="//*[@id='module']")
	WebElement module;
	
	@FindBy(xpath="//*[@id='subModule']")
	WebElement subModule;
	
	@FindBy(xpath="//*[@id='baseTestScriptCount']")
	WebElement baseTestScriptCount;

	public ApplicationConfigurationPage(WebDriver driver) {
		super(driver);
	}
	
	private ApplicationConfigurationPage save(ApplicationConfigurationDTO applicationConfiguration) {
		this.clearValue(this.application);
		this.sendText(application, applicationConfiguration.getApplication());
		this.clearValue(this.module);
		this.sendText(module, applicationConfiguration.getModule());
		this.clearValue(this.subModule);
		this.sendText(subModule, applicationConfiguration.getSubModule());
		this.clearValue(this.baseTestScriptCount);
		this.sendText(baseTestScriptCount, String.valueOf(applicationConfiguration.getBaseTestScriptCount()));
		this.clickElement(this.saveRecordButton);
		return this;
	}
	
	public ApplicationConfigurationPage add(ApplicationConfigurationDTO applicationConfiguration) {
		this.clickElement(this.addRecordButton);
		return this.save(applicationConfiguration);
	}

	public ApplicationConfigurationPage edit(ApplicationConfigurationDTO applicationConfiguration) {
		this.clickElement(EDIT_BUTTON_XPATH.replace("<APPLICATION>", applicationConfiguration.getApplication()));
		return this.save(applicationConfiguration);
	}
	
	public ApplicationConfigurationPage delete(ApplicationConfigurationDTO applicationConfiguration) {
		this.clickElement(DELETE_BUTTON_XPATH.replace("<APPLICATION>", applicationConfiguration.getApplication()));
		this.clickElement(confirmDeleteOperation);
		return this;
	}
}
