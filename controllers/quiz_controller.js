var models = require('../models/models.js');

// Autooad - factoriza el código si ruta incluya :quidId
exports.load = function(req, res, next, quizId) {
	models.Quiz.find(quizId).then (
		function(quiz) {
			if (quiz) {
				req.quiz = quiz;
				next();
			} else { next (new Error ('No existe quizId=' + quizId))}
		}
	).catch(function (error) {next (error)});
};

// GET /quizes
exports.index = function (req, res) {
	if (req.query.search != undefined)
	{
		var find = req.query.search;
		console.log(req.query.search);
		find = "%" + find.replace(" ", "%") + "%";

		models.Quiz.findAll({where: ["pregunta like ?", find]}).then(
			function (quizes) {
				res.render('quizes/results.ejs', {quizes : quizes, errors: []});
			}
		).catch(function(error){next(error);})
	} else {
		models.Quiz.findAll().then(
			function (quizes) {
				res.render('quizes/index.ejs', {quizes : quizes, errors: []});
			}
		).catch(function(error){next(error)})
	}
};

// GET /quizes/:id
exports.show = function (req, res){
	res.render('quizes/show', {quiz : req.quiz, errors: []});
};

// GET /quizes/question
/*
exports.question = function (req, res) {
	models.Quiz.findAll().success(function(quiz) {
		res.render('quizes/question', {pregunta: quiz[0].pregunta});
		})
};
*/

// GET /quizes/answer
exports.answer = function (req, res) {
	var resultado = 'Incorrecto';
	//models.Quiz.find(req.params.quizId).then(function(quiz) {
		if (req.query.respuesta === req.quiz.respuesta)
		{
			var resultado = 'Correcto';
		}

		res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
		//})
};

// GET /quizes/new
exports.new = function(req, res) {
	// crea objeto QUiz
	var quiz = models.Quiz.build ( 
		{pregunta: "Pregunta", respuesta :"Respuesta"}
	);

	res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function (req, res) {
	var quiz= models.Quiz.build(req.body.quiz);
	
	var errors = quiz.validate();
	if (errors)
	{
		/*
		for (var prop in errors) {
			if (errors.hasOwnProperty(prop))
			   console.log("Errors for field " + prop + ": ");
		    for (var i=0; i<errors[prop].length; ++i) {
			    console.log("\t" + errors[prop][i]);
			}
		}
		*/
	    res.render('quizes/new', {quiz: quiz, errors: errors});
	} else {
		quiz // save: guarda en DB campos pregunta y respuesta de quiz
			.save({fields: ["pregunta", "respuesta"]})
	        .then( function(){ res.redirect('/quizes')}) ;	
	}

};

// GET /quizes/:id/edit
exports.edit = function(req, res) {
	var quiz = req.quiz;  // req.quiz: autoload de instancia de quiz

	res.render('quizes/edit', {quiz: quiz, errors: []});
};

// PUT /quizes/:id
exports.update = function(req, res) {
	req.quiz.pregunta  = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;

	var errors = req.quiz.validate();
    
	if (errors) {
			res.render('quizes/edit', {quiz: req.quiz, errors: errors});
	} else {
			req.quiz     // save: guarda campos pregunta y respuesta en DB
			.save( {fields: ["pregunta", "respuesta"]})
			.then( function(){ res.redirect('/quizes');});
	}     // Redirección HTTP a lista de preguntas (URL relativo)
};

exports.destroy = function(req, res) {
	req.quiz.destroy().then( function() {
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};


// GET /autor
exports.autor = function (req, res) {
	res.render('autor', {autor: 'David Velazquez Bernal', errors: []});
};