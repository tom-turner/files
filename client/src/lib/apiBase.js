let isPublicIP = (hostname) => {
	const isIpRegex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;
	return isIpRegex.test(hostname) && !isPrivateIP(hostname)
}

let isPrivateIP = (hostname) => {
   var parts = hostname.split('.');
   return parts[0] === '10' || 
    	(parts[0] === '172' && (parseInt(parts[1], 10) >= 16 && parseInt(parts[1], 10) <= 31)) || 
    	(parts[0] === '192' && parts[1] === '168');
}

let isLocal = (hostname) => {
	return hostname === 'localhost' || hostname.endsWith('.local') || isPrivateIP(hostname)
}

export function getApiBase(hostname, protocol){
	let backEndPort = process.env.REACT_APP_SERVER_PORT
	hostname = hostname || window.location.hostname
	protocol = protocol || window.location.protocol

	console.log(process.env.REACT_APP_SERVER_PORT)

	if(isLocal(hostname))
		return `${protocol}//${hostname}:${backEndPort}`

	if(isPublicIP(hostname))
		return `${protocol}//${hostname}:${backEndPort}`

	//return `${protocol}//api.${hostname}`
	return `${protocol}//${hostname}:${backEndPort}`
}