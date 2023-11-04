package io.github.nishadchayanakhawa.testestimatehub.tests.uitests.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.ui.ExpectedConditions;

import io.github.nishadchayanakhawa.testestimatehub.model.dto.UserDTO;

public class UserManagementPage extends BasePage{
	@FindBy(xpath="//*[@id=\"addUserButton\"]")
	WebElement addUserButton;
	
	@FindBy(xpath="//*[@id=\"username\"]")
	WebElement username;
	
	@FindBy(xpath="//*[@id=\"password\"]")
	WebElement password;
	
	@FindBy(xpath="//*[@id=\"firstName\"]")
	WebElement firstName;
	
	@FindBy(xpath="//*[@id=\"lastName\"]")
	WebElement lastName;
	
	@FindBy(xpath="//*[@id=\"email\"]")
	WebElement email;
	
	@FindBy(xpath="//*[@id=\"saveUser\"]")
	WebElement saveUserButton;
	
	@FindBy(xpath="//*[@id=\"toast-container\"]/div/div[2]")
	WebElement visibleToastMessage;
	
	@FindBy(xpath="//*[@id=\"toast-container\"]/div/button")
	WebElement closeToastMessage;
	
	@FindBy(xpath="//button[@id='dismissPutUserModal']")
	WebElement dismissModalButton;
	
	@FindBy(xpath="//button[@id='confirmDeleteUser']")
	WebElement confirmDeleteUser;
	
	private static final String EDIT_BUTTON_XPATH_TEMPLATE=
			"//td[text()='USERNAME']/parent::tr//button[starts-with(@id,'editUser_')]";
	
	private static final String DELETE_BUTTON_XPATH_TEMPLATE=
			"//td[text()='USERNAME']/parent::tr//button[starts-with(@id,'deleteUser_')]";

	public UserManagementPage(WebDriver driver) {
		super(driver);
	}
	
	private UserManagementPage saveUser(UserDTO user) {
		this.clearValue(username);
		this.sendText(username, user.getUsername());
		this.clearValue(password);
		this.sendText(password, user.getPassword());
		this.clearValue(firstName);
		this.sendText(firstName, user.getFirstName());
		this.clearValue(lastName);
		this.sendText(lastName, user.getLastName());
		this.clearValue(email);
		this.sendText(email, user.getEmail());
		this.clickElement(saveUserButton);
		return this;
	}
	
	public UserManagementPage addUser(UserDTO user) {
		this.clickElement(addUserButton);
		return saveUser(user);
	}
	
	public UserManagementPage editUser(UserDTO user) {
		String editButtonXPath=EDIT_BUTTON_XPATH_TEMPLATE.replace("USERNAME", user.getUsername());
		this.clickElement(editButtonXPath);
		return saveUser(user);
	}
	
	public UserManagementPage deleteUser(String username) {
		String deleteButtonXPath=DELETE_BUTTON_XPATH_TEMPLATE.replace("USERNAME", username);
		this.clickElement(deleteButtonXPath);
		this.driverWait.until(ExpectedConditions.visibilityOf(confirmDeleteUser));
		this.clickElement(confirmDeleteUser);
		return this;
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
