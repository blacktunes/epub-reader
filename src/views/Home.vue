<script lang="jsx">
import { ref, computed, Transition } from 'vue'
import Epub from 'epubjs'

export default {
  setup () {
    const readPercent = ref(0)
    const readTime = ref(0)
    // setInterval(() => {
    //   readTime.value += 1
    // }, 1000)
    const readTimeStr = computed(() => {
      return Math.ceil((readTime.value + 1) / 60)
    })

    const showMunu = ref(false)

    const book = Epub('/test.epub')
    const render = book.renderTo('book', { flow: 'paginated', width: '100%', height: '100%' })
    render.display()

    const prevPage = () => {
      render.prev()
      readPercent.value = getPercent(book.rendition.currentLocation().start.cfi)
    }

    const nextPage = () => {
      render.next()
      readPercent.value = getPercent(book.rendition.currentLocation().start.cfi)
    }

    const getPercent = (cfi) => {
      return book.locations.percentageFromCfi(cfi).toFixed(2)
    }

    book.ready.then(() => {
      book.locations.generate(750 * (window.innerWidth / 375))
        .then(() => {
          // render.display('Text/chapter11.html')
        })
    })

    return () => (
      <div class="book" id="book">
        <div class="wrapper">
          <div onClick={prevPage} class="left" />
          <div onClick={() => { showMunu.value = true }} class="middle" />
          <div onClick={nextPage} class="right" />
          <Transition name="fade">
            {
              showMunu.value ? (
                <div onClick={() => { showMunu.value = false }} class="mask"></div>
              ) : null
            }
          </Transition>
          <Transition name="slide-up">
            {
              showMunu.value ? (
                <div class="menu">menu</div>
              ) : null
            }
          </Transition>
        </div>
        <span class="read-time">已读: {readTimeStr.value}分钟</span>
        <span class="read-percent">{readPercent.value}%</span>
      </div>
    )
  }
}
</script>

<style lang="stylus" scoped>
::v-slotted(.book)
  overflow hidden
  position relative
  height 100%
  width 100%

  .wrapper
    display flex
    z-index 1
    position absolute
    top 0
    left 0
    height 100%
    width 100%

    .mask
      z-index 2
      position absolute
      top 0
      right 0
      height 100%
      width 100%
      background rgba(255, 255, 255, 0.5)

    .menu
      z-index 2
      z-index 3
      position absolute
      bottom 0
      left 0
      height 150px
      width 100%
      background #666

    div
      flex 0 0 33.33%

  .read-percent
    position absolute
    right 30px
    bottom 5px
    font-size 12px
    color #666

  .read-time
    position absolute
    left 15px
    bottom 5px
    font-size 12px
    color #666
</style>
