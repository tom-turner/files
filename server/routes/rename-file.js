const { Files } = require('../../models')
let path = require('path')

module.exports = async (req,res) => {

	let file = await Tag.findBy({ id: req.params.id, user_id: res.locals.user.id })

	if(!file)
		return res.status(401).json({ error: 'tag does not exist' })

	let ext = path.extname(file.user_file_name)

	await Files.update( tag.id, {
		user_file_name: req.body.fileName + ext
	})

	res.json({ success :true })

}