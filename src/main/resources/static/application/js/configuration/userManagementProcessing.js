var userManagementProcessing=(function() {
	var csrfToken;
	
	/**
	 * populate edit information
	 */
	var showEditModal=function(event) {
		event.preventDefault();
		logging.log("Showing edit modal");
		var id=$(this).attr('id').split("_")[1];
		logging.log("User id: " + id);
		apiHandling.processRequest("get","/api/configuration/user/" + id,csrfToken)
			.done(data => showEditModal_success(data))
			.catch(error => showEditModal_failure(error));
	};
	
	var updateEditForm=function(editModal,data,shouldShowModal) {
		$.each(data,function(key,value) {
			logging.log("Processing key " + key);
			logging.log(editModal.children("input#" + key));
			$("input#" + key).val(value);
		});
		if(shouldShowModal) {
			editModal.modal('show');	
		}
	};
	
	var showEditModal_success=function(user) {
		logging.log(user);
		updateEditForm($("#putUserModal"),user,false);
		$.each(user.roles,function(index,role) {
			logging.log("Processing role: " + index + ":" + role);
			$("input#role" + role).attr("checked",true);
		});
		$("input#password").attr('required',false);
		$("#putUserModal").modal('show');
	}
	
	var showEditModal_failure=function(error) {
		logging.log(error);
		toastr.error(error.responseJSON.message);
		getUserList();
	}
	
	/**
	 * on modal dismiss
	 */
	
	var onModalDismiss=function() {
		logging.log("Dismissed modal");
		$(".is-invalid").removeClass("is-invalid");
		$("form#addUserForm").get(0).reset();
		$.each($("input[name='roles']"),function(index,element) {
			logging.log("Processing role element " + index + ":" + element);
			if($(this).attr("id")!="roleTESTER") {
				$(this).attr('checked',false);
			}
		});
		$("input#password").attr('required',true);
	};
	
	
	/**
	 * Delete user
	 */
	var deleteUser=function(event) {
		event.preventDefault();
		logging.log("Deleting user");
		var id=$(this).attr('id').split("_")[1];
		var username=$("td#usernameDisplayValue_" + id).html();
		$("span#usernameDisplay").html(username);
		$("input#delete_id").val(id);
		$("div#deleteUserConfirmationModal").modal('show');
		logging.log("User id: " + id);
	};
	
	var triggerDeleteTransaction=function(event) {
		event.preventDefault();
		logging.log("Triggering delete transaction for user");
		var deleteUserRequest={
			"id" : $("input#delete_id").val()
		}
		apiHandling.processRequest("delete","/api/configuration/user",csrfToken,deleteUserRequest)
			.done(data => triggerDeleteTransaction_success(data,$("span#usernameDisplay").html()))
			.catch(error => triggerDeleteTransaction_failure(error));
	}
	
	var triggerDeleteTransaction_success=function(data,username) {
		logging.log(data);
		$("div#deleteUserConfirmationModal").modal('hide');
		toastr.success("User '" + username + "' deleted successfully");
		getUserList();
	};
	
	var triggerDeleteTransaction_failure=function(error) {
		logging.log(error);
		toastr.error(error.responseJSON.path + ' ' + error.responseJSON.error);
	};
	
	/**
	 * Save user
	 */
	var saveUser=function(event) {
		event.preventDefault();
		logging.log("Saving user");
		
		var saveUserRequest=$("form#addUserForm").serializeObject();
		if(!$.isArray(saveUserRequest.roles)) {
			var role=saveUserRequest.roles;
			saveUserRequest.roles=[role];
		}
		logging.log(saveUserRequest);
		apiHandling.processRequest("put","/api/configuration/user",csrfToken,saveUserRequest)
			.done(data => saveUser_success(data))
			.catch(error => saveUser_failure(error));
			
	}
	
	var saveUser_success=function(user) {
		logging.log(user);
		$("#putUserModal").modal('hide');
		toastr.success("User '" + user.username + "' saved successfully");
		getUserList();
	};
	
	var saveUser_failure=function(error) {
		logging.log(error);
		processApiErrors(error.responseJSON.details);
	};
	
	/**
	 * Get list of users
	 */
	var getUserList=function() {
		$("tbody#userListTableBody").html("");
		$("tbody#userListTableBody").indicateTableLoading(5);
		apiHandling.processRequest("get","/api/configuration/user",csrfToken)
			.done(data => getUserList_success(data))
			.catch(error => getUserList_failure(error));
	};
	
	/**
	 * list user api success handler
	 */
	var getUserList_success=function(users) {
		logging.log(users);
		$("tbody#userListTableBody").indicateTableLoadingCompleted();
		$("#userListTemplate").tmpl(users).appendTo("tbody#userListTableBody");
	};
	
	/**
	 * list user api failure handler
	 */
	var getUserList_failure=function(error) {
		logging.log(error);
		$("tbody#userListTableBody").indicateTableLoadingCompleted();
		toastr.error(error.responseJSON.path + ' ' + error.responseJSON.error);
	};
	
	var init=function() {
		logging.enable();
		csrfToken=$("input#csrf").val();
		getUserList();
		
		toastr.options = getToastrOptions();
		
		$("form#addUserForm").submit(saveUser);
		$("#putUserModal").on("hidden.bs.modal",onModalDismiss);
		$("tbody#userListTableBody").on("click","button[id^='deleteUser_']",deleteUser);
		$("tbody#userListTableBody").on("click","button[id^='editUser_']",showEditModal);
		$("button#confirmDeleteUser").click(triggerDeleteTransaction);
		logging.log("User Management Initialized!!!");
	}
	
	return {
		init : init
	}
})();