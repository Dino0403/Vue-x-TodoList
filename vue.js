// 設計 todos 過濾條件
const filters = {
  all: todos => todos,
  active: todos => todos.filter(todo => !todo.completed),
  completed: todos => todos.filter(todo => todo.completed),
}

// 建立 localstorage
const STORAGE_KEY = 'todoMVC-app-Vue'

// 建立 Vue 實例
new Vue({
  // 綁定 HTML 元素
  el: '#app',
  // 建立 data
  data: {
    message: 'TODOS',
    // 透過 v-model 雙向綁定輸入的內容
    newTodo: '',
    // 定義旗標
    visibility: 'all',
    // 暫存希望編輯的 todo 內容
    currentEditTodo: {},

    // 建立 todo 格式
    // 透過 v-for 將資料帶入
    // 透過 v-model 雙向綁定 completed
    todos: []
  },
  // Vue 會針對整個畫面做重新渲染，如果 methdos 的資料有變更的話，就會一直被叫到
  methods: {
    // 監聽 v-on:keyup.enter
    // 設計新增 todo 內容
    addTodo() {
      let todoComtent = this.newTodo && this.newTodo.trim()
      if (todoComtent.length === 0) {
        return
      }
      // 透過 uuidv4() 將每個 todo 加入 ID
      this.todos.push({
        id: uuidv4(),
        title: todoComtent,
        completed: false,
      })
      this.newTodo = ''
    },
    // 監聽 v-on:click
    // 設計刪除 todo 內容
    removeTodo(todo) {
      // 透過 filter 過濾 todos 中相同 ID 的todo
      this.todos = this.todos.filter(_todo => {
        return _todo.id !== todo.id
      })
    },
    // 切換狀態
    setVisibility(visibility) {
      console.log(visibility)
      this.visibility = visibility
    },
    // 刪除已完成 todo
    removeCompletedTodo() {
      this.todos = filters.active(this.todos)
    },
    // 刪除完成 todo
    cancelTodos() {
      this.todos = filters.active(this.todos)
    },
    // 將 todos 存至 localStorage
    saveTodos() {
      console.log('save')
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos))
    },
    // dblclick 進入編輯模式，將點擊的 todo 放到 currentEditTodo 中
    // 透過解構賦值進行淺拷貝，不影響到原有的 todo 內容
    editTodo(todo) {
      this.currentEditTodo = { ...todo }
    },
    // 離開編輯模式
    cancelEdit() {
      this.currentEditTodo = {}
    },
    // 完成編輯
    doneEdit() {
      this.todos = this.todos.map(todo => {
        if (todo.id === this.currentEditTodo.id) {
          return this.currentEditTodo
        } else {
          return todo
        }
      }).filter(todo => todo.title.trim())
      this.currentEditTodo = {}
    }
  },
  // 將需要透過運算的 data 放進 computed 中
  // computed 會將運算結果暫存起來，如需要重新運算時才會啟動
  // 本質是「運算後的資料」，拿進 Vue Template 使用時，使用方式可以和 data 類比。
  computed: {
    remainTodo() {
      return filters.active(this.todos).length
    },
    // 切換狀態過濾 todos
    // 將過濾後的 todos 透過 v-for 重新渲染於畫面上
    filterTodos() {
      return filters[this.visibility](this.todos)
    },
    // getter、setter 運用
    allDone: {
      get() {
        return this.remainTodo === 0
      },
      set(value) {
        if (value === true) {
          this.todos = this.todos.map(todo => {
            return {
              ...todo,
              completed: true
            }
          })
        } else {
          this.todos = this.todos.map(todo => {
            return {
              ...todo,
              completed: false
            }
          })
        }
      }
    }
  },
  // 使用 filters 改變資料的呈現樣子，但不會改變到資料本身
  filters: {
    toUpperCase(sentence) {
      return sentence.toUpperCase()
    },
    pluarlize(n) {
      return n === 1 ? 'item' : 'items'
    }
  },
  // 透過 watch 監控指定 data 的變化
  watch: {
    todos: {
      handler: function () {
        this.saveTodos()
      },
      deep: true,
    }
  },
  // 透過 life cycle 讓畫面 created 時抓取 localstorage 資料
  created() {
    this.todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || [])
  },
  // 自定義指定
  directives: {
    'todo-focus': function (el, binding) {
      if (binding.value) {
        el.focus()
      }
    }
  }
})

// 條件渲染
// 某些情況下將資料顯示出來 某些情況下不將資料顯示出來
// v-if : 當不符合條件時，會將元素直接移除
// v-show : 當不符合條件時 會將元素設定為 display:none


/*
  active: function (todos) {
    return todos.filter(function (todo) {
      return !todo.completed
    })
  },
*/

// life cycle
// created
// monuted
// updated
// destoryed

// 編輯模式流程
// 雙擊 todo
// 加入 edit 樣式
// 按下 enter or 離開表單 觸發編輯完成功能
// esc 取消編輯