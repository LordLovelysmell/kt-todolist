<template>
  <div>
    <div class="Sticky">
      <h1 class="Title">
        Задачи
      </h1>
      <div class="AdaptiveWrapper">
        <div class="TodoInput">
          <textarea
            v-model="txt"
            type="text"
            placeholder="Введите название задачи..."
            @keydown.enter.exact.prevent
            @keyup.enter.exact="add"
          />
        </div>
        <button
          class="Button"
          @click="add"
        >
          Добавить
        </button>
      </div>
    </div>

    <button
      v-if="todos.length > 1"
      class="Button Button--blue"
      @click="sort"
    >
      {{ isSortedText }}
    </button>

    <p v-if="todos.length === 0">
      {{ descriptionMessage }}
    </p>

    <ul>
      <li
        v-for="(todo, index) in todos"
        :key="index"
        class="TodoItem"
      >
        <p class="TodoItem__title">
          {{ todo.name }}
        </p>
        <div
          class="TodoItem__removeButton"
          :data-id="todo.id"
          @click="remove"
        >
          <font-awesome-icon :icon="timesIcon" />
        </div>
      </li>
    </ul>

    <ul
      v-if="todosAmount / todosPerPage > 1"
      class="Pagination"
    >
      <li
        v-for="(page, index) in pagesAmount"
        :key="index"
        class="Pagination__item"
        :class="dataPage.currentPage == (index + 1) ? 'is-active' : ''"
      >
        <router-link
          class="Pagination__link"
          :to="'/?page=' + (index + 1)"
        >
          {{ index + 1 }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  import { faTimes } from '@fortawesome/free-solid-svg-icons';
  import { mapState } from 'vuex';

  export default {
    name: 'TodoList',
    data() {
      return {
        todos: [],
        txt: '',
        isSorted: false,
        isSortedText: 'Сначала новые задачи',
        descriptionMessage: 'Загрузка списка задач...',
        todosPerPage: 10,
        dataPage: {
          currentPage: 1,
          start: 0,
          end: 10,
        }
      };
    }, 
    computed: {
      timesIcon() {
        return faTimes
      },
      ...mapState({
        todosList: state => state.task.todos,
        todosAmount: state => state.task.todos.length,
        pagesAmount: state => Math.ceil(state.task.todos.length / 10),
        getOnePage: (state) => (start, end) => [].slice.call(state.task.todos, start, end)
      }),
    },
    watch: {
      '$route': 'getCurrentPage'
    },
    beforeMount() {
      this.renderAll();
    },
    methods: {
      renderAll() {
        this.$store.dispatch('task/renderAllTodos').then((r) => {
          if (!r) {
            this.descriptionMessage = 'Вы еще не добавили ни одной задачи';
          }

          this.txt = '';
          this.getCurrentPage();
        }).catch((err) => {
          throw new Error(err);
        });

      },
      remove(event) {
        const id = event.currentTarget.dataset.id;
        this.$store.dispatch('task/removeTodo', { id })
          .then(() => {

            if(this.todos.length === 1 && this.dataPage.currentPage !== 1) {
              this.$router.push({ name: 'home', query: { page: this.dataPage.currentPage - 1 } })
              return
            }

            this.getCurrentPage();
          }).catch((err) => {
            throw new Error(err);
          });
      },
      add() {
        if (this.txt === '') return;
        this.$store.dispatch('task/addTodo', { id: Date.now(), name: this.txt, isSorted: this.isSorted }).then(() => {
          this.txt = '';
          this.getCurrentPage();
        }).catch((err) => {
          throw new Error(err);
        });
      },
      sort() {
        this.todosList.reverse();
        this.isSorted = !this.isSorted;

        if (this.isSorted) {
          this.isSortedText = 'Сначала старые задачи';
        } else {
          this.isSortedText = 'Сначала новые задачи';
        }

        this.getCurrentPage();
      },
      getCurrentPage() {
          if (this.$route.query.page != undefined) {
            const start = (this.$route.query.page - 1) * this.todosPerPage
            const end = start + this.todosPerPage;
            this.dataPage.start = start;
            this.dataPage.end = end;
            this.dataPage.currentPage = this.$route.query.page;
          }
          this.todos = this.getOnePage(this.dataPage.start, this.dataPage.end);
      }
    }
  }
</script>

<style lang="scss" scoped>
.Title {
  padding-top: 10px;
}

ul {
  list-style-type: none;
  padding: 0;
}

@media screen and (min-width: 650px) {
  .AdaptiveWrapper {
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flex;
    display: -o-flex;
    display: flex;
    align-items: stretch;

    .TodoInput {
      margin-right: 15px;
    }
  }
}
</style>
