import lazyload from './lazyload'

const LazyPlugin = {}

LazyPlugin.install = (Vue) => {
  Vue.directive('lazy', lazyload)
}

export default LazyPlugin
