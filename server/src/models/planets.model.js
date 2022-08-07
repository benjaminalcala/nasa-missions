const path = require('path');
const {createReadStream} = require('fs');

const { parse } = require('csv-parse');

const planets = require('./planets.mongo');

async function loadPlanetsData(){
  return new Promise((resolve, reject)=> {
    const isHabitablePlanet = (data) => {
      return data['koi_disposition'] === 'CONFIRMED' 
      && data['koi_insol'] > 0.36 && data['koi_insol'] < 1.11
      && data['koi_prad'] < 1.6;
    }
    
    createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
    .pipe(parse({
      comment: '#',
      columns: true
    }))
    .on('data', async (data) => {
      if(isHabitablePlanet(data)){
        await savePlanet(data)
      }
    })
    .on('error', (err)=> {
      reject(err)
    })
    .on('end', async()=> {
      const numPlanets = (await getAllPlanets()).length;
      console.log(`There are ${numPlanets} habitable planets`)
      resolve()
    })
  })
}
 
async function getAllPlanets (){
  return await planets.find({},{'_id': 0, '__v': 0});
}

async function savePlanet(planet){ 
  try{
    await planets.updateOne({
      keplerName: planet.kepler_name
    }, {
      keplerName: planet.kepler_name
    }, {
      upsert: true
    })
  }catch(err){
    console.error(`Could not save planet ${err}`);
  }
  
}
module.exports = {
  loadPlanetsData,
  getAllPlanets
}