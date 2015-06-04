var models = require('../models/models.js');

// Autooad - factoriza el código si ruta incluya :quidId
exports.load = function(req, res, next, quizId) {
	models.Quiz.find(quizId).then (
		function(quiz) {
			if (quiz) {
				req.quiz = quiz;
				next();
			} else { next (new Error ('No existe quizId=' + quizId));}
		}
	).catch(function (error) {next (error);});
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
				res.render('quizes/results', {quizes : quizes});
			}
		).catch(function(error){next(error);})
	} else {
		models.Quiz.findAll().then(
			function (quizes) {
				res.render('quizes/index', {quizes : quizes});
			}
		).catch(function(error){next(error);})
	}
};

// GET /quizes/:id
exports.show = function (req, res){
	res.render('quizes/show', {quiz : req.quiz});
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

		res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
		//})
};

// GET /autor
exports.autor = function (req, res) {
	res.render('autor', {autor: 'David Velazquez Bernal'});
};