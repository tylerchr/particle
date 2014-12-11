var router = require('express').Router({ mergeParams: true }),
	userApi = require(__paths.server.services + '/users'),
	crypto = require('crypto');

router.get('/user', function(req, res) {

	if (req.session.loggedInUser)
	{
		var currentUser = req.session.loggedInUser;
		var hashedEmail = crypto.createHash('md5').update(currentUser.email).digest('hex');

		res.status(200).send({
			email: currentUser.email,
			hashedEmail: hashedEmail,
			firstname: currentUser.firstname,
			lastname: currentUser.lastname
		});
	}
	else
	{
		res.status(401).send();
	}
});

router.post('/user', function(req, res) {

	var email = req.param("email");
	var password = req.param("password");
	var lastname = req.param("lastname");
	var firstname = req.param("firstname");

	var shasum = crypto.createHash('sha1');
	shasum.update(password);
	var encryptedPassword = (shasum.digest('hex').toString());

	var user = {
		"email" : email,
		"password" : encryptedPassword,
		"lastname" : lastname,
		"firstname" : firstname
	};

	userApi.getUser(email)
		.then(function(data){
			if (data.length < 1) // No users with that name / email exist, proceed with creating the new user
			{
				var response = userApi.addUser(user)
					.then(function(data){

						req.session.loggedInUser = {
							"email" : data[0].email,
							"firstname" : data[0].firstname,
							"lastname" : data[0].lastname
						};

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


router.post('/login', function(req, res) {

	var shasum = crypto.createHash('sha1');
	var email = req.param("email");
	var password = req.param("password");
	shasum.update(password);
	var encryptedPassword = (shasum.digest('hex').toString());

	userApi.getUser(email)
		.then(function(data) {

			if (data[0] && encryptedPassword == data[0].password)
			{
				req.session.loggedInUser = {
					"email" : data[0].email,
					"firstname" : data[0].firstname,
					"lastname" : data[0].lastname
				};

				res.redirect("/app/#");
			}
			else
			{
				res.redirect("/common/#/login?error=invalid");
			}

		});

});

router.get('/logout', function(req, res) {

	if (req.session.loggedInUser)
	{
		console.log(req.session.loggedInUser);
	}

	req.session.loggedInUser = null;

	res.redirect("/common/#");

});

module.exports = router;