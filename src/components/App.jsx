import AltContainer from 'alt-container'
import React from 'react'
import Notes from './Notes'
import NoteActions from '../actions/NoteActions'
import NoteStore from '../stores/NoteStore'

export default class App extends React.Component {
    // constructor (props) {
    //     super(props)

    //     this.state = NoteStore.getState()

    //     this.storeChanged = this.storeChanged.bind(this)
    // }

    // componentDidMount () {
    //     NoteStore.listen(this.storeChanged)
    // }

    // componentWillUnmount () {
    //     NoteStore.unlisten(this.storeChanged)
    // }

    // storeChanged (state) {
    //     this.setState(state)
    // }

    render () {
        // const notes = this.state.notes

        return (
            <div>
                {/* Button - Add Note */}
                <button onClick={this.addNote}>Add Note</button>

                {/* Notes */}
                <AltContainer
                    stores={[NoteStore]}
                    inject={{
                        notes: () => NoteStore.getState().notes
                    }}
                >
                    <Notes onEdit={this.editNote} onDelete={this.deleteNote} />
                </AltContainer>
            </div>
        )
    }

    addNote () {
        NoteActions.create({task: 'New Task'})
    }

    editNote (id, task) {
        NoteActions.update({id, task})
    }

    deleteNote (id) {
        NoteActions.delete(id)
    }
}
