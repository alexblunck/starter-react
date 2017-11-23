import React from 'react'

export default class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {}

        this.sayHello()
    }

    render() {
        return (
            <div>
                <h1>starter-react</h1>
            </div>
        )
    }

    sayHello() {
        console.log('Hello')
    }
}
