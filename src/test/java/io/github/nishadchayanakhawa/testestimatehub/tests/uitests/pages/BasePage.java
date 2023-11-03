package io.github.nishadchayanakhawa.testestimatehub.tests.uitests.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

import io.nishadc.automationtestingframework.testinginterface.webui.ApplicationActions;

public class BasePage extends ApplicationActions {	
	@FindBy(xpath="//a[@id=\"userLink\"]")
	WebElement userLink;
	
	@FindBy(xpath="//button[@id=\"logoutButton\"]")
	WebElement logoutButton;
	
	@FindBy(xpath="//*[@id=\"configurationsLink\"]")
	WebElement configurationLink;
	
	@FindBy(xpath="//*[@id=\"userManagementOption\"]")
	WebElement userManagementOption;

	public BasePage(WebDriver driver) {
		super(driver);
		PageFactory.initElements(driver, this);
	}
	
	public WebDriver getDriver() {
		return this.driver;
	}
	
	public void logout() {
		this.clickElement(userLink);
		this.clickElement(logoutButton);
		this.driver.quit();
	}
	
	public UserManagementPage navigateToUserManagement() {
		this.clickElement(configurationLink);
		this.clickElement(userManagementOption);
		return new UserManagementPage(this.driver);
	}
}
