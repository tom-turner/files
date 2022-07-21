import { useState, useEffect } from "react";
import { removeTag } from '../../lib/api'
import {ReactComponent as Delete}  from '../../assets/delete-cross.svg';

export function TagComponent({tag, selectedTag, handleTagClick, className, search}) {
	let [ active, setActive ] = useState(false)
	let [ clicked, setClicked ] = useState(false)

	useEffect(() => {
		selectedTag.id === tag.id ? setActive(true) : setActive(false)
	}, [selectedTag] )

	let clickFunc = () => {
      handleTagClick({ tag, clicked, active })
      setClicked(true)
      setTimeout(() => {
        setClicked(false)
      },350)
	}

	let dragFunc = (e) => {
		setActive(true)
	}

	return (
		<div draggable="true" onDragStart={dragFunc} onClick={clickFunc} className={" font-extrabold flex px-3 py-2 rounded-lg text-sm text-white space-x-3 cursor-pointer border-2 " + ( active ? "border-green-500 " : "border-stone-400" )} style={{backgroundColor: tag.tag_colour}}>
      <p className="truncate"> {tag.tag_name} </p>
    </div>
	)
}

export function Tag({tag, file}){
	if(!tag)
		return

	return (
		<div className={"truncate px-4 cursor-auto group text-white rounded-full rounded-tl-md py-1 whitespace-nowrap flex justify-center "} style={{backgroundColor: tag.tag_colour}} >
			<p>{tag.tag_name}</p>
			<Delete className="w-3 h-3 my-auto mx-auto group-hover:inline hidden ml-3 fill-white cursor-pointer" onClick={ () => { removeTag(file.id, tag.id) } } />
		</div>
	)
}

export function Tags({ state, setState, handleTagClick }){
  let tags = state.data.tags

  if(!tags)
  	return
  
  const listTags = tags.map((tag) => {
    return (
        <TagComponent key={tag.id} tag={tag} selectedTag={ state.selectedTag } handleTagClick={ (e) => handleTagClick(e) } search={ (e) => state.setData(e) } />
    )
  });

  return (
    <div className="flex flex-col w-64 bg-stone-700 p-6 space-y-3 overflow-x-clip">
      {listTags}
    </div>
  )
}


