package io.github.nishadchayanakhawa.testestimatehub.configurations;

import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import io.github.nishadchayanakhawa.testestimatehub.model.Complexity;
import io.github.nishadchayanakhawa.testestimatehub.model.Role;
import io.github.nishadchayanakhawa.testestimatehub.model.dto.UserDTO;
import io.github.nishadchayanakhawa.testestimatehub.model.dto.GeneralConfigurationDTO;
import io.github.nishadchayanakhawa.testestimatehub.services.GeneralConfigurationService;
import io.github.nishadchayanakhawa.testestimatehub.services.UserService;
import io.github.nishadchayanakhawa.testestimatehub.services.exceptions.EntityNotFoundException;

@Component
@Profile("!dev")
public class CommandLineAppStartupRunner  implements CommandLineRunner{
	private static final Logger logger=LoggerFactory.getLogger(CommandLineAppStartupRunner.class);
	
	private UserService userService;
	private GeneralConfigurationService generalConfigurationService;
	
	@Autowired
	public CommandLineAppStartupRunner(UserService userService,GeneralConfigurationService generalConfigurationService) {
		this.userService=userService;
		this.generalConfigurationService=generalConfigurationService;
	}

	@Override
	public void run(String... args) throws Exception {
		try {
		loadDefaultUser();
		loadDefaultGeneralConfiguration();
		}catch(Exception e) {
			e.printStackTrace();
			throw e;
		}
	}
	
	private void loadDefaultUser() {
		if(userService.getAll().isEmpty()) {
			UserDTO user=new UserDTO();
			user.setUsername("admin");
			user.setPassword("admin");
			user.setFirstName("Admin");
			user.setLastName("LNU");
			user.setEmail("admin@company.com");
			user.setRoles(Set.of(Role.ADMIN,Role.TESTER));
			userService.save(user);
			logger.warn("User added: {}",user);
		}
	}
	
	private void loadDefaultGeneralConfiguration() {
		try {
			generalConfigurationService.get();
		} catch(EntityNotFoundException e) {
			GeneralConfigurationDTO generalConfiguration=new GeneralConfigurationDTO();
			generalConfiguration.setTestDesignProductivity(Map.of(Complexity.VERY_LOW,21d,Complexity.LOW,18d,Complexity.MEDIUM,15d,Complexity.HIGH,12d,Complexity.VERY_HIGH,9d));
			generalConfiguration.setTestExecutionProductivity(Map.of(Complexity.VERY_LOW,15d,Complexity.LOW,12d,Complexity.MEDIUM,9d,Complexity.HIGH,6d,Complexity.VERY_HIGH,3d));
			generalConfiguration.setTestConfigurationComplexityPercentage(10d);
			generalConfiguration.setTestDataComplexityPercentage(20d);
			generalConfiguration.setTestTransactionComplexityPercentage(40d);
			generalConfiguration.setTestValidationComplexityPercentage(30d);
			GeneralConfigurationDTO savedGeneralConfiguration=this.generalConfigurationService.save(generalConfiguration);
			logger.warn("Saved General Configuration: {}", savedGeneralConfiguration);
		}
	}

}
