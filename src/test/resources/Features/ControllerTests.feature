Feature: Controller tests
	Scenario: Get login controller
		When GET request is submitted to "http://localhost:8999/login"
		Then Response status code should be 200
		
	Scenario: Get login controller
		When GET request is submitted to "http://localhost:8999/home"
		Then Response status code should be 500
		
	Scenario: Get User management controller
		When GET request is submitted to "http://localhost:8999/configuration/userManagement"
		Then Response status code should be 500
		
	Scenario: Get User management controller
		When GET request is submitted to "http://localhost:8999/configuration/application"
		Then Response status code should be 500
		
	Scenario: Get test type controller
		When GET request is submitted to "http://localhost:8999/configuration/testType"
		Then Response status code should be 500
	
	Scenario: Get change type controller
		When GET request is submitted to "http://localhost:8999/configuration/changeType"
		Then Response status code should be 500
	
	Scenario: Get general configuration controller
		When GET request is submitted to "http://localhost:8999/configuration/general"
		Then Response status code should be 500
		
	Scenario: Get release controller
		When GET request is submitted to "http://localhost:8999/release"
		Then Response status code should be 500
		
	Scenario: Get change controller
		When GET request is submitted to "http://localhost:8999/change"
		Then Response status code should be 500