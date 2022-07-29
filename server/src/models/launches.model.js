const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: 'January 5, 2023',
  target: 'Kepler-442 b',
  customers: [
    'ZTM', 'NASA'
  ],
  upcoming: true,
  success: true
}

setNewLaunch(launch);


async function getAllLaunches(){
  return await launches.find({}, {'_id': 0, '__v': 0})
}

async function saveLaunch(launch){
  const planet = await planets.findOne({keplerName: launch.target});
  if(!planet){
    throw new Error('planet not found')
  }

  await launches.findOneAndUpdate({
    flightNumber: launch.flightNumber
  }, launch, {
    upsert: true
  })
}

async function getLatestFlightNumber(){
  const latestFlight =  await launches.findOne()
  .sort('-flightNumber')

  if(!latestFlight){
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestFlight.flightNumber;
}


async function setNewLaunch(launch){
  const latestFlightNumber = await getLatestFlightNumber() + 1;
  const newLaunch = Object.assign(launch, {
    flightNumber: latestFlightNumber,
    customers: [
      'ZTM', 'NASA'
    ],
    upcoming: true,
    success: true
  })
  await saveLaunch(newLaunch);

}

async function existsLaunchWithId(id){
  return await launches.findOne({flightNumber: id})

}

async function abortLaunchWithId(id){
  const aborted = await launches.updateOne({flightNumber: id}, {
    success: false,
    upcoming: false
  })
 
  return aborted.modifiedCount === 1;

}


module.exports = {
  getAllLaunches,
  setNewLaunch,
  abortLaunchWithId,
  existsLaunchWithId
}