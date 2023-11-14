package io.github.nishadchayanakhawa.testestimatehub.tests.uitests;

import java.time.LocalDate;

import org.assertj.core.api.Assertions;
import org.testng.annotations.Test;

import io.github.nishadchayanakhawa.testestimatehub.model.dto.ReleaseDTO;
import io.github.nishadchayanakhawa.testestimatehub.tests.uitests.pages.HomePage;
import io.github.nishadchayanakhawa.testestimatehub.tests.uitests.pages.LoginPage;
import io.github.nishadchayanakhawa.testestimatehub.tests.uitests.pages.ReleaseManagementPage;
import io.nishadc.automationtestingframework.testngcustomization.TestFactory;
import io.nishadc.automationtestingframework.testngcustomization.annotations.Retry;

public class ReleaseRecordManagementTests {
	@Retry(3)
	@Test
	public void add() {
		LoginPage loginPage = LoginPage.getLoginPage();

		ReleaseDTO release = new ReleaseDTO();
		release.setIdentifier("Dec-2023");
		release.setName("December 2023 release");
		release.setStartDate(LocalDate.of(2023,11, 1));
		release.setEndDate(LocalDate.of(2023,12, 9));

		TestFactory.recordTest("Add release", loginPage.getDriver());
		HomePage homePage = loginPage.login("admin", "admin");
		TestFactory.recordTestStep("Loggin in",true);
		ReleaseManagementPage releaseManagementPage=homePage.navigateToReleaseManagement();
		TestFactory.recordTestStep("Navigated to release management",true);
		releaseManagementPage.add(release);
		TestFactory.recordTestStep("Added release",true);
		String actualToastMessage = releaseManagementPage.getToastMessage();
		Assertions.assertThat(actualToastMessage).isEqualTo("Release 'Dec-2023' saved");
		TestFactory.recordTestStep(actualToastMessage, true);
		releaseManagementPage.logout();
	}
	
	@Retry(3)
	@Test(dependsOnMethods= {"add"})
	public void addDuplicate() {
		LoginPage loginPage = LoginPage.getLoginPage();

		ReleaseDTO release = new ReleaseDTO();
		release.setIdentifier("Dec-2023");
		release.setName("December 2023 release");
		release.setStartDate(LocalDate.of(2023,11, 1));
		release.setEndDate(LocalDate.of(2023,12, 9));

		TestFactory.recordTest("Add duplicate release", loginPage.getDriver());
		ReleaseManagementPage releaseManagementPage = loginPage.login("admin", "admin")
				.navigateToReleaseManagement().add(release);

		String actualToastMessage = releaseManagementPage.getToastMessage();
		Assertions.assertThat(actualToastMessage).isEqualTo("identifier 'Dec-2023' already exists for another Release");
		TestFactory.recordTestStep(actualToastMessage, true);
		releaseManagementPage.logout();
	}
	
	@Retry(3)
	@Test
	public void addInvalid() {
		LoginPage loginPage = LoginPage.getLoginPage();

		ReleaseDTO release = new ReleaseDTO();
		release.setIdentifier("Dec-2023");
		release.setName("December 2023 release");
		release.setStartDate(LocalDate.of(2023,12, 2));
		release.setEndDate(LocalDate.of(2023,11, 1));

		TestFactory.recordTest("Add invalid release", loginPage.getDriver());
		ReleaseManagementPage releaseManagementPage = loginPage.login("admin", "admin")
				.navigateToReleaseManagement().add(release);

		String actualToastMessage = releaseManagementPage.getToastMessage();
		Assertions.assertThat(actualToastMessage).isEqualTo("endDate cannot be before Start Date");
		TestFactory.recordTestStep(actualToastMessage, true);
		releaseManagementPage.logout();
	}
	
	@Retry(3)
	@Test(dependsOnMethods= {"add"})
	public void update() {
		LoginPage loginPage = LoginPage.getLoginPage();

		ReleaseDTO release = new ReleaseDTO();
		release.setIdentifier("Dec-2023");
		release.setName("December 2023 Major release");
		release.setStartDate(LocalDate.of(2023,12, 1));
		release.setEndDate(LocalDate.of(2023,12, 8));

		TestFactory.recordTest("Update release", loginPage.getDriver());
		ReleaseManagementPage releaseManagementPage = loginPage.login("admin", "admin")
				.navigateToReleaseManagement().edit(release);

		String actualToastMessage = releaseManagementPage.getToastMessage();
		Assertions.assertThat(actualToastMessage).isEqualTo("Release 'Dec-2023' saved");
		TestFactory.recordTestStep(actualToastMessage, true);
		releaseManagementPage.logout();
	}
	
	@Retry(3)
	@Test(dependsOnMethods= {"update"})
	public void delete() {
		LoginPage loginPage = LoginPage.getLoginPage();

		ReleaseDTO release = new ReleaseDTO();
		release.setIdentifier("Dec-2023");

		TestFactory.recordTest("Delete release", loginPage.getDriver());
		ReleaseManagementPage releaseManagementPage = loginPage.login("admin", "admin")
				.navigateToReleaseManagement().delete(release);

		String actualToastMessage = releaseManagementPage.getToastMessage();
		Assertions.assertThat(actualToastMessage).isEqualTo("Release 'Dec-2023' deleted successfully");
		TestFactory.recordTestStep(actualToastMessage, true);
		releaseManagementPage.logout();
	}
}
