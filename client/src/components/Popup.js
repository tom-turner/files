export function Popup({content, setPopupContent}){

	if(!content)
		return

	return (
		<div  className="absolute flex items-center justify-center inset-0 z-50 px-3">
			<div onClick={ () => setPopupContent(null)} className="absolute inset-0 w-full h-screen bg-black bg-opacity-20"> </div>
			<div className="bg-white overflow-hidden z-50">
				{content}
			</div>
		</div>
	)
}