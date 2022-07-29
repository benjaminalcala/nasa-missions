const { setNewLaunch, getAllLaunches, existsLaunchWithId, abortLaunchWithId } = require( "../../models/launches.model");



async function httpGetAllLaunches(req, res){
  return res.status(200).json(await getAllLaunches());

}

async function httpAddNewLaunch(req, res){
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

  await setNewLaunch(launch);
  return res.status(201).json(launch);
  
}

async function httpAbortLaunch(req, res){
  const launchId = Number(req.params.id);
  const existsLaunch = await existsLaunchWithId(launchId);
  if(!existsLaunch){
    return res.status(404).json({
      error: 'launch not found'
    })
  }

  const aborted = await abortLaunchWithId(launchId);
  if(!aborted){
    return res.status(400).json({
      error: 'launch not aborted'
    })
  }
  return res.status(200).json({ok: true});

}

module.exports = {
  httpAddNewLaunch,
  httpGetAllLaunches,
  httpAbortLaunch
}