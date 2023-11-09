package io.github.nishadchayanakhawa.testestimatehub.tests.uitests.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import io.github.nishadchayanakhawa.testestimatehub.model.dto.ChangeTypeDTO;

public class ChangeTypeConfigurationPage extends BasePage {
	private static final String EDIT_BUTTON_XPATH = 
			"//td[starts-with(@id,'changeTypeDisplayName_') and text()='<ChangeTypeName>']//parent::tr//button[starts-with(@id,'editChangeTypeConfiguration_')]";
			
	private static final String DELETE_BUTTON_XPATH = 
			"//td[starts-with(@id,'changeTypeDisplayName_') and text()='<ChangeTypeName>']//parent::tr//button[starts-with(@id,'deleteChangeTypeConfiguration_')]";
	
	@FindBy(xpath = "//button[@id='addChangeTypeConfigurationRecordButton']")
	WebElement addChangeTypeButton;

	@FindBy(xpath = "//input[@id='name']")
	WebElement name;

	@FindBy(xpath = "//input[@id='testCaseCountModifier']")
	WebElement testCaseCountModifier;

	@FindBy(xpath = "//input[@id='testPlanningEffortAllocationPercentage']")
	WebElement testPlanningEffortAllocationPercentage;

	@FindBy(xpath = "//input[@id='testPreparationEffortAllocationPercentage']")
	WebElement testPreparationEffortAllocationPercentage;
	
	@FindBy(xpath = "//input[@id='managementEffortAllocationPercentage']")
	WebElement managementEffortAllocationPercentage;

	@FindBy(xpath = "//button[@id='saveChangeTypeConfiguration']")
	WebElement saveChangeTypeConfigurationButton;
	
	@FindBy(xpath = "//button[@id='confirmDeleteChangeTypeConfigurationRecord']")
	WebElement confirmDeleteChangeTypeConfigurationButton;

	public ChangeTypeConfigurationPage(WebDriver driver) {
		super(driver);
	}

	private ChangeTypeConfigurationPage saveChangeType(ChangeTypeDTO changeType) {
		this.clearValue(name);
		this.sendText(name, changeType.getName());
		this.clearValue(testCaseCountModifier);
		this.sendText(testCaseCountModifier, String.valueOf(changeType.getTestCaseCountModifier()));
		this.clearValue(testPlanningEffortAllocationPercentage);
		this.sendText(testPlanningEffortAllocationPercentage, String.valueOf(changeType.getTestPlanningEffortAllocationPercentage()));
		this.clearValue(testPreparationEffortAllocationPercentage);
		this.sendText(testPreparationEffortAllocationPercentage,
				String.valueOf(changeType.getTestPreparationEffortAllocationPercentage()));
		this.clearValue(managementEffortAllocationPercentage);
		this.sendText(managementEffortAllocationPercentage,
				String.valueOf(changeType.getManagementEffortAllocationPercentage()));
		this.clickElement(saveChangeTypeConfigurationButton);
		return this;
	}

	public ChangeTypeConfigurationPage addChangeType(ChangeTypeDTO changeType) {
		this.clickElement(addChangeTypeButton);
		return this.saveChangeType(changeType);
	}
	
	public ChangeTypeConfigurationPage editChangeType(ChangeTypeDTO changeType) {
		this.clickElement(EDIT_BUTTON_XPATH.replace("<ChangeTypeName>", changeType.getName()));
		return this.saveChangeType(changeType);
	}
	
	public ChangeTypeConfigurationPage deleteChangeType(ChangeTypeDTO changeType) {
		this.clickElement(DELETE_BUTTON_XPATH.replace("<ChangeTypeName>", changeType.getName()));
		this.clickElement(confirmDeleteChangeTypeConfigurationButton);
		return this;
	}

}
