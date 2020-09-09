// get.js

const httpStatusToObj = _g.components.httpStatusCategory;
const obj = _g.components.obj;

module.exports = async function(my){

	const { argv, censys, splunk_hec } = my;

	let idFrom = argv.idFrom ? argv.idFrom : 0;
	let filter = argv.filter ? {type: [...argv.filter]} : {};

	let enrichHost = argv.enrichHost ? argv.enrichHost : false;
	let enrichCert = argv.enrichCert ? argv.enrichCert : false;


	let saved = await my.storage.get('lastId.json');
	idFrom = saved ? saved.lastId : idFrom;


	let results = {};
	results = await censys.api.saas.getLogbookCursor( {filter: filter, idFrom: idFrom});

 	let cursor = results.data.cursor;

 	results = await censys.api.saas.getLogbookData({cursor: cursor});
 	let logbookData = results.data;

 	if(results.success && logbookData.length > 0){
 		
 		let enrichCache = {};
 		let eventArray = [];
 		let latestId, lastId;
	
 		while (logbookData.length > 0){
 			let eventChunk = logbookData.splice(0, 50);
 			eventArray = [];
	
 			for(i in eventChunk){
	
 				let event = eventChunk[i];
	
 				let ipAsset = {};
 				if(enrichHost && event.entity.ipAddress){
 					
 					if(enrichCache[event.entity.ipAddress]){
 						ipAsset = enrichCache[event.entity.ipAddress];
		
 					} else {
 						results = await censys.api.saas.getAssetIp(event.entity.ipAddress);
	
 						let httpStatus = httpStatusToObj(results.response.status);
						ipAsset = results.success ? results.data : { status: results.response.status, ...httpStatus };
						enrichCache[event.entity.ipAddress] = ipAsset;
 					}
	
 				}
	
 				let certAsset = {};
 				if(enrichCert && event.data && event.data.sha256){
 					
 					if(enrichCache[event.data.sha256]){
 						certAsset = enrichCache[event.data.sha256];
		
 					} else {
 						results = await censys.api.saas.getAssetCertificate(event.data.sha256);
	
 						let httpStatus = httpStatusToObj(results.response.status);
 						certAsset = results.success ? results.data : { status: results.response.status, ...httpStatus } ;
						enrichCache[event.data.sha256] = certAsset;
 					}
 				}
	
		
 				if(enrichCert && event.entity.sha256){
 					
 					if(enrichCache[event.entity.sha256]){
 						certAsset = enrichCache[event.entity.sha256];
		
 					} else {
 						results = await censys.api.saas.getAssetCertificate(event.entity.sha256);
	
 						let httpStatus = httpStatusToObj(results.response.status);
 						certAsset = results.success ? results.data : { status: results.response.status, ...httpStatus } ;
						enrichCache[event.entity.sha256] = certAsset;
 					}
 				}
	
	
 				let asset = {};
	
 				if (Object.keys(ipAsset).length > 0 ){
 					asset.host = ipAsset;
 				}
	
 				if (Object.keys(certAsset).length > 0 ){
 					asset.certificate = certAsset;
 				}
	
 				event = Object.keys(asset).length > 0 ? { ...event, asset: asset } : event;
	
 				eventArray.push( {event: event} );
 				latestId = event.id;
 			}
	
 			results = await splunk_hec.sendEvents(eventArray);
	
 			// lastId = results.success ? latestId : lastId
	
 			if(results.success){
 				lastId = latestId;
	
 			} else {
 				break;
 			}
	
	
 		}
 		await my.storage.put({lastId: lastId+1},'lastId.json', `tasks/${my.taskName}/input`)
	
 	}

 	

}