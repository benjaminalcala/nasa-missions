const http = require('http');

const mongoose = require('mongoose');
require('dotenv').config();

const app = require('./app');
const {mongoConnect} = require('./utils/mongo');

const {loadPlanetsData} = require('./models/planets.model')

const PORT = process.env.PORT || 8000;



const server = http.createServer(app);



const startServer = async() => {
  await mongoConnect()
  await loadPlanetsData();
  server.listen(PORT, ()=> {
    console.log(`Listening on port ${PORT}...`)
  })

}

startServer();
