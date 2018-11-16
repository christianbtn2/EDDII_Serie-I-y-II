var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PizzaSchema = new Schema({
	nombre: String,
	descripcion: String,
	ingredientes: Array,
	tipoMasa: String,
	tamano: Number,
	porciones: Number,
	quesoExtra: Boolean
});

module.exports = mongoose.model('Pizza', PizzaSchema);