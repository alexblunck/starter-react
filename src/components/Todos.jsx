import React from 'react'
import Todo from './Todo'

export default ({todos, onEdit, onDelete}) => {
    return (
        <ul>{todos.map(todo =>
            <li key={todo.id}>
                <Todo
                    name={todo.name}
                    onEdit={onEdit.bind(null, todo.id)}
                    onDelete={onDelete.bind(null, todo.id)}
                />
            </li>
        )}</ul>
    )
}
