const { addNewLaunch, getAllLaunches, existsLaunchWithId, abortLaunchWithId } = require( "../../models/launches.model");



function httpGetAllLaunches(req, res){
  return res.status(200).json(getAllLaunches());

}

function httpAddNewLaunch(req, res){
  const launch = req.body;
  if(!launch.mission || !launch.rocket || !launch.target || !launch.launchDate){
    return res.status(400).json({
      error: 'missing launch property'
    })
  }
  launch.launchDate = new Date(launch.launchDate);
  if(isNaN(launch.launchDate)){
    return res.status(400).json({
      error: 'invalid launch date'
    })
  }

  addNewLaunch(launch);
  return res.status(201).json(launch);
  
}

function httpAbortLaunch(req, res){
  const launchId = Number(req.params.id);
  if(!existsLaunchWithId(launchId)){
    return res.status(404).json({
      error: 'launch not found'
    })
  }

  const aborted = abortLaunchWithId(launchId);
  return res.status(200).json(aborted);

}

module.exports = {
  httpAddNewLaunch,
  httpGetAllLaunches,
  httpAbortLaunch
}