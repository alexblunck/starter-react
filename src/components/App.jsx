import React from 'react'
import uuid from 'uuid/v4'
import Todos from './Todos'

export default class App extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            todos: []
        }

        this.addTodo = this.addTodo.bind(this)
        this.editTodo = this.editTodo.bind(this)
        this.deleteTodo = this.deleteTodo.bind(this)
    }

    render () {
        const todos = this.state.todos

        return (
            <div>
                <h1>starter-react</h1>

                {/* Button - Add Todo */}
                <button onClick={this.addTodo}>Add Todo</button>

                {/* Todos */}
                <Todos todos={todos} onEdit={this.editTodo} onDelete={this.deleteTodo} />
            </div>
        )
    }

    addTodo () {
        const id = uuid()
        const name = 'New Todo'

        this.setState({
            todos: [...this.state.todos, { id, name }]
        })
    }

    editTodo (id, name) {
        const todos = this.state.todos.map(todo => {
            if (todo.id === id) {
                return Object.assign({}, todo, { name })
            }

            return todo
        })

        this.setState({todos})
    }

    deleteTodo (id) {
        this.setState({
            todos: this.state.todos.filter(todo => todo.id !== id)
        })
    }
}
