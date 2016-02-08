import React from 'react'

export default class Note extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            editing: false
        }

        this.edit = this.edit.bind(this)
        this.checkEnter = this.checkEnter.bind(this)
        this.finishEdit = this.finishEdit.bind(this)
    }

    render () {
        if (this.state.editing) {
            return this.renderEdit()
        }

        return this.renderNote()
    }

    renderNote () {
        const onDelete = this.props.onDelete

        return (
            <div onClick={this.edit}>
                <span>{this.props.task}</span>
                {onDelete ? this.renderDelete() : null}
            </div>
        )
    }

    renderEdit () {
        return (
            <input type="text"
                autoFocus={true}
                defaultValue={this.props.task}
                onBlur={this.finishEdit}
                onKeyPress={this.checkEnter}
            />
        )
    }

    renderDelete () {
        return <button onClick={this.props.onDelete}>x</button>
    }

    edit () {
        this.setState({
            editing: true
        })
    }

    checkEnter (e) {
        if (e.key === 'Enter') {
            this.finishEdit(e)
        }
    }

    finishEdit (e) {
        const value = e.target.value

        if (value.trim()) {
            // Trigger onEdit callback
            this.props.onEdit(value)

            // Edit edit mode
            this.setState({
                editing: false
            })
        }
    }

}
