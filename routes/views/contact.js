var keystone = require('keystone');
var Enquiry = keystone.list('Enquiry');
var nodemailer = require('nodemailer');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	const transporter = nodemailer.createTransport({
		host: 'in-v3.mailjet.com',
		port: 587,
		secure: false,
		auth: {
			user: 'e7793244bd880bdb4c02d5d47710f2d3',
			pass: 'a7a2f167c4c38a2542da53ea1e697ae4'
		}
	});



	// Set locals
	locals.section = 'contact';
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.gate = true;


	// On POST requests, add the Enquiry item to the database
	view.on('post', { action: 'contact' }, function (next) {

		var newEnquiry = new Enquiry.model();
		var updater = newEnquiry.getUpdateHandler(req);
		const mailOptions = {
			from: '<janderson@dunthorpemarketing.com>',
			to: 'jwdunthorpe@gmail.com',
			html: 
				`
					<h1>Website form submission</h1>
					<br>
					<p>
						From: ${req.body.firstName} ${req.body.lastName}<br>
						Email: ${req.body.email}<br>
						Company: ${req.body.company}<br>
						Phone: ${req.body.phone}<br>
						Title: ${req.body.jobTitle}<br>
						Message: ${req.body.message}<br>
						Source: ${req.body.source}
					</p>
				`,
			text: "Website form submission \n From: " + req.body.firstName + " " + req.body.lastName + "\nEmail: " + req.body.email + "\nCompany: " + req.body.company + "\nPhone: " + req.body.phone + "\nTitle: " + req.body.jobTitle + "\nMessage: " + req.body.message + "\nSource: " + req.body.source
		};
		transporter.sendMail(mailOptions, (error,info) => {
			if (error) {
				return console.log(error);
			}
			console.log(info.messageId);
		});

		updater.process(req.body, {
			flashErrors: true,
			fields: 'firstName, lastName, email, phone, company, zip, jobTitle, message, source',
			errorMessage: 'There was a problem submitting your enquiry:',
		}, function (err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				locals.enquirySubmitted = true;
			}
			next();
		});
	});

	view.render('contact');
};
