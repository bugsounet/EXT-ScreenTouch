/**********************
*  EXT-TouchScreen v1 *
*  Bugsounet          *
*  03/2022            *
**********************/

Module.register("EXT-ScreenTouch", {
  requiresVersion: "2.18.0",
  defaults: {
    mode: 3
  },

  notificationReceived: function (notification, payload, sender) {
    switch(notification) {
      case "DOM_OBJECTS_CREATED":
        this.sendSocketNotification("INIT")
        this.touchScreen(this.config.mode)
        break
      case "GAv4_READY":
        if (sender.name == "MMM-GoogleAssistant") this.sendNotification("EXT_HELLO", this.name)
        break
    }
  },

  getDom: function() {
    var dom = document.createElement("div")
    dom.style.display = 'none'
    return dom
  },

  getScripts: function () {
    return [
      "/modules/EXT-Screen/scripts/long-press-event.js"
    ]
  },

  touchScreen: function (mode) {
    let clickCount = 0
    let clickTimer = null
    let TouchScreen = document.getElementById("EXT-SCREEN")
    if (mode > 3) mode = 3
    if (!TouchScreen) {
      this.sendNotification("EXT_ALERT", {
        message: "EXT-Screen is not installed!",
        type: "error",
      })
      return
    }
    switch (mode) {
      case 1:
        /** mode 1 **/
        window.addEventListener('click', () => {
          clickCount++
          if (clickCount === 1) {
            clickTimer = setTimeout(() => {
              clickCount = 0
              this.sendNotification("EXT_SCREEN-WAKEUP")
            }, 400)
          } else if (clickCount === 2) {
            clearTimeout(clickTimer)
            clickCount = 0
            this.sendNotification("EXT_SCREEN-END")
          }
        }, false)
        break
      case 2:
        /** mode 2 **/
        TouchScreen.addEventListener('click', () => {
          if (clickCount) return clickCount = 0
          if (!this.hidden) this.sendNotification("EXT_SCREEN-WAKEUP")
        }, false)

        window.addEventListener('long-press', () => {
          clickCount = 1
          if (this.hidden) this.sendNotification("EXT_SCREEN-WAKEUP")
          else this.sendNotification("EXT_SCREEN-END")
          clickTimer = setTimeout(() => { clickCount = 0 }, 400)
        }, false)
        break
      case 3:
        /** mode 3 **/
        TouchScreen.addEventListener('click', () => {
          clickCount++
          if (clickCount === 1) {
            clickTimer = setTimeout(() => {
              clickCount = 0
              this.sendNotification("EXT_SCREEN-WAKEUP")
            }, 400)
          } else if (clickCount === 2) {
            clearTimeout(clickTimer)
            clickCount = 0
            this.sendNotification("EXT_SCREEN-END")
          }
        }, false)

        window.addEventListener('click', () => {
          if (!this.hidden) return
          clickCount = 3
          this.sendNotification("EXT_SCREEN-WAKEUP")
          clickTimer = setTimeout(() => { clickCount = 0 }, 400)
        }, false)
        break
    }
    if (!mode) console.log("[TOUCH] Touch Screen Function disabled.")
    else console.log("[TOUCH] Touch Screen Function added. [mode " + mode +"]")
  }
});
