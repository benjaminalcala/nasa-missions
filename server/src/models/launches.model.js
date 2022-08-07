const axios = require('axios');

const launches = require('./launches.mongo');
const planets = require('./planets.mongo');


const SPACE_X_API_URL = 'https://api.spacexdata.com/v4/launches/query'


async function populateLaunches(){
  const response = await axios.post(SPACE_X_API_URL, {
    query: {},
    options: {
        pagination: false,
        populate: [
            {
                path: 'rocket',
                select: 'name'
  
            },{
                path: 'payloads',
                select: 'customers'
  
            }
        ]
    }
  } )

  const responseDocs = response.data.docs;
  for(let responseDoc of responseDocs){
    const customers = responseDoc.payloads.flatMap(payload => {
      payload.customers
    })
    const launch = {
      flightNumber: responseDoc.flight_number,
      mission: responseDoc.name,
      rocket: responseDoc.rocket.name,
      launchDate: responseDoc.date_local,
      customers,
      upcoming: responseDoc.upcoming,
      succcess:responseDoc.success
    }
    await saveLaunch(launch);
  }

}


async function loadLaunchesData(){

  const launch = await findLaunch({
    flightNumber: 1,
    name: 'FalconSat'
  })

  if(launch){
    console.log('Data already downloaded...')
  }else{
    await populateLaunches();
  }
  
}

const DEFAULT_FLIGHT_NUMBER = 100;

async function getAllLaunches(skip, limit){
  return await launches.find({}, {'_id': 0, '__v': 0})
  .sort({flightNumber: 1})
  .skip(skip)
  .limit(limit)
}



async function saveLaunch(launch){
  
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
  const planet = await planets.findOne({keplerName: launch.target});
  if(!planet){
    throw new Error('planet not found')
  }
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

async function findLaunch(query){
  return await launches.findOne(query)
}

async function existsLaunchWithId(id){
  return await findLaunch({flightNumber: id})

}

async function abortLaunchWithId(id){
  const aborted = await launches.updateOne({flightNumber: id}, {
    success: false,
    upcoming: false
  })
 
  return aborted.modifiedCount === 1;

}


module.exports = {
  loadLaunchesData,
  getAllLaunches,
  setNewLaunch,
  abortLaunchWithId,
  existsLaunchWithId
}