const router = require('express').Router()
const messagesApi = require('api/messages')
const sendApi = require('api/send')
const testingCentersApi = require('api/testing-centers')
const { getNearByLocation } = require('api/nearby-search')

const requireLocation = require('middleware/require-location')

router.get('/:type', requireLocation, async (req, res) => {
  const { userId, lastLocation } = res

  switch (req.params.type) {
    case 'TESTING_CENTERS':
      const testingCenters = testingCentersApi.nearest({
        latitude: lastLocation.latitude,
        longitude: lastLocation.longitude,
      })

      const distanceIcon = (i) => {
        if (i === 0) return '🚕'
        if (i === 1) return '🚌'
        if (i === 2) return '🚆'
        else return '🚀'
      }

      const arrayOfNearestTestCenter = []
      const pushObjectToArray = () => {
        return testingCenters.map((testingCenter, i) => {
          return arrayOfNearestTestCenter.push({
            title: `${testingCenter.name}`,
            subtitle: `${distanceIcon(i)} ${testingCenter.distance} Kilometers away  ${
              testingCenter.verified ? '✅ Verified by WHO ' : ''
            }`,
          })
        })
      }
      await pushObjectToArray()
      sendApi.sendMessage(userId, messagesApi.nearestTestingCentersMessage(arrayOfNearestTestCenter))
      break
    case 'BANKS':
      const nearbyBanks = getNearByLocation('banks', lastLocation, 3000)
   
      // const parse = () => {
      //   return arrayOfResults.map((value, i) => {
      //     return arrayOfResults.push({
      //       title: `${value.name}`,
      //       subtitle: `${value.vicinity}`
      //     })
      //   })
      // }
      // await parse()

      console.log(nearbyBanks)
      // sendApi.sendMessage(userId, messagesApi.nearBySearchMessage(arrayOfResults, 'Nearby banks at you'))
      break
    case 'PHARMACIES':
      const nearbyPharmacies = getNearByLocation('pharmacies', lastLocation, 2000)
      sendApi.sendMessage(userId, messagesApi.nearBySearchMessage(nearbyPharmacies, 'Nearby pharmacies at you'))
      break
    case 'GROCERY_STORES':
      const nearbyMarkets = getNearByLocation('supermarket/groccery', lastLocation, 2000)
      sendApi.sendMessage(userId, messagesApi.nearBySearchMessage(nearbyMarkets, 'Nearby grocery stores at you'))
      break
    case 'HOSPITALS':
      const nearbyHospitals = getNearByLocation('hospitals', lastLocation, 2000)
      sendApi.sendMessage(userId, messagesApi.nearBySearchMessage(nearbyHospitals, 'Nearby hospitals at you'))
      break
    case 'POLICE_STATIONS':
      const nearbyPoliceStations = getNearByLocation('police stations', lastLocation, 2000)
      sendApi.sendMessage(
        userId,
        messagesApi.nearBySearchMessage(nearbyPoliceStations, 'Nearby police stations at you')
      )
      break

    default:
      sendApi.sendMessage(userId, messagesApi.underDevelopmentMessage())
      break
  }
})

module.exports = router
