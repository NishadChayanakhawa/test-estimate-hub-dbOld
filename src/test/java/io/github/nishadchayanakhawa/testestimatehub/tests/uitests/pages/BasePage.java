package io.github.nishadchayanakhawa.testestimatehub.tests.uitests.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;

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
	
	@FindBy(xpath="//button[@class='navbar-toggler']")
	WebElement navbarToggler;

	public BasePage(WebDriver driver) {
		super(driver);
		PageFactory.initElements(driver, this);
	}
	
	public WebDriver getDriver() {
		return this.driver;
	}
	
	public void logout() {
		this.clickNavbarTogglerIfAvailable();
		this.driverWait.until(ExpectedConditions.visibilityOf(userLink));
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
		this.driverWait.until(ExpectedConditions.visibilityOf(configurationLink));
		this.clickElement(configurationLink);
		this.clickElement(userManagementOption);
		return new UserManagementPage(this.driver);
	}
}
