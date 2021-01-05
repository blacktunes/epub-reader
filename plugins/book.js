const fs = require('fs')
const path = require('path')

const data = []

const uri = path.join(__dirname, '../public/book')
const dirlist = fs.readdirSync(uri)
dirlist.forEach(dir => {
  if (!dir.includes('.json') && !dir.includes('.js')) {
    const filelist = fs.readdirSync(uri + '/' + dir)
    const books = {
      name: dir,
      author: '',
      list: []
    }
    filelist.forEach(item => {
      if (!item.includes('.jpg')) {
        const name = item.split('.epub')[0]
        const obj = {
          name: name,
          path: name
        }
        books.list.push(obj)
      }
    })
    data.push(books)
  }
})

fs.writeFileSync(uri + '/books.json', JSON.stringify(data, null, 2))
