const axios = require('axios')

module.exports = function (RED) {
  function ApiCall(config) {
    RED.nodes.createNode(this, config)
    var node = this

    this.field = config.field || 'response'
    this.fieldType = config.fieldType || 'msg'
    node.apiurl = config.apiurl
    node.apikey = config.apikey
    node.apimethod = config.apimethod

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
      var data = {
        //api_key: node.apikey,
        //...msg.payload,
        api_key: '123',
      }
      msg.apikey = node.apikey
      msg.apiurl = node.apiurl
      msg.apimethod = node.apimethod

      node.warn(data)

      // START: Post the request to the API
      axios({
        method: node.apimethod,
        responseType: 'json',
        url: node.apiurl,
        headers: {
          Authorization: 'Bearer ' + node.apikey,
        },
        data: data,
      })
        .then(function (response) {
          node.status({ fill: 'green', shape: 'dot', text: 'call ok' })
          msg.response = response
          msg.payload = response.data
          node.send(msg)
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

      //node.status({ fill: 'green', shape: 'dot', text: 'query built ok' })
      // } catch (error) {
      //   node.error('api : error' + JSON.stringify(error))
      //   node.status({ fill: 'red', shape: 'dot', text: 'api call failed' })
      //   msg.payload = error
      // }

      // Set msg to the set property
      // if (node.fieldType === 'msg') {
      //   var apiResponse = {}
      //   RED.util.setMessageProperty(msg, node.field, apiResponse)
      //   send(msg)
      //   done()
      // } else if (node.fieldType === 'flow' || node.fieldType === 'global') {
      //   var context = RED.util.parseContextStore(node.field)
      //   var target = node.context()[node.fieldType]
      //   target.set(context.key, sql, context.store, function (err) {
      //     if (err) {
      //       done(err)
      //     } else {
      //       send(msg)
      //       done()
      //     }
      //   })
      // } else {
      //   // should never reach here
      //   msg.payload = {}
      //   send(msg)
      //   done()
      // }
    })
    // ======================================================================= //
    // ==   END: On Input                                                   == //
    // ======================================================================= //
  }

  // Registering the node-red type
  RED.nodes.registerType('api call', ApiCall)
}
