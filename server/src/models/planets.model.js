const path = require('path');
const {createReadStream} = require('fs');


const { parse } = require('csv-parse');;

const habitablePlanets = []

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
    .on('data', (data) => {
      if(isHabitablePlanet(data)){
        habitablePlanets.push(data)
      }
    })
    .on('error', (err)=> {
      reject(err)
    })
    .on('end', ()=> {
      console.log(`There are ${habitablePlanets.length} habitable planets`)
      resolve()
    })
  })
}
 
function getAllPlanets(){
  return habitablePlanets;
}
module.exports = {
  loadPlanetsData,
  getAllPlanets
}