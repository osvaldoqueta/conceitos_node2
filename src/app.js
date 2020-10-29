  const express              = require("express");

  const { uuid}               = require('uuidv4');

  const cors                 = require("cors");

  // const { v4: uuid } = require('uuid');

  const app = express();

  app.use(express.json());
  //para que outros url possam fazer requisições em nossa aplicação
  app.use(cors());

  const repositories = [];

  



  //app.use('/repositories/:id', verify_ID);


  app.get("/repositories", (request, response) => {
    
    return response.json(repositories);


  });

  app.post("/repositories", (request, response) => {
    
    const {title, url, techs} = request.body;
    
    const repository = {
      id:uuid(), 
      title, 
      url, 
      techs, 
      likes:0
    };
    
    repositories.push(repository); 

    return response.json(repository); 
  });



  app.put("/repositories/:id", (request, response) => {

      const { id }               = request.params;
      //para
      const {title, url, techs}  = request.body;
      
      const id_positon           = repositories.findIndex(postion => postion.id === id);
      
      
      if(id_positon === -1) {
        return response.status(400).json({error: 'não existe'})
      }
      
      const repository_put       = {
        id, 
        title, 
        url, 
        techs, 
        likes: repositories[id_positon].likes
      };
      
      repositories[id_positon] = repository_put;
    
      return response.json(repository_put);  
           
  
  });



  app.delete("/repositories/:id", (request, response) => {
    
    const { id } = request.params;

    const findRepositoryIndex = repositories.findIndex(repository => repository.id === id);

    if(findRepositoryIndex >= 0) {

      repositories.splice(findRepositoryIndex, 1);
    }else{
      return response.status(400).json({error: 'Repository does not exist'});
    }

    return response.status(204).send();

    
    
  
  });




  app.post("/repositories/:id/like", (request, response) => {
    //
      const { id } = request.params;

      const findRepositoryIndex = repositories.findIndex(repository => repository.id === id);

      if(findRepositoryIndex === -1) {

        return response.status(400).json({error: 'Repository does not exist.'});
      }
      repositories[findRepositoryIndex].likes +=1;

      return response.json(repositories[findRepositoryIndex]);

  });

  module.exports = app;
