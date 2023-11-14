package io.github.nishadchayanakhawa.testestimatehub.tests.uitests.pages;

import java.time.format.DateTimeFormatter;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import io.github.nishadchayanakhawa.testestimatehub.model.dto.ReleaseDTO;

public class ReleaseManagementPage extends BasePage{
	
	private static final String EDIT_BUTTON_TEMPLATE_XPATH="//td[starts-with(@id,'releaseIdentifier_') and text()='<RELEASE_IDENTIFIER>']//parent::tr//button[starts-with(@id,'editRelease_')]";
	private static final String DELETE_BUTTON_TEMPLATE_XPATH="//td[starts-with(@id,'releaseIdentifier_') and text()='<RELEASE_IDENTIFIER>']//parent::tr//button[starts-with(@id,'deleteRelease_')]";
	
	@FindBy(xpath="//button[@id='addReleaseRecordButton']")
	WebElement addReleaseRecordButton;
	
	@FindBy(xpath="//input[@id='identifier']")
	WebElement identifier;
	
	@FindBy(xpath="//input[@id='name']")
	WebElement name;
	
	@FindBy(xpath="//input[@id='startDate']")
	WebElement startDate;
	
	@FindBy(xpath="//input[@id='endDate']")
	WebElement endDate;
	
	@FindBy(xpath="//button[text()='Save changes']")
	WebElement saveRelease;
	
	@FindBy(xpath="//button[@id='confirmDeleteReleaseRecord']")
	WebElement confirmDeleteReleaseRecord;

	public ReleaseManagementPage(WebDriver driver) {
		super(driver);
	}
	
	private ReleaseManagementPage save(ReleaseDTO release) {
		this.clearValue(this.identifier);
		this.sendText(this.identifier, release.getIdentifier());
		this.clearValue(this.name);
		this.sendText(this.name, release.getName());
		this.clearValue(this.startDate);
		this.sendText(this.startDate, release.getStartDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")));
		this.clearValue(this.endDate);
		this.sendText(this.endDate, release.getEndDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")));
		this.clickElement(this.saveRelease);
		return this;
	}
	
	public ReleaseManagementPage add(ReleaseDTO release) {
		this.clickElement(this.addReleaseRecordButton);
		return this.save(release);
	}
	
	public ReleaseManagementPage edit(ReleaseDTO release) {
		this.clickElement(EDIT_BUTTON_TEMPLATE_XPATH.replace("<RELEASE_IDENTIFIER>", release.getIdentifier()));
		return this.save(release);
	}
	
	public ReleaseManagementPage delete(ReleaseDTO release) {
		this.clickElement(DELETE_BUTTON_TEMPLATE_XPATH.replace("<RELEASE_IDENTIFIER>", release.getIdentifier()));
		this.clickElement(this.confirmDeleteReleaseRecord);
		return this;
	}

}
