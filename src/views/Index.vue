<template>
  <div class="shelf">
    <template v-for="item in BooksList" :key="item.name">
      <Card>
        <template v-slot:header>
          <div class="shelf-title">{{ item.name }} - {{ item.author }}</div>
        </template>
        <div class="book-list">
          <template v-for="book in item.list" :key="book.name">
            <div class="book">
              <router-link :to="`/reader?book=${item.name}&name=${book.path}`">
                <Card>
                  <template v-slot:header>
                    <div class="book-title">
                      {{ book.name }}
                    </div>
                  </template>
                  <img
                    class="img"
                    src="../assets/image/loading.png"
                    v-lazy="getUrl(item.name, book.path)"
                  />
                </Card>
              </router-link>
            </div>
          </template>
        </div>
      </Card>
    </template>
  </div>
</template>

<script>
import BooksList from '../../public/book/books.json'
import Card from '../components/common/Card'

export default {
  components: {
    Card
  },
  setup () {
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
