<script lang="ts">
export default {
  globalData: {
    userInfo: null
  },
  onLaunch() {
    console.log('App Launch - MVP Demo Mode')
  },
  onShow() {
    console.log('App Show')
  },
  onHide() {
    console.log('App Hide')
  },
  onError(err: string) {
    console.error('App Error:', err)
  }
}
</script>

<style lang="scss">
@import './styles/common.scss';
</style>