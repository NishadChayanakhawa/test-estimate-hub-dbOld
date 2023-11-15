package io.github.nishadchayanakhawa.testestimatehub.tests.uitests.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class ApplicationConfigurationPage extends BasePage {
	
	@FindBy(xpath="//*[@id='addRecordButton']")
	WebElement addRecordButton;

	public ApplicationConfigurationPage(WebDriver driver) {
		super(driver);
	}

}
