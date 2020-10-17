<script lang="jsx">
import { ref, computed, watch, onMounted, Transition } from 'vue'
import { useRoute } from 'vue-router'
import Epub from 'epubjs'

export default {
  setup () {
    const router = useRoute()

    const showMunu = ref(false)
    const bookReady = ref(false)

    const book = Epub(`/book/${router.query.book}/${router.query.name}.epub`)
    const rendition = book.renderTo('book', {
      flow: 'paginated',
      width: '100%',
      height: '100%'
    })
    // rendition.themes.fontSize('14px')

    const prevPage = () => {
      if (bookReady.value) {
        rendition.prev()
        updateLocation()
      }
    }

    const nextPage = () => {
      if (bookReady.value) {
        rendition.next()
        updateLocation()
      }
    }

    const location = ref()

    const updateLocation = () => {
      rendition.reportLocation()
        .then(() => {
          location.value = rendition.currentLocation().start
          localStorage.setItem(router.query.name, location.value.cfi)
        })
    }

    const currentChapter = ref('')
    const readPercent = ref('-')
    const readTime = ref(0)
    // setInterval(() => {
    //   readTime.value += 1
    // }, 1000)
    const readTimeStr = computed(() => {
      return Math.ceil((readTime.value + 1) / 60)
    })

    const bookRef = ref()

    onMounted(() => {
      book.ready.then(() => {
        book.loaded.metadata
          .then(data => {
            currentChapter.value = data.title
          })
        currentChapter.value = book.loaded.metadata.title
        book.locations.generate((bookRef.value.offsetHeight * bookRef.value.offsetWidth) / 500)
          .then(() => {
            bookReady.value = true
            rendition.display(localStorage.getItem(router.query.name) || undefined)
              .then(() => {
                watch(location, () => {
                  currentChapter.value = book.navigation.toc[location.value.index].label
                  readPercent.value = (book.locations.percentageFromCfi(location.value.cfi) * 100).toFixed(2)
                })
                location.value = rendition.currentLocation().start
              })
          })
      })
    })

    return () => (
      <div class="reader">
        <div class="chapter">{currentChapter.value}</div>
        <div class="book" id="book" style={{ opacity: bookReady.value ? 1 : 0 }} ref={bookRef}></div>
        <Transition name="fade">
          {
            !bookReady.value ? (
              <div class="loading">loading···</div>
            ) : null
          }
        </Transition>
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
::v-slotted(.reader)
  overflow hidden
  position relative
  height 100%
  width 100%

  .chapter
    position absolute
    top 5px
    left 15px
    font-size 12px
    color #666

  .wrapper
    // pointer-events none
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

  .book
    position absolute
    top 10px
    left 0
    width 100%
    height calc(100% - 10px - 10px)
    transition opacity 0.5s

  .loading
    position absolute
    top 50%
    left 50%
    transform translate3d(-50%, -50%, 0)

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
