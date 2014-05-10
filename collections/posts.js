Posts = new Meteor.Collection('posts');

//Hacer que los usuarios puedan enviar posts

Posts.allow({
	/*insert: function (userId, doc) {
		//only allow posting if you are logged in
		return !! userId;	
	},*/
	update: ownsDocument,
	remove: ownsDocument
	/*,
	fetch: ['owner'],
	transform: function () {
		//...
	}*/
});

Posts.deny({
	update: function (userId, post, fieldNames) {
		//...may only edit the following two fields
		return (_.without(fieldNames,'url', 'title').length > 0);
	}
});

//Los metodos de meteor del lado del servidor omiten allow por ello vamos a crear un metodo
//meteor
Meteor.methods({
	post: function(postAttributes){
		var user = Meteor.user(),
		postWithSameLink = Posts.findOne({url: postAttributes.url});

		//asegurar que el usuario el logged in
		if(!user)
			throw new Meteor.error(401, "You need to loggin to posts a new story");

		//asegura que el post tenga un titulo
		if(!postAttributes.title)
			throw new Meteor.error(422, "Your pots no hace title");

		//check que haya un post con el mismo link
		if(postAttributes.url && postWithSameLink){
			throw new Meteor.Meteor.Error(302, 'This link has been posted', postWithSameLink._id);
		}

		//cogemos las name claves de cada del formulario
		
		var d = new Date().getTime();
		var post = _.extend(_.pick(postAttributes, 'url','title','message'), {
			userId : user._id,
			author: user.username,
			title: postAttributes.title + (this.isSimulation ? '(client)' : '(server)'),
			submitted: d.getMonth()+1+"/"+d.getDate()
		});
 		if (! this.isSimulation){
	      var Future = Npm.require('fibers/future');
	      var future = new Future();
	      Meteor.setTimeout(function() {
	        future.return();1
	      }, 5 * 1000);
	      future.wait();
	    }
	    var postId = Posts.insert(post);
	    console.log(postId);
	    return postId;
  	}
});