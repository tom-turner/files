export function Loading(){
	return (
		<div className="flex text-5xl font-bold relative bg-white w-full h-screen overflow-hidden items-center justify-center">
			<p className="z-50">Loading...</p>
		</div>
		)
}

export function Error({error}){
	return (
		<div className="flex text-5xl font-bold relative bg-white w-full h-screen overflow-hidden items-center justify-center">
			<p className="z-50">{`${error}`}</p>
		</div>
		)
}