  const express              = require("express");

  const { v4, uuid, isUuid } = require('uuidv4');

  const cors = require("cors");

  // const { v4: uuid } = require('uuid');

  const app = express();

  app.use(express.json());
  //para que outros url possam fazer requisições em nossa aplicação
  app.use(cors());

  const repositories = [];

  //middleware
  function verify_like(request, response, next){

    var { likes } = request.body;
    
    if(typeof likes == "number" && likes > 0){
      return next();
    }

    response.status(400).json({"likes": likes}); 
  }



  function isUniqid(request, response, next){
    
    var { id } = request.params;

    if(isUuid(id))
      return next();
    else
      return response.status(400).json({'Error': 'ID não é um Uuid válido'});
  }




  function verify_ID(request, response, next){

    var { id } = request.params;
    
    var repositories_id = repositories.findIndex(repository => repository.id === id);

    if(repositories_id < 0){
      return response.status(400).json({'Error': 'ID inválido', 'ID':repositories_id});  
    }
    return next();
    
  }
  



  //app.use('/repositories/:id', verify_ID);


  app.get("/repositories", (request, response) => {
    //var {title, url, techs, likes} = response.query;  
    
    //repositories.push({id, title, url, techs, likes});

    return response.status(200).json(repositories);


  });

  app.post("/repositories", (request, response) => {
    
    var {title, url, techs} = request.body;
    
    const repository = {id:uuid(), title: title, url: url, techs:techs};
    
    repositories.push(repository); 

    return response.status(200).json(repositories); 
  });



  app.put("/repositories/:id", isUniqid, (request, response) => {

      var { id } = request.params;
      //para
      var {title, url, techs}  = request.body;
      
      var repository_put       = {id:id, "title": title, "url": url, "techs":techs};
      
      const id_positon         = repositories.findIndex(postion => postion.id === id);
      
      if(id_positon < 0){
        return response.status(400).json({'Error': 'Não deu para atualizar'});
      }
      repositories[id_positon] = repository_put;
      
      response.json(repositories);  
           
  
  });



  app.delete("/repositories/:id", isUniqid, (request, response) => {

    var { id }       = request.params;
    
    const id_positon = repositories.findIndex(postion => postion.id === id);
    
    if(id_positon < 0){
      return response.status(400).json({'Error': 'Invalid iD to delete'});
    }
    repositories.splice(id_positon, 1);

    return response.status(204).json({'msg':'deletado com successo'});
    
  
  });




  app.post("/repositories/:id/like", isUniqid, verify_like, (request, response) => {
    //
    var { id }       = request.params;
    //
    var { likes }    = request.body;

    var id_positon   = repositories.findIndex(postion => postion.id === id);

    repositories[id_positon].likes = likes;        

    return response.json(repositories[id_positon]);

  });

  module.exports = app;
