/*************************************
* node_helper for EXT-ScreenTouch v1 *
* BuGsounet ©03/22                   *
*************************************/

const NodeHelper = require('node_helper')

module.exports = NodeHelper.create({

  initialize: async function() {
    console.log("[TOUCH] EXT-ScreenTouch Version:", require('./package.json').version, "rev:", require('./package.json').rev)
  },

  socketNotificationReceived: function (notification, payload) {
    switch(notification) {
      case "INIT":
        this.initialize()
        break
    }
  }
});
