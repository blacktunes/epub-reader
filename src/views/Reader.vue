<script>
import { ref, provide, computed, watch, onMounted, onUnmounted, Transition } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Epub from 'epubjs'
import ReaderProgress from '@/components/reader/ReaderProgress'

export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    if (!route.query.c || !route.query.n) {
      router.push('/')
      return () => (<></>)
    }

    const showMunu = ref(false)
    const bookReady = ref(false)
    provide('bookReady', bookReady)
    const loading = ref(false)
    provide('loading', loading)

    const book = Epub(process.env.NODE_ENV === 'production'
      ? `https://cdn.jsdelivr.net/gh/blacktunes/epub-reader@master/public/book/${route.query.c}/${route.query.n}.epub`
      : `/book/${route.query.c}/${route.query.n}.epub`)
    const rendition = book.renderTo('book', {
      flow: 'paginated',
      width: '100%',
      height: '100%'
    })
    provide('book', book)
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
          setLocalStorage()
        })
    }

    const setLocalStorage = () => {
      const bookData = JSON.stringify({
        cfi: location.value ? location.value.cfi : null,
        time: readTime.value
      })
      localStorage.setItem(route.query.n, bookData)
    }

    const currentChapter = ref('')
    const readPercent = ref(0)
    provide('readPercent', readPercent)
    const readTime = ref(0)
    let timer
    const readTimeStr = computed(() => {
      return Math.ceil((readTime.value + 1) / 60)
    })

    const bookRef = ref()

    onMounted(() => {
      const bookLocalStorage = localStorage.getItem(route.query.n)
      const bookData = bookLocalStorage ? JSON.parse(bookLocalStorage) : { time: 0 }
      readTime.value = bookData.time
      book.ready.then(() => {
        book.loaded.metadata
          .then(data => {
            currentChapter.value = data.title
          })
        currentChapter.value = book.loaded.metadata.title
        book.locations.generate((bookRef.value.offsetHeight * bookRef.value.offsetWidth) / 500)
          .then(() => {
            timer = setInterval(() => {
              readTime.value += 1
              setLocalStorage()
            }, 1000)
            rendition.display(bookData.cfi || undefined)
              .then(() => {
                bookReady.value = true
                watch(location, () => {
                  const newLocation = book.navigation.toc.find(item => {
                    return item.href.split(/(-ima\.xhtml)|(\.xhtml)|(-ima\.html)|(\.html)/)[0] === location.value.href.split(/(-ima\.xhtml)|(\.xhtml)|(-ima\.html)|(\.html)/)[0]
                  })
                  currentChapter.value = newLocation ? newLocation.label : ''
                  readPercent.value = (book.locations.percentageFromCfi(location.value.cfi) * 100).toFixed(2)
                })
                location.value = rendition.currentLocation().start
              })
          })
      })
    })

    onUnmounted(() => {
      clearInterval(timer)
      timer = null
    })

    return () => (
      <div class="reader">
        <div class="chapter">{ currentChapter.value }</div>
        <div class="book" id="book" style={ { opacity: bookReady.value ? 1 : 0 } } ref={ bookRef }></div>
        <Transition name="loading">
          {
            !bookReady.value || loading.value ? (
              <div class="loading">loading···</div>
            ) : null
          }
        </Transition>
        <div class="wrapper">
          <div onClick={ prevPage } class="left" />
          <div onClick={ () => { showMunu.value = true } } class="middle" />
          <div onClick={ nextPage } class="right" />
          <Transition name="fade">
            {
              showMunu.value ? (
                <div onClick={ () => { showMunu.value = false } } class="mask"></div>
              ) : null
            }
          </Transition>
          <Transition name="slide-up">
            {
              showMunu.value ? (
                <div class="menu">
                  <ReaderProgress onProgress-change={ updateLocation } />
                </div>
              ) : null
            }
          </Transition>
        </div>
        <span class="read-time">已读: { readTimeStr.value }分钟</span>
        <span class="read-percent">{ readPercent.value || '-' }%</span>
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
      z-index 3
      position absolute
      bottom 0
      left 0
      width 100%
      padding 15px
      background #eee
      box-sizing border-box

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
    z-index 4
    position absolute
    top 50%
    left 50%
    transform translate3d(-50%, -50%, 0)
    color #444
    // height 50px
    // width 100px
    // background #eee
    // line-height 50px
    // text-align center
    // border-radius 10px
    // border 1px solid #ddd

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
