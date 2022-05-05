const { Tags } = require('../../models')

module.exports = async (req,res) => {

	let tag = await Tag.findBy({ id: req.params.id, user_id: res.locals.user.id })

	if(!tag)
		return res.status(401).json({ error: 'tag does not exist' })

	await Tags.update( tag.id, {
		tag_name: req.body.tagName || tag.tag_name,
		tag_colour: req.body.tagColour || tag.tag_colour
	})

	res.json({ success: true })

}