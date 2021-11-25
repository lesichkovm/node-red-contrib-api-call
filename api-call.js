const axios = require('axios')

module.exports = function (RED) {
  function ApiCall(config) {
    RED.nodes.createNode(this, config)
    var node = this

    node.property = config.property || 'response'
    node.propertyType = config.propertyType || 'msg'
    node.apiurl = config.apiurl
    node.apikey = config.apikey
    node.apitoken = config.apitoken
    node.apimethod = config.apimethod
    node.apiauthorization = config.apiauthorization

    node.debug = false // development flag only

    // ======================================================================= //
    // ==  START: On Close                                                  == //
    // ======================================================================= //
    node.on('close', (done) => {
      node.done()
    })
    // ======================================================================= //
    // ==  END: On Close                                                    == //
    // ======================================================================= //

    // ======================================================================= //
    // ==  START: On Input                                                  == //
    // ======================================================================= //
    node.on('input', (msg, send, done) => {
      //try {
      let data = {
        ...msg.payload,
      }
      let headers = {
        ...msg.headers,
      }

      if (node.apiauthorization == 'api_key') {
        data.api_key = node.apikey
      }

      if (node.apiauthorization == 'bearer_token') {
        headers.Authorization = 'Bearer ' + node.apitoken
      }

      if (node.debug) {
        msg.apikey = node.apikey
        msg.apiurl = node.apiurl
        msg.apimethod = node.apimethod
        msg.apiauthorization = node.apiauthorization

        node.warn('Axios URL')
        node.warn(node.apiurl)
        node.warn('Axios Authorization')
        node.warn(node.apiauthorization)
        node.warn('Axios Method')
        node.warn(node.apimethod)
      }

      // START: Post the request to the API
      let axiosConfig = {
        method: node.apimethod,
        responseType: 'json',
        url: node.apiurl,
        headers: headers,
      }

      if (
        node.apimethod === 'delete' ||
        node.apimethod === 'head' ||
        node.apimethod === 'post' ||
        node.apimethod === 'put'
      ) {
        axiosConfig.data = data
        node.warn('Axios Data')
        node.warn(data)
      }

      if (node.apimethod === 'get') {
        axiosConfig.params = data
        node.warn('Axios Params')
        node.warn(data)
      }

      axios(axiosConfig)
        .then(function (response) {
          node.status({ fill: 'green', shape: 'dot', text: 'call ok' })

          if (node.debug) {
            msg.response = response
          }

          // START: Set response to the set property
          if (node.propertyType === 'msg') {
            RED.util.setMessageProperty(msg, node.property, response.data)
            send(msg)
            done()
          } else if (
            node.propertyType === 'flow' ||
            node.propertyType === 'global'
          ) {
            var context = RED.util.parseContextStore(node.property)
            var target = node.context()[node.propertyType]
            target.set(context.key, response.data, context.store, function (
              err,
            ) {
              if (err) {
                done(err)
              } else {
                send(msg)
                done()
              }
            })
          } else {
            // should never reach here
            msg.payload = response.data
            send(msg)
            done()
          }
          // END: Set response to the set property
        })
        .catch(function (error) {
          node.error('http : connection error', msg)
          node.status({
            fill: 'red',
            shape: 'dot',
            text: 'HTTP connection error',
          })
          msg.payload = error
          node.send(msg)
        })
      // END: Post the request to the API
    })
    // ======================================================================= //
    // ==   END: On Input                                                   == //
    // ======================================================================= //
  }

  // Registering the node-red type
  RED.nodes.registerType('api call', ApiCall)
}
