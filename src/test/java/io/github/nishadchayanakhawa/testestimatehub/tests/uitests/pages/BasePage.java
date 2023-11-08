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
	
	@FindBy(xpath="//*[@id=\"testTypeConfigurationOption\"]")
	WebElement testTypeConfigurationOption;
	
	@FindBy(xpath="//button[@class='navbar-toggler']")
	WebElement navbarToggler;
	
	@FindBy(xpath="//*[@id=\"toast-container\"]/div/div[2]")
	WebElement visibleToastMessage;
	
	@FindBy(xpath="//*[@id=\"toast-container\"]/div/button")
	WebElement closeToastMessage;
	
	@FindBy(xpath="//button[@id='dismissModal']")
	WebElement dismissModalButton;

	public BasePage(WebDriver driver) {
		super(driver);
		PageFactory.initElements(driver, this);
	}
	
	public WebDriver getDriver() {
		return this.driver;
	}
	
	public void logout() {
		this.clickNavbarTogglerIfAvailable();
		this.clickElement(userLink);
		this.clickElement(logoutButton);
		this.driver.quit();
	}
	
	private void clickNavbarTogglerIfAvailable() {
		if(this.isDisplayed(navbarToggler)) {
			this.clickElement(navbarToggler);
		}
	}
	
	public UserManagementPage navigateToUserManagement() {
		this.clickNavbarTogglerIfAvailable();
		this.clickElement(configurationLink);
		this.clickElement(userManagementOption);
		return new UserManagementPage(this.driver);
	}
	
	public TestTypeConfigurationPage navigateToTestTypeConfiguration() {
		this.clickNavbarTogglerIfAvailable();
		this.clickElement(configurationLink);
		this.clickElement(testTypeConfigurationOption);
		return new TestTypeConfigurationPage(this.driver);
	}
	
	public String getToastMessage() {
		String toastMessage=this.getInnerText(visibleToastMessage);
		this.clickElement(closeToastMessage);
		if(this.isDisplayed(dismissModalButton)) {
			this.clickElement(dismissModalButton);
		}
		return toastMessage;
	}
}
