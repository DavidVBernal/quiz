var path = require('path');

//Postgress DATABASE_URL =  postgres://user:passwd@host:port/database
// Sql Lite DATABASE_URL =  sqllite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name    = (url[6] || null);
var user       = (url[2] || null);
var pwd        = (url[3] || null);
var protocol   = (url[1] || null);
var dialect    = (url[1] || null);
var port       = (url[5] || null);
var host       = (url[4] || null);
var storage    = process.env.DATABASE_STORAGE;

// Cargar Modeo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgress
var sequelize = new Sequelize(DB_name, user, pwd,
					{dialect:  dialect,
					 protocol: protocol,
					 port:     port,
					 host:     host,
					 storage:  storage,  // s�lo SQLLite (.env)
					 omitNull: true      // s�lo Postgress 
					}
);

//IMportar la definici�n de la tabla Quiz en quiz.js
var quiz_path = path.join(__dirname, 'quiz');
var Quiz = sequelize.import(quiz_path);

// Importar definicion de la tabla Comment
var comment_path = path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path);

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz; //exportar definici�n de tabla Quiz
exports.Comment = Comment;

//sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function(){
	// success.. ejecuta manejador una vez creada la tabla
	Quiz.count().then(function (count) {
		if (count === 0)  { // la tabla se inicializa si no est� vac�a
			Quiz.create({ pregunta: 'Capital de Italia',
			  			  respuesta:'Roma',
						  tematica: 'Geografia'
			    });
			Quiz.create({ pregunta: 'Capital de Portugal',
				          respuesta:'Lisboa',
						  tematica: 'Geografia'
			    })
			.then(function(){console.log('Base de datos inicializada')});
		};
	});
});