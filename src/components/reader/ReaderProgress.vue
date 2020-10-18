<script>
import { ref, inject, watch } from 'vue'

export default {
  setup (props, { emit }) {
    const book = inject('book')
    const bookReady = inject('bookReady')
    const loading = inject('loading')
    const progress = ref()
    const readPercent = inject('readPercent')

    const onProgressChange = (e) => {
      loading.value = true
      const cfi = book.locations.cfiFromPercentage(e / 100)
      book.rendition.display(cfi)
        .then(() => {
          loading.value = false
          emit('progress-change')
        })
    }

    const onProgressInput = (e) => {
      readPercent.value = e
    }

    watch(readPercent, () => {
      progress.value.style.backgroundSize = `${readPercent.value}% 100%`
    })

    return () => (
      <div class="reader-progress">
        <div class="progress-wrapper">
          <input
            class="progress"
            type="range"
            max="100"
            min="0"
            step="0.01"
            ref={ progress }
            disabled={ !bookReady.value }
            value={ readPercent.value }
            onChange={ e => { onProgressChange(e.target.value) } }
            onInput={ e => { onProgressInput(e.target.value) } }
          />
        </div>
        <div class="text-wrapper">
          <span>{ bookReady.value ? readPercent.value + '%' : '加载中...' }</span>
        </div>
      </div>
    )
  }
}
</script>

<style lang="stylus" scoped>
::v-slotted(.reader-progress)
  width 100%

  .progress-wrapper
    display flex
    align-items center

    .progress
      width 100%
      appearance none
      height 2px
      margin 10px
      background linear-gradient(#5d6268, #5d6268) no-repeat, #b4b5b7
      background-size 0% 100%

      &:focus
        outline none

      &::-webkit-slider-thumb
        appearance none
        height 18px
        width 18px
        border-radius 50%
        background white
        box-shadow 0 4px 4px 0 rgba(0, 0, 0, 0.15)
        border 1 solid #ddd

  .text-wrapper
    text-align center
    width 100%
    color #333
    font-size 12px
    padding 0 15px
    margin-top 10px
    box-sizing border-box
</style>
