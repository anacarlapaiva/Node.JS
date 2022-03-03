const express = require("express");
const { uuid } = require("uuidv4");

const app = express(); //instância do express

app.use(express.json());

const projects = [];

function logRoutes(request, response, next) {
  const { method, url } = request;

  const route = `[${method.toUpperCase()}] ${url}`;

  console.log(route);

  return next();
}

// app.use(logRoutes);

//entre o app.listen e a instância, criamos a rota, q pode ser
//do tipo get post put etc.

//São utilizados dois parametros
//qual o endpoint(projects) e o segundo é
//uma função que será respondido para quem entrar
//no /projects
app.get("/projects",logRoutes, (request, response) => {
  const { title } = request.query;
  let results: any = ''
  results = title
    ? projects.filter((project) => project.title.includes(title)) : results;
  console.log(title);
  return response.json(projects);
});

app.post("/projects", (request, response) => {
  const { title, owner } = request.body;
  const id = uuid();
  const project = { id, title, owner };

  projects.push(project);

  return response.json(project);
});

// : é o parametro de rota seguido de um valor que serve como filtro
app.put("/projects/:id", (request, response) => {
  const { id } = request.params; //pegamos o id que queremos modificar
  //params armazena o que é enviado no parametro de rotas

  const { title, owner } = request.body;

  const projectIndex = projects.findIndex((project) => project.id === id); //findIndex filtra o array e retorna o que tiver o id igual do que foi informado
  if (projectIndex < 0) {
    //condicional se nao encontrar.
    return response.status(400).json({ error: "Not found" });
  }

  const project = { id, title, owner };

  projects[projectIndex] = project;

  return response.json(project);
});

app.delete("/projects/:id", (request, response) => {
  const { id } = request.params;
  const projectIndex = projects.findIndex((project) => project.id === id); //findIndex filtra o array e retorna o que tiver o id igual do que foi informado
  if (projectIndex < 0) {
    //condicional se nao encontrar.
    return response.status(400).json({ error: "Not found" });
  }
  projects.splice(projectIndex, 1);
  return response.status(204).json([]);
});

//utilizar portas acima da 1024 SEMPRE
app.listen(3333, () => {
  console.log("backend started");
}); //.listen() referencia qual porta http o server vai rodar.
//pode ter dois params. O segundo sendo uma função q avisa no terminar que o back está rodando
