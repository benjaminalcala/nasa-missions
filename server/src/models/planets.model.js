const {createReadStream} = require('fs');
const { parse } = require('csv-parse');;

const habitablePlanets = []


const isHabitablePlanet = (data) => {
  return data['koi_disposition'] === 'CONFIRMED' 
  && data['koi_insol'] > 0.36 && data['koi_insol'] < 1.11
  && data['koi_prad'] < 1.6;
}

createReadStream('./kepler_data.csv')
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
  console.log(err)
})
.on('end', ()=> {
  console.log(`There are ${habitablePlanets.length} habitable planets`)
})


module.exports = {
  planets: habitablePlanets
}