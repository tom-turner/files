import { useContext } from "react";
import {ReactComponent as Avatar}  from '../../assets/avatar.svg';
import {ReactComponent as SearchIcon}  from '../../assets/searchicon.svg';
import { AuthenticationContext } from "../../lib/withAuthentication"

let SearchBar = ({className}) => {
	return (
		<div className={ "relative w-full flex rounded-lg border overflow-hidden bg-gray-100 flex flex-grow " + className} >
			<SearchIcon className="absolute top-2 left-2.5 w-7 fill-gray-400" />
			<input type='search' className="py-2 pr-4 pl-12 flex bg-gray-100 flex-grow" placeholder="search file name or type" />
		</div>
	)
}

let Profile = () =>{
	const { logout } = useContext(AuthenticationContext)
	return (
		<button onClick={logout} className="relative flex rounded-lg h-full group overflow-hidden bg-gray-200 shadow-md rounded-full justify-center items-center">
			<div className="absolute z-10 top-5 flex w-16 h-20 bg-gray-500 group-hover:bg-indigo-500 animate-[spin_8s_linear_infinite] blur"></div>
			<div className="absolute z-0 left-15 flex w-16 h-20 bg-gray-400 group-hover:bg-indigo-400 animate-[spin_20s_linear_infinite] blur"></div>
			<Avatar className="z-40 fill-gray-800 group-hover:fill-white w-12 h-12" />
		</button>
	)
}

let Header = () => {
	return (
		<div className="text-xl border shadow-inner flex px-6 py-3 space-x-3">
			<SearchBar className="" />
		</div>
	)
} 

export default Header;