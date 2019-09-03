import { db } from '../db';

export default {
  namespaced: true,
  state: {
    todos: [],
  },
  mutations: {
    addOne(state, todo) {
      if (todo.isSorted) {
        state.todos.push(todo);
      } else {
        state.todos.unshift(todo);
      }
    },
    addAll(state, todos) {
      state.todos = todos;
    },
    removeById(state, id) {
      state.todos = state.todos.filter((todo) => {
        if (todo.id !== id) return todo;
      });
    },
  },
  actions: {
    renderAllTodos({ commit }) {
      return new Promise(async (resolve) => {
        const request = await db.ref('todos').once('value');
        const todos = request.val();
        const todosArr = [];

        if (todos) {
          Object.keys(todos).forEach((key) => {
            const elem = todos[key];

            todosArr.push({
              id: elem.id,
              name: elem.name,
            });
          });
          todosArr.reverse();
          return resolve(commit('addAll', todosArr));
        }
        return resolve(false);
      });
    },
    addTodo({ commit }, todo) {
      return new Promise(async (resolve) => {
        await db.ref('todos').push(todo);
        return resolve(commit('addOne', todo));
      });
    },
    removeTodo({ commit }, obj) {
      return new Promise(async (resolve) => {
        await db.ref().child('todos').orderByChild('id').equalTo(Number(obj.id)).once('value', (snapshot) => {
          snapshot.forEach((childSnapshot) => {
            childSnapshot.ref.remove();
          });
        });

        return resolve(commit('removeById', Number(obj.id)));
      });
    },
  }
}