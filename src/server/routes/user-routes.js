var router = require('express').Router({ mergeParams: true }),
	userApi = require(__paths.server.services + '/users');

router.post('/user', function(req, res) {

	var username = req.param("username");
	var password = req.param("password");
	var lastname = req.param("lastname");
	var firstname = req.param("firstname");

	var user = {
		"username" : username,
		"password" : password,
		"lastname" : lastname,
		"firstname" : firstname
	};

	userApi.getUser(username)
		.then(function(data){
			if (data.length < 1) // No users with that name / email exist, proceed with creating the new user 
			{
				var response = userApi.addUser(user)
					.then(function(data){
						var token = userApi.createToken(username);
						res.cookie('authToken', token, { maxAge: 3600, httpOnly: true});
						res.status(200).send("success");
					})
					.catch(function(err){
						res.status(500).send("Error creating user " + err.message);
					})
			}
			else
			{
				res.status(200).send("Theres already a user registered with that email address");
			}
		})
		.catch(function(err){
			res.status(500).send(err.message);
		});
});

module.exports = router;