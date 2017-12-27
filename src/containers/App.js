import React from 'react'
import { hot } from 'react-hot-loader'

import HelloWorld from '../components/HelloWorld'

class App extends React.Component {

    render() {
        return (
            <div>
                <HelloWorld />
            </div>
        )
    }

}

export default hot(module)(App)
