const express = require("express");
const server = express();

server.use(express.json());

let count = 0;
const projects = [];

// Middleware que checa se existe o projeto
function checkProject(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id === id);
  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }
  return next();
}

// Middleware global que conta cada requisição feita
server.use((req, res, next) => {
  count++;
  console.log(`Foram feitas ${count} requisições!`);
  next();
});

// POST /projects
// A rota deve receber id e title dentro corpo de cadastrar um novo projeto
// dentro de um array no seguinte formato: { id: "1", title: 'Novo projeto', tasks: [] };
// Certifique-se de enviar tanto o ID quanto o título do projeto no formato string com àspas duplas.
server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  const project = {
    id,
    title,
    tasks: []
  };
  projects.push(project);
  return res.json(project);
});

// GET /projects
// Rota que lista todos os projetos e suas tarefas
server.get("/projects", (req, res) => {
  return res.json(projects);
});

// PUT /projects/:id
// A rota deve alterar apenas o título do projeto com o id presente nos parâmetros
server.put("/projects/:id", checkProject, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => p.id === id);
  project.title = title;
  return res.json(project);
});

// DELETE /projects/:id
// A rota deve deletar o projeto com o id presente nos parametros passados
server.delete("/projects/:id", checkProject, (req, res) => {
  const { id } = req.params;
  projects.splice(id, 1);
  return res.send();
});

// POST /projects/:id/tasks
// A rota deve receber um campo title e armazenar uma nova tarefa no array de tarefas
// de um projeto específico escolhido através do id presente nos parametros passados
server.post("/projects/:id/tasks", checkProject, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => p.id === id);
  project.tasks.push(title);
  return res.json(project);
});

// Escuta porta localhost:3000
server.listen(3000);
