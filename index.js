const express = require("express");
const fs = require("fs");
const path = require("path");

const server = express();
const port = 8080;

server.use(express.json());

const dataFilePath = path.join(__dirname, "koders.json");

const ensureDataFileExists = () => {
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, "[]", "utf-8");
  }
};

const readDataFile = () => {
  ensureDataFileExists();
  try {
    const data = fs.readFileSync(dataFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeDataFile = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf-8");
};

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

server.get("/koders", (request, response) => {
  const koders = readDataFile();
  response.json(koders);
});

server.post("/koders", (request, response) => {
  const newKoder = request.body;
  const koders = readDataFile();
  koders.push(newKoder);
  writeDataFile(koders);
  response.status(201).json({
    message: "Koder registrado",
    koders
  });
});

server.delete("/koders/:name", (request, response) => {
  const koderName = request.params.name;
  const koders = readDataFile();
  const filteredKoders = koders.filter(koder => koder.name !== koderName);
  if (filteredKoders.length < koders.length) {
    writeDataFile(filteredKoders);
    response.json({
      message: `Koder ${koderName} eliminado`,
      koders: filteredKoders
    });
  } else {
    response.status(404).json({
      message: `Koder ${koderName} no encontrado`
    });
  }
});
server.delete("/koders", (request, response) => {
    writeDataFile([]);
    response.json({
      message: "Todos los koders han sido eliminados",
      koders: []
    });
  });