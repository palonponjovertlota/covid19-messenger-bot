const retrieveProfile = require('utils/retrieve-profile')

module.exports = async (req, res, next) => {
  const userId = req.header('X-FB-PSID')
  
  if (! userId) {
    return res.status(401).send('PSID is required')
  }

  const profile = await retrieveProfile(userId, ['first_name', 'gender'])
  res.profile = profile
  next()
}
