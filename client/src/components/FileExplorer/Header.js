import { useContext } from "react";
import {ReactComponent as Avatar}  from '../../assets/avatar.svg';
import {ReactComponent as SearchIcon}  from '../../assets/searchicon.svg';
import { AuthenticationContext } from "../../lib/withAuthentication"
import { Dropdown, DropdownItem } from '../Dropdown.js'

let SearchBar = ({className, search, tagsList}) => {
	return (
		<div className={ "relative w-full flex rounded-lg border border-zinc-300 shadow-sm bg-white overflow-hidden flex flex-grow " + className} >
			<SearchIcon className="absolute top-2 left-3 w-6 fill-gray-400" />
			<input type='search' className=" py-1 pr-3 pl-11 flex flex-grow bg-white" placeholder="Search" onChange={search} />
			{tagsList}
		</div>
	)
}

let Profile = () =>{
	const { logout } = useContext(AuthenticationContext)
	return (

		<Dropdown title="" img={Avatar} style={{ outer: 'bg-white border border-zinc-300 shadow-sm', inner:'hover:bg-zinc-200', img: 'fill-gray-400' }}>
			<DropdownItem title='My Account' />
			<DropdownItem title='Logout' onClick={logout} />
		</Dropdown>

	)
}

let Header = ({search, tagsList}) => {

	let handleSearch = (e) => {
		let query = e.target.value
		search(query)
	}

	return (
		<div className="text-xl border shadow-inner flex px-6 py-3 space-x-3 bg-zinc-50">
			<Profile />
			<SearchBar className="" search={handleSearch} tagsList={tagsList} />
		</div>
	)
} 

export default Header;