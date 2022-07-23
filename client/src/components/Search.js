import { useContext } from "react";
import {ReactComponent as SearchIcon}  from '../assets/searchicon.svg';
import { Dropdown, DropdownItem } from './Dropdown.js'

let SearchBar = ({className, search, tagsList}) => {
	return (
		<div className={ "relative w-full flex rounded-full bg-white flex flex-grow " + className} >
			<SearchIcon className="absolute top-2.5 left-3.5 w-6 fill-gray-400" />
			<input type='search' className="rounded-full py-2 pr-3 pl-11 flex flex-grow bg-white" placeholder="Search" onChange={search} />
			{tagsList}
		</div>
	)
}

let Search = ({fn, tagsList, className}) => {

	let handleSearch = (e) => {
		let query = e.target.value
		fn(query)
	}

	return (
		<div className={`flex ${className}`}>
			<SearchBar className="" search={handleSearch} tagsList={tagsList} />
		</div>
	)
} 

export default Search;