<template>
  <div class="Container">
    <img
      alt="kt.team logo"
      src="../assets/kt-logo.png"
    >
    <todo-list />
  </div>
</template>

<script>
// @ is an alias to /src
import TodoList from '@/components/TodoList.vue'

export default {
  name: 'Home',
  components: {
    TodoList
  }
}
</script>

<style lang="scss">
@import '../assets/scss/index.scss';
</style>