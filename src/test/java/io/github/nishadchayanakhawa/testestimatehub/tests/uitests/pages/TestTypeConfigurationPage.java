package io.github.nishadchayanakhawa.testestimatehub.tests.uitests.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import io.github.nishadchayanakhawa.testestimatehub.model.dto.TestTypeDTO;

public class TestTypeConfigurationPage extends BasePage {
	private static final String EDIT_BUTTON_XPATH = 
			"//td[starts-with(@id,'testTypeDisplayName_') and text()='<TestTypeName>']//parent::tr//button[starts-with(@id,'editTestTypeConfiguration_')]";
			
	private static final String DELETE_BUTTON_XPATH = 
			"//td[starts-with(@id,'testTypeDisplayName_') and text()='<TestTypeName>']//parent::tr//button[starts-with(@id,'deleteTestTypeConfiguration_')]";
	
	@FindBy(xpath = "//button[@id='addTestTypeConfigurationRecordButton']")
	WebElement addTestTypeButton;

	@FindBy(xpath = "//input[@id='name']")
	WebElement name;

	@FindBy(xpath = "//input[@id='relativeTestCaseCountPercentage']")
	WebElement relativeTestCaseCountPercentage;

	@FindBy(xpath = "//input[@id='reExecutionPercentage']")
	WebElement reExecutionPercentage;

	@FindBy(xpath = "//input[@id='additionalCycleExecutionPercentage']")
	WebElement additionalCycleExecutionPercentage;

	@FindBy(xpath = "//button[@id='saveTestTypeConfiguration']")
	WebElement saveTestTypeConfigurationButton;
	
	@FindBy(xpath = "//button[@id='confirmDeleteTestTypeConfigurationRecord']")
	WebElement confirmDeleteTestTypeConfigurationButton;

	public TestTypeConfigurationPage(WebDriver driver) {
		super(driver);
	}

	private TestTypeConfigurationPage saveTestType(TestTypeDTO testType) {
		this.clearValue(name);
		this.sendText(name, testType.getName());
		this.clearValue(relativeTestCaseCountPercentage);
		this.sendText(relativeTestCaseCountPercentage, String.valueOf(testType.getRelativeTestCaseCountPercentage()));
		this.clearValue(reExecutionPercentage);
		this.sendText(reExecutionPercentage, String.valueOf(testType.getReExecutionPercentage()));
		this.clearValue(additionalCycleExecutionPercentage);
		this.sendText(additionalCycleExecutionPercentage,
				String.valueOf(testType.getAdditionalCycleExecutionPercentage()));
		this.clickElement(saveTestTypeConfigurationButton);
		return this;
	}

	public TestTypeConfigurationPage addTestType(TestTypeDTO testType) {
		this.clickElement(addTestTypeButton);
		return this.saveTestType(testType);
	}
	
	public TestTypeConfigurationPage editTestType(TestTypeDTO testType) {
		this.clickElement(EDIT_BUTTON_XPATH.replace("<TestTypeName>", testType.getName()));
		return this.saveTestType(testType);
	}
	
	public TestTypeConfigurationPage deleteTestType(TestTypeDTO testType) {
		this.clickElement(DELETE_BUTTON_XPATH.replace("<TestTypeName>", testType.getName()));
		this.clickElement(confirmDeleteTestTypeConfigurationButton);
		return this;
	}

}
