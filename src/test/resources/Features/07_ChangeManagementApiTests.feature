Feature: Change management tests
	Scenario: Add release
		Given In request header, set "Content-Type" to "application/json"
		And Request body template is loaded from file "Change/addRelease.json"
		When PUT request is submitted to "http://localhost:8999/api/release"
		Then Response status code should be 201
		And Save value at Json Path "id" in response, to variable "addedReleaseForChangeId"
		
	Scenario: Add change type
		Given In request header, set "Content-Type" to "application/json"
		And Request body template is loaded from file "Change/addChangeType.json"
		When PUT request is submitted to "http://localhost:8999/api/configuration/changeType"
		Then Response status code should be 201
		And Save value at Json Path "id" in response, to variable "addedChangeTypeForChangeId"
	
	Scenario: Add a application configuration
		Given In request header, set "Content-Type" to "application/json"
		And Request body template is loaded from file "Change/addApplicationConfiguration.json"
		When PUT request is submitted to "http://localhost:8999/api/configuration/application"
		Then Response status code should be 201
		And Save value at Json Path "id" in response, to variable "addedApplicationConfigurationForChangeId"
		
	Scenario: Add change
		Given In request header, set "Content-Type" to "application/json"
		And Request body template is loaded from file "Change/addChange.json"
		And In request body template, replace "${releaseId}" with value of variable "addedReleaseForChangeId"
		And In request body template, replace "${changeTypeId}" with value of variable "addedChangeTypeForChangeId"
		And In request body template, replace "${applicationConfigurationId}" with value of variable "addedApplicationConfigurationForChangeId"
		When PUT request is submitted to "http://localhost:8999/api/change"
		Then Response status code should be 201
		And Save value at Json Path "id" in response, to variable "addedChangeId"
		
	Scenario: Update change
		Given In request header, set "Content-Type" to "application/json"
		And Request body template is loaded from file "Change/updateChange.json"
		And In request body template, replace "${id}" with value of variable "addedChangeId"
		And In request body template, replace "${releaseId}" with value of variable "addedReleaseForChangeId"
		And In request body template, replace "${changeTypeId}" with value of variable "addedChangeTypeForChangeId"
		And In request body template, replace "${applicationConfigurationId}" with value of variable "addedApplicationConfigurationForChangeId"
		When PUT request is submitted to "http://localhost:8999/api/change"
		Then Response status code should be 200
		
	Scenario: Add change with invalid start date
		Given In request header, set "Content-Type" to "application/json"
		And Request body template is loaded from file "Change/addChangeInvalidStartDate.json"
		And In request body template, replace "${releaseId}" with value of variable "addedReleaseForChangeId"
		And In request body template, replace "${changeTypeId}" with value of variable "addedChangeTypeForChangeId"
		And In request body template, replace "${applicationConfigurationId}" with value of variable "addedApplicationConfigurationForChangeId"
		When PUT request is submitted to "http://localhost:8999/api/change"
		Then Response status code should be 400
		
	Scenario: Add change with invalid end date
		Given In request header, set "Content-Type" to "application/json"
		And Request body template is loaded from file "Change/addChangeInvalidEndDate.json"
		And In request body template, replace "${releaseId}" with value of variable "addedReleaseForChangeId"
		And In request body template, replace "${changeTypeId}" with value of variable "addedChangeTypeForChangeId"
		And In request body template, replace "${applicationConfigurationId}" with value of variable "addedApplicationConfigurationForChangeId"
		When PUT request is submitted to "http://localhost:8999/api/change"
		Then Response status code should be 400
		
	Scenario: Add duplicate change
		Given In request header, set "Content-Type" to "application/json"
		And Request body template is loaded from file "Change/addChange.json"
		And In request body template, replace "${releaseId}" with value of variable "addedReleaseForChangeId"
		And In request body template, replace "${changeTypeId}" with value of variable "addedChangeTypeForChangeId"
		And In request body template, replace "${applicationConfigurationId}" with value of variable "addedApplicationConfigurationForChangeId"
		When PUT request is submitted to "http://localhost:8999/api/change"
		Then Response status code should be 409
		
	Scenario: Add duplicate requirement
		Given In request header, set "Content-Type" to "application/json"
		And Request body template is loaded from file "Change/addChangeWithDuplicateRequirement.json"
		And In request body template, replace "${releaseId}" with value of variable "addedReleaseForChangeId"
		And In request body template, replace "${changeTypeId}" with value of variable "addedChangeTypeForChangeId"
		And In request body template, replace "${applicationConfigurationId}" with value of variable "addedApplicationConfigurationForChangeId"
		When PUT request is submitted to "http://localhost:8999/api/change"
		Then Response status code should be 409
		
	Scenario: Add duplicate impact
		Given In request header, set "Content-Type" to "application/json"
		And Request body template is loaded from file "Change/addChangeWithDuplicateImpact.json"
		And In request body template, replace "${releaseId}" with value of variable "addedReleaseForChangeId"
		And In request body template, replace "${changeTypeId}" with value of variable "addedChangeTypeForChangeId"
		And In request body template, replace "${applicationConfigurationId}" with value of variable "addedApplicationConfigurationForChangeId"
		When PUT request is submitted to "http://localhost:8999/api/change"
		Then Response status code should be 409
		
	Scenario: Get change
		When GET request is submitted to "http://localhost:8999/api/change/1"
		Then Response status code should be 200
		
	Scenario: Get changes
		When GET request is submitted to "http://localhost:8999/api/change"
		Then Response status code should be 200
		
	Scenario: Delete change
		Given In request header, set "Content-Type" to "application/json"
		And Request body template is loaded from file "delete.json"
		And In request body template, replace "${id}" with value of variable "addedChangeId"
		When DELETE request is submitted to "http://localhost:8999/api/change"
		Then Response status code should be 200