const launches = new Map();

let launchFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: 'January 5, 2023',
  target: 'Kepler-442 b',
  customer: [
    'ZTM', 'NASA'
  ],
  upcoming: true,
  success: true
}

launches.set(launch.flightNumber, launch);


function getAllLaunches(){
  return Array.from(launches.values());
}



function addNewLaunch(launch){
  launchFlightNumber++;
  launches.set(launchFlightNumber, Object.assign(launch, {
    flightNumber: launchFlightNumber,
    customer: [
      'ZTM', 'NASA'
    ],
    upcoming: true,
    success: true
  }))

}

function existsLaunchWithId(id){
  return launches.has(id);

}

function abortLaunchWithId(id){
  const aborted = launches.get(id)
  aborted.success = false;
  aborted.upcoming = false;
  return aborted;

}


module.exports = {
  getAllLaunches,
  addNewLaunch,
  abortLaunchWithId,
  existsLaunchWithId
}