import React from 'react'
import uuid from 'node-uuid'
import Notes from './Notes'

export default class App extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            notes: []
        }

        this.addNote = this.addNote.bind(this)
        this.editNote = this.editNote.bind(this)
        this.deleteNote = this.deleteNote.bind(this)
    }

    render () {
        const notes = this.state.notes

        return (
            <div>
                <h1>starter-react</h1>

                {/* Button - Add Note */}
                <button onClick={this.addNote}>Add Note</button>

                {/* Notes */}
                <Notes notes={notes} onEdit={this.editNote} onDelete={this.deleteNote} />
            </div>
        )
    }

    addNote () {
        const id = uuid.v4()
        const task = 'New Task'

        this.setState({
            notes: [...this.state.notes, { id, task }]
        })
    }

    editNote (id, task) {
        const notes = this.state.notes.map(note => {
            if (note.id === id) {
                return Object.assign({}, note, {task})
            }

            return note
        })

        this.setState({notes})
    }

    deleteNote (id) {
        this.setState({
            notes: this.state.notes.filter(note => note.id !== id)
        })
    }
}
