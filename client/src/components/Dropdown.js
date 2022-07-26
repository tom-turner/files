import { useState, useRef } from "react";
import {ReactComponent as DropdownArrow}  from '../assets/dropdown-arrow.svg';
let defaultStyle = { outer: 'bg-green-500 ', inner: 'hover:bg-green-600 hover:bg-opacity-40 ', img: 'fill-white' }

let HiddenList = ({ children, toggle, setToggle }) =>{
	return (
		<div onClick={ () => setToggle(false) } className={`z-50 absolute bg-white border flex flex-col rounded-lg text-gray-800 space-y-2 translate-y-10 -translate-x-5  ${( toggle ? '' : 'hidden')} `} > 
			{children}
		</div>
	)
}

export function Dropdown(props) {
	let [ toggle, setToggle ] = useState(false)
	let style = props.style || defaultStyle

	return (
		<div className={`rounded-lg text-white flex overflow-hidden z-50 ${style.outer} ${props.className}`} >
			<div onClick={ () => { setToggle(!toggle)} } className={`flex cursor-pointer h-full my-auto p-2 min-w-full ${style.inner}`}>
				<props.img className={`w-6 h-6 fill-white ${style.img}`} />
				{ props.title ? <p className="my-auto pl-1 font-semibold pr-3 hidden sm:inline">{props.title}</p> : ''}
			</div>
			<HiddenList children={props.children} toggle={toggle} setToggle={setToggle} />
			<div onClick={ () => setToggle(false) } className={'absolute inset-0 w-full h-screen z-40 ' + ( toggle ? '' : 'hidden')}> </div>
		</div>
	)
}

export function DropdownSplit(props) {
	let [ toggle, setToggle ] = useState(false)
	let style = props.style || defaultStyle

	return (
		<div className={`rounded-lg text-white flex overflow-hidden ${style.outer} ${props.className}`} >
			<div onClick={props.onClick} className={`flex cursor-pointer my-auto py-2 px-3 hover:bg-green-600 ${style.inner}`}>
				<props.img className={`w-6 h-6 fill-white ${style.img}`} />
				{ props.title ? <p className="my-auto font-semibold pl-3 hidden sm:inline">{props.title}</p> : ''}
			</div>
			<div className="flex">
				<DropdownArrow className={`cursor-pointer w-8 h-full hover:bg-green-600 my-auto ${style.img} ${style.inner}`} onClick={ () => { setToggle(!toggle) }} />
				<HiddenList children={props.children} toggle={toggle} setToggle={setToggle} />
			</div>
			<div onClick={ () => setToggle(false) } className={'absolute inset-0 w-full h-screen z-40 ' + ( toggle ? '' : 'hidden')}> </div>
		</div>
	)
}

export function DropdownItem({ title, onClick }) {
	return (
		<button className="text-left text-base z-40 hover:bg-gray-100 px-3 py-1 font-semibold" onClick={onClick} >{title}</button>
	)
}