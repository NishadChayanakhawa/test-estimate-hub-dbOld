Feature: Application configuration tests
	Scenario: Add a application configuration
		Given In request header, set "Content-Type" to "application/json"
		And Request body template is loaded from file "ApplicationConfiguration/addApplicationConfiguration.json"
		When PUT request is submitted to "http://localhost:8999/api/configuration/application"
		Then Response status code should be 201
		And Save value at Json Path "id" in response, to variable "addedApplicationConfigurationId"
		
	Scenario: Add duplicate application configuration
		Given In request header, set "Content-Type" to "application/json"
		And Request body template is loaded from file "ApplicationConfiguration/addApplicationConfiguration.json"
		When PUT request is submitted to "http://localhost:8999/api/configuration/application"
		Then Response status code should be 409
		
	Scenario: Add invalid application configuration
		Given In request header, set "Content-Type" to "application/json"
		And Request body template is loaded from file "ApplicationConfiguration/addInvalidApplicationConfiguration.json"
		When PUT request is submitted to "http://localhost:8999/api/configuration/application"
		Then Response status code should be 400
		
	Scenario: Update application configuration
		Given In request header, set "Content-Type" to "application/json"
		And Request body template is loaded from file "ApplicationConfiguration/updateApplicationConfiguration.json"
		And In request body template, replace "\"${id}\"" with value of variable "addedApplicationConfigurationId"
		When PUT request is submitted to "http://localhost:8999/api/configuration/application"
		Then Response status code should be 200
		
	Scenario: Get release
		When GET request is submitted to "http://localhost:8999/api/configuration/application/1"
		Then Response status code should be 200
		
	Scenario: Get non-existing release
		When GET request is submitted to "http://localhost:8999/api/configuration/application/999"
		Then Response status code should be 410
		
	Scenario: Get releases
		When GET request is submitted to "http://localhost:8999/api/configuration/application"
		Then Response status code should be 200
		
	Scenario: Delete change type
		Given In request header, set "Content-Type" to "application/json"
		And Request body template is loaded from file "delete.json"
		And In request body template, replace "\"${id}\"" with value of variable "addedApplicationConfigurationId"
		When DELETE request is submitted to "http://localhost:8999/api/configuration/application"
		Then Response status code should be 200