var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'resources';
	locals.filters = {
		post: req.params.article,
	};
	locals.data = {
		posts: [],
	};

	// Load the current post
	view.on('init', function (next) {

		var q = keystone.list('Post').model.findOne({
			state: 'published',
			slug: locals.filters.post,
		}).populate('categories');

		q.exec(function (err, result) {
			locals.data.post = result;
			
		console.log(locals.data.post);
			next(err);
		});


	});

	// Load other posts
	view.on('init', function (next) {

		var q = keystone.list('Post').model.find({state: 'published'}).populate('categories').sort('-publishedDate').limit(3);
		q.exec(function (err, results) {
			locals.data.posts = results;
			next(err);
		});
	});

	// Render the view
	view.render('article');
};
