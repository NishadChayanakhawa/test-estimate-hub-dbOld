package io.github.nishadchayanakhawa.testestimatehub.configurations;

import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import io.github.nishadchayanakhawa.testestimatehub.model.Role;
import io.github.nishadchayanakhawa.testestimatehub.model.dto.UserDTO;
import io.github.nishadchayanakhawa.testestimatehub.services.UserService;

@Component
@Profile("!dev")
public class CommandLineAppStartupRunner  implements CommandLineRunner{
	private static final Logger logger=LoggerFactory.getLogger(CommandLineAppStartupRunner.class);
	
	@Autowired
	private UserService userService;

	@Override
	public void run(String... args) throws Exception {
		loadDefaultUser();
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
			logger.info("User added: {}",user);
		}
	}

}
