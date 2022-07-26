const { Tags, Sharing } = require('../../models')

module.exports = async (req,res) => {
	let args = req.body.args

	if(!args)
		return res.status(500).json({ error: 'must supply arguments' })

	let tag = await Tags.findBy({ id: req.body.tagId, user_id: res.locals.user.id })

	if(!tag)
		return res.status(401).json({ error: 'tag does not exist' })

	let sharing = await Sharing.findBy({ tag_id: tag.id })

	if(!sharing) {
		sharing = await Sharing.create({
			user_id: res.locals.user.id,
			tag_id: req.body.tagId,
			public: 0,
			share_slug: `share-${req.body.tagId}`,
		})
	}

	for( let i = 0; i < Object.values(args).length ; i++ ){
		let key = Object.keys(args)[i]	
		let value = Object.values(args)[i]	

		if(key === 'public') 
			Sharing.update( sharing.id, { public : value ? 1 : 0 })

		if(key === 'colour')
			Tags.update( req.body.tagId, { tag_colour: value })
		
		if(key === 'name')
			Tags.update( req.body.tagId, { tag_name: value })

	}


	res.json({ success: true })
}