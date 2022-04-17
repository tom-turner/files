import {ReactComponent as Avatar}  from './assets/avatar.svg';

let Header = () => {
	return (
		<div className="border shadow-inner flex px-6 py-3 space-x-4 ">
			<div className="w-full flex ">
				<input type='text' className="px-2 flex flex-grow rounded-lg border bg-gray-100" placeholder="search" />
			</div>

			<div className="flex rounded-full h-full w-10 h-10 items-center">
				<button onClick={ () => { }}>
					<Avatar className="fill-gray-800 w-10 h-10" />
				</button>
			</div>

		</div>
	)
} 

export default Header;