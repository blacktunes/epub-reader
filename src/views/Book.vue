<script>
import BooksList from '../../public/book/books.json'
import Card from '../components/common/Card'
import { useRoute, useRouter } from 'vue-router'
import { Transition } from 'vue'

export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    if (!route.query.c) {
      router.push('/')
      return () => (<></>)
    }

    const book = BooksList.find(item => {
      return item.name === route.query.c
    }) || {
      name: '',
      author: '',
      list: []
    }

    const getUrl = (name, path) => {
      return process.env.NODE_ENV === 'production'
        ? `https://cdn.jsdelivr.net/gh/blacktunes/epub-reader@master/public/book/${name}/${path}.jpg`
        : `/book/${name}/${path}.jpg`
    }

    return () => (
      <Transition name="fade" appear>
        <div class="shelf">
          <Card v-slots={ {
            header: () => <div class="shelf-title">{ book.name } - { book.author } [{ book.list.length }]</div>
          } }>
            <div class="book-list">
              {
                book.list.map(item => (
                  <div class="book">
                    <router-link to={ `/reader?c=${book.name}&n=${item.path}` }>
                      <Card v-slots={ {
                        header: () => (
                          <div class="book-title">
                            { item.name }
                          </div>
                        )
                      } }>
                        <img
                          class="img"
                          src={ require('../assets/image/loading.png') }
                          v-lazy={ getUrl(book.name, item.path) }
                        />
                      </Card>
                    </router-link>
                  </div>)
                )
              }
            </div>
          </Card>
        </div>
      </Transition>
    )
  }
}
</script>

<style lang="stylus" scoped>
::v-slotted(.shelf)
  box-sizing border-box
  padding 5px

  a
    text-decoration none

  .shelf-title
    text-align center
    padding 10px 5px

  .book-list
    display flex
    flex-wrap wrap
    justify-content space-between

    .book
      flex 0 0 50%

      .book-title
        font-size 12px
        text-align center

      .img
        width 100%
</style>
