package io.github.nishadchayanakhawa.testestimatehub.configurations;

import java.io.IOException;
import java.util.List;
import java.util.Map;
//logger
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import io.github.nishadchayanakhawa.testestimatehub.model.Complexity;
import io.github.nishadchayanakhawa.testestimatehub.model.dto.UserDTO;
import io.github.nishadchayanakhawa.testestimatehub.model.dto.ApplicationConfigurationDTO;
import io.github.nishadchayanakhawa.testestimatehub.model.dto.ChangeTypeDTO;
import io.github.nishadchayanakhawa.testestimatehub.model.dto.GeneralConfigurationDTO;
import io.github.nishadchayanakhawa.testestimatehub.model.dto.TestTypeDTO;
import io.github.nishadchayanakhawa.testestimatehub.services.GeneralConfigurationService;
import io.github.nishadchayanakhawa.testestimatehub.services.UserService;
import io.github.nishadchayanakhawa.testestimatehub.services.TestTypeService;
import io.github.nishadchayanakhawa.testestimatehub.services.ChangeTypeService;
import io.github.nishadchayanakhawa.testestimatehub.services.ApplicationConfigurationService;
import io.github.nishadchayanakhawa.testestimatehub.services.exceptions.EntityNotFoundException;
import io.github.nishadchayanakhawa.testestimatehub.services.exceptions.TestEstimateHubExceptions;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
@Profile("qa")
public class CommandLineAppStartupRunner implements CommandLineRunner {
	private static final ch.qos.logback.classic.Logger logger = (ch.qos.logback.classic.Logger) LoggerFactory
			.getLogger(CommandLineAppStartupRunner.class);

	private static ObjectMapper objectMapper = new ObjectMapper();

	@Value("${user.records}")
	private Resource userRecords;

	@Value("${applicationConfiguration.records}")
	private Resource applicationConfigurationRecords;
	
	@Value("${testType.records}")
	private Resource testTypeRecords;
	
	@Value("${changeType.records}")
	private Resource changeTypeRecords;

	private UserService userService;
	private GeneralConfigurationService generalConfigurationService;
	private TestTypeService testTypeService;
	private ChangeTypeService changeTypeService;
	private ApplicationConfigurationService applicationConfigurationService;

	@Autowired
	public CommandLineAppStartupRunner(UserService userService, GeneralConfigurationService generalConfigurationService,
			TestTypeService testTypeService, ChangeTypeService changeTypeService,
			ApplicationConfigurationService applicationConfigurationService) {
		this.userService = userService;
		this.generalConfigurationService = generalConfigurationService;
		this.testTypeService = testTypeService;
		this.changeTypeService = changeTypeService;
		this.applicationConfigurationService = applicationConfigurationService;
	}

	@Override
	public void run(String... args) {
		try {
			loadDefaultUser();
			loadDefaultGeneralConfiguration();
			loadApplicationConfigurations();
			loadTestTypes();
			loadChangeTypes();
			logger.info("Application started. Please navigate to http://localhost:8999/login");
		} catch (Exception e) {
			throw new TestEstimateHubExceptions(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR,
					"Unhandled exception");
		}
	}

	private void loadDefaultUser() throws IOException {
		if (userService.getAll().isEmpty()) {
			logger.warn("No users were found. Default user will be created.");
			UserDTO[] users = objectMapper.readValue(userRecords.getContentAsByteArray(), UserDTO[].class);
			List.of(users).stream().forEach(user -> {
				UserDTO savedUser = this.userService.save(user);
				logger.info("User Saved: {}", savedUser);
			});
		}
	}

	private void loadDefaultGeneralConfiguration() {
		try {
			generalConfigurationService.get();
		} catch (EntityNotFoundException e) {
			logger.warn("General configuration was not found. Default record will be created.");
			GeneralConfigurationDTO generalConfiguration = new GeneralConfigurationDTO();
			generalConfiguration.setTestDesignProductivity(Map.of(Complexity.VERY_LOW, 21d, Complexity.LOW, 18d,
					Complexity.MEDIUM, 15d, Complexity.HIGH, 12d, Complexity.VERY_HIGH, 9d));
			generalConfiguration.setTestExecutionProductivity(Map.of(Complexity.VERY_LOW, 15d, Complexity.LOW, 12d,
					Complexity.MEDIUM, 9d, Complexity.HIGH, 6d, Complexity.VERY_HIGH, 3d));
			generalConfiguration.setTestConfigurationComplexityPercentage(10d);
			generalConfiguration.setTestDataComplexityPercentage(20d);
			generalConfiguration.setTestTransactionComplexityPercentage(40d);
			generalConfiguration.setTestValidationComplexityPercentage(30d);
			GeneralConfigurationDTO savedGeneralConfiguration = this.generalConfigurationService
					.save(generalConfiguration);
			logger.info("Saved General Configuration: {}", savedGeneralConfiguration);
		}
	}

	private void loadApplicationConfigurations() throws IOException {
		if (this.applicationConfigurationService.getAll().isEmpty()) {
			ApplicationConfigurationDTO[] applicationConfigurations = objectMapper.readValue(
					applicationConfigurationRecords.getContentAsByteArray(), ApplicationConfigurationDTO[].class);
			List.of(applicationConfigurations).stream().forEach(applicationConfiguration -> {
				ApplicationConfigurationDTO savedApplicationConfiguration = this.applicationConfigurationService
						.save(applicationConfiguration);
				logger.info("Saved Application Configuration: {}", savedApplicationConfiguration);
			});
		}
	}
	
	private void loadTestTypes() throws IOException {
		if (this.testTypeService.getAll().isEmpty()) {
			TestTypeDTO[] testTypes = objectMapper.readValue(
					testTypeRecords.getContentAsByteArray(), TestTypeDTO[].class);
			List.of(testTypes).stream().forEach(testType -> {
				TestTypeDTO savedTestType = this.testTypeService
						.save(testType);
				logger.info("Saved Test Type: {}", savedTestType);
			});
		}
	}
	
	private void loadChangeTypes() throws IOException {
		if (this.changeTypeService.getAll().isEmpty()) {
			ChangeTypeDTO[] changeTypes = objectMapper.readValue(
					changeTypeRecords.getContentAsByteArray(), ChangeTypeDTO[].class);
			List.of(changeTypes).stream().forEach(changeType -> {
				ChangeTypeDTO savedChangeType = this.changeTypeService
						.save(changeType);
				logger.info("Saved Change Type: {}", savedChangeType);
			});
		}
	}

}
