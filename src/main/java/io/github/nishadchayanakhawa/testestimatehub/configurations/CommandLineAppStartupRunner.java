package io.github.nishadchayanakhawa.testestimatehub.configurations;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Set;
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
import io.github.nishadchayanakhawa.testestimatehub.model.Role;
import io.github.nishadchayanakhawa.testestimatehub.model.dto.UserDTO;
import io.github.nishadchayanakhawa.testestimatehub.model.dto.GeneralConfigurationDTO;
import io.github.nishadchayanakhawa.testestimatehub.services.GeneralConfigurationService;
import io.github.nishadchayanakhawa.testestimatehub.services.UserService;
import io.github.nishadchayanakhawa.testestimatehub.services.TestTypeService;
import io.github.nishadchayanakhawa.testestimatehub.services.ChangeTypeService;
import io.github.nishadchayanakhawa.testestimatehub.services.ApplicationConfigurationService;
import io.github.nishadchayanakhawa.testestimatehub.services.exceptions.EntityNotFoundException;
import io.github.nishadchayanakhawa.testestimatehub.services.exceptions.TestEstimateHubExceptions;

import com.fasterxml.jackson.core.exc.StreamReadException;
import com.fasterxml.jackson.databind.DatabindException;
import com.fasterxml.jackson.databind.ObjectMapper;
@Component
@Profile("!dev")
public class CommandLineAppStartupRunner implements CommandLineRunner {
	private static final ch.qos.logback.classic.Logger logger = (ch.qos.logback.classic.Logger) LoggerFactory
			.getLogger(CommandLineAppStartupRunner.class);
	
	private static ObjectMapper objectMapper=new ObjectMapper();
	
	@Value("classpath:defaultValues/users.json")
	private Resource userRecords;

	private UserService userService;
	private GeneralConfigurationService generalConfigurationService;
	private TestTypeService testTypeService;
	private ChangeTypeService changeTypeService;
	private ApplicationConfigurationService applicationConfigurationService;
	
	private static final String ADMIN_USERNAME="admin";

	@Autowired
	public CommandLineAppStartupRunner(UserService userService,
			GeneralConfigurationService generalConfigurationService,
			TestTypeService testTypeService,
			ChangeTypeService changeTypeService,
			ApplicationConfigurationService applicationConfigurationService) {
		this.userService = userService;
		this.generalConfigurationService = generalConfigurationService;
		this.testTypeService=testTypeService;
		this.changeTypeService=changeTypeService;
		this.applicationConfigurationService=applicationConfigurationService;
	}

	@Override
	public void run(String... args) {
		try {
			loadDefaultUser();
			loadDefaultGeneralConfiguration();
			logger.info("Application started. Please navigate to http://localhost:8999/login");
		} catch (Exception e) {
			throw new TestEstimateHubExceptions(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR,
					"Unhandled exception");
		}
	}

	private void loadDefaultUser() throws StreamReadException, DatabindException, IOException {
		if (userService.getAll().isEmpty()) {
			logger.warn("No users were found. Default user will be created.");
			UserDTO users[]=objectMapper.readValue(userRecords.getContentAsByteArray(),UserDTO[].class);
			List.of(users).stream().forEach(user -> {
				UserDTO savedUser=this.userService.save(user);
				logger.info("User Saved: {}",savedUser);
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

}
