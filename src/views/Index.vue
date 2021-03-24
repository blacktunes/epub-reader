<template>
  <Transition name="fade" appear>
    <div class="shelf">
      <Card>
        <template v-slot:header>
          <div class="shelf-title">咸鱼轻小说</div>
        </template>
        <div class="book-list">
          <template v-for="item in BooksList" :key="item.name">
            <div class="book">
              <router-link :to="`/book?c=${item.name}`">
                <Card>
                  <div class="book-title">
                    {{ item.name }} - {{ item.author }} [{{ item.list.length }}]
                  </div>
                </Card>
              </router-link>
            </div>
          </template>
        </div>
      </Card>
    </div>
  </Transition>
</template>

<script>
import BooksList from '../../public/book/books.json'
import Card from '../components/common/Card'

export default {
  components: {
    Card
  },
  setup() {
    const getUrl = (name, path) => {
      return process.env.NODE_ENV === 'production'
        ? `https://cdn.jsdelivr.net/gh/blacktunes/epub-reader@master/public/book/${name}/${path}.jpg`
        : `/book/${name}/${path}.jpg`
    }
    return {
      BooksList,
      getUrl
    }
  }
}
</script>

<style lang="stylus" scoped>
a
  text-decoration none

.shelf
  box-sizing border-box
  padding 5px

  .shelf-title
    font-size 18px
    font-weight bold
    text-align center
    padding 10px 5px

  .book-list
    display flex
    flex-direction column
    flex-wrap wrap

    .book
      flex 1

      .book-title
        font-size 14px
        text-align center
</style>
