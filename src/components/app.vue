
<template>
   <section class="todoapp">
        <header class="header">
            <h1>todos</h1>
            <input 
                class="new-todo"
                autofocus autocomplete="off"
                placeholder="What needs to be done?"
                v-model="newTodo"
                @keyup.enter="addTodo">
        </header>
        <section class='main' v-show='toDoList.length' v-cloak>
            <ul class="todo-list">
                <li 
                    v-for="todo in filteredTodos"
                    class='todo'
                    :key='todo.id'
                    :class="{ completed: todo.completed, editing: todo == editedTodo }">
                    <div class="view">
                        <input class="toggle" type="checkbox" v-model="todo.completed">
                        <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
                        <button class="destroy" @click="removeTodo(todo)"></button>
                        </div>
                        <input class="edit" type="text"
                            v-model="todo.title"
                            v-todo-focus="todo == editedTodo"
                            @blur="doneEdit(todo)"
                            @keyup.enter="doneEdit(todo)"
                            @keyup.esc="cancelEdit(todo)">

                </li>
            </ul>
        </section>
        <footer class="footer" v-show="toDoList.length" v-cloak>
            <span class="todo-count">
                <strong>{{ remaining }}</strong> {{ remaining | pluralize }} left
            </span>
            <ul class="filters">
            <li><a href="#/all" :class="{ selected: visibility == 'all' }">All</a></li>
            <li><a href="#/active" :class="{ selected: visibility == 'active' }">Active</a></li>
            <li><a href="#/completed" :class="{ selected: visibility == 'completed' }">Completed</a></li>
            </ul>
            <button class="clear-completed" @click="removeCompleted" v-show="toDoList.length > remaining">
            Clear completed
            </button>
        </footer>
    </section>
</template>

<script>
    let STORAGE_KEY = 'app-to-do-view';
    let todoStorage = {
        fetch: function() {
            var todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
            todos.forEach(function (todo, index) {
                todo.id = index
            })
            todoStorage.uid = todos.length;
            return todos
        },
        save: function (todos) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
        }
    }

    let filters = {
        all: function(toDoList) {
            return toDoList
        },
        active: function(toDoList) {
            return toDoList.filter(function(item){ return !item.completed })
        },
        completed: function(toDoList) {
            return toDoList.filter(function(item){ return item.completed })
        }, 
    }
   let app = {
       data: function() {
           return {
                newTodo: '',
               toDoList: todoStorage.fetch(),
               editedTodo: null,
               visibility: 'all'
            }
       },
       computed: {
           remaining: function() {
               return filters.completed(this.toDoList).length;
           },
           filteredTodos: function () {
                return filters[this.visibility](this.toDoList);
            },
       },
       methods: {
           addTodo: function() {
               let newToDo = this.newTodo && this.newTodo.trim();
                this.toDoList.push({
                    title: newToDo,
                    completed: false,
                    id: todoStorage.uid + 1
                });
                this.newTodo = '';
           },
           removeTodo: function() {

           },
           editTodo: function(todo) {
               this.beforeEditCache = todo.title
               this.editedTodo = todo
           },
           doneEdit: function(todo) {

               if (!this.editedTodo) {
                    return
                }
                this.editedTodo = null;
                todo.title = todo.title.trim();
                if (!todo.title) {
                    this.removeTodo(todo)
                }
           },
           cancelEdit: function(todo) {
               this.editedTodo = null;
                todo.title = this.beforeEditCache;
           },
           removeTodo: function(todo) {
               this.toDoList.splice(this.toDoList.indexOf(todo), 1)
           },
           removeCompleted: function () {
                this.toDoList = filters.active(this.toDoList)
            }
           
       },
       filters: {
           pluralize: function(count) {
               return count > 1 ? 'items' : 'item'
           }
       },
         watch: {
            toDoList: {
            handler: function (todos) {
                todoStorage.save(todos)
            },
            deep: true
            }
        },
        directives: {
            'todo-focus': function (el, binding) {
                if (binding.value) {
                    el.focus()
                }
            }
        },
        created() {
            window.addEventListener('hashchange', function(){
                var visibility = window.location.hash.replace(/#\/?/, '')
                if (filters[visibility]) {
                    this.visibility = visibility
                } else {
                    window.location.hash = ''
                    this.visibility = 'all'
                }    
            }.bind(this))
            console.log('propertyComputed will update, as this.property is now reactive.')
        }
   }

    export default app;
</script>

<style scoped>
    @import './app.css';
</style>