import {ReactComponent as Avatar}  from './assets/avatar.svg';
import SearchBar from './SearchBar'

let Header = () => {
	return (
		<div className="text-xl border shadow-inner flex px-6 py-3 space-x-4 ">

			<SearchBar />
			<div className="relative flex rounded-full h-full overflow-hidden bg-gray-200 border border-white w-14 h-14 shadow-md rounded-full justify-center items-center">
				<div className="absolute z-10 top-5 flex w-16 h-20 bg-indigo-500 animate-[spin_8s_linear_infinite] blur"></div>
				<div className="absolute z-0 left-15 flex w-16 h-20 bg-green-500 animate-[spin_20s_linear_infinite] blur"></div>
				<button className="z-40" onClick={ () => { }}>
					<Avatar className=" fill-white w-12 h-12" />
				</button>
			</div>

		</div>
	)
} 

export default Header;