import {ReactComponent as SearchIcon}  from './assets/searchicon.svg';

let SearchBar = () => {
	return (
		<div className="relative w-full flex rounded-lg border overflow-hidden bg-gray-100 flex flex-grow">
			<SearchIcon className="absolute top-3 left-2.5 w-7 fill-gray-400" />
			<input type='search' className="py-2 pr-4 pl-12 flex bg-gray-100 flex-grow" placeholder="search file name or type" />
		</div>
	)
}

export default SearchBar