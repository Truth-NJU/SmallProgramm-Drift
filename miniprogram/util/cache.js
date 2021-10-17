let Cache = function () {

}
let memory = {}

Cache.prototype = {
  update: function (tag, content) {
    memory[tag] = content
    return content
  },

  get: function (tag) {
    return memory[tag]
  },

  delete: function (tag) {
    memory[tag] = undefined
  },

  letmeseesee: function () {
    for (let key in memory) {
      console.log(key + '----' + memory[key])
    }
  }
}

let cache = new Cache()

export default {
  cache
}