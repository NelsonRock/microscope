/*Una collections de errores solo en browser para el cliente
no se guardara en MongoDb, no preocuparse de allow y deny
Mostraremos los errores en la parte de arriba de nuestro layout.html
*/

Errors = new Meteor.Collections(null);
throError = function(message){
	Errors.insert({message: message});
}
