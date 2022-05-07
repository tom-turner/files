import { useState, useEffect } from "react";

let TagComponent = ({tag, selectedTag, setSelectedTag, className, setSelectedFiles, search}) => {
	let [ active, setActive ] = useState(false)
	let [ clicked, setClicked ] = useState(false)

	useEffect(() => {
		if (!selectedTag)
			return 

		selectedTag.id === tag.id ? setActive(true) : setActive(false)
	}, [selectedTag] )

	let clickFunc = () => {
	  if(clicked){
        search(tag.tag_name)
      }
      setSelectedFiles([])
      setClicked(true)
      setTimeout(() => {
        setClicked(false)
      },350)

      if(active){
      	setSelectedTag({})
      	
      } else{
      	setSelectedTag(tag)
      }
	}

	let dragFunc = (e) => {
		setActive(true)
	}

	return (
		<div draggable="true" onDragStart={dragFunc} onClick={clickFunc} className={"truncate flex px-4 py-1 rounded-full rounded-tl-md text-sm text-white space-x-3 cursor-pointer border-4 " + ( active ? "border-green-500 " : "border-white" )} style={{backgroundColor: tag.tag_colour}}>
      <p> {tag.tag_name} </p>
    </div>
	)
}

export default TagComponent