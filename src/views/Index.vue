<template>
  <div v-for="item in BooksList" :key="item.name">
    {{item.name}} - {{item.author}}
    <div v-for="book in item.list" :key="book.name" @click="read(item.name, book.path)">
      <router-link :to="`/reader?book=${item.name}&name=${book.path}`">
        <p>{{book.name}}</p>
        <img style="width: 100px" :src="`/book/${item.name}/${book.path}.jpg`">
      </router-link>
    </div>
  </div>
</template>

<script>
import BooksList from '../../public/book/books.json'

export default {
  setup () {
    console.log(BooksList)

    const read = (name, path) => {

    }

    return {
      BooksList,
      read
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
