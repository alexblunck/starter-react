import './index.scss'

import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from './components/App'

const render = () => {
    ReactDOM.render(
        <AppContainer>
            <App />
        </AppContainer>,
        document.getElementById('app')
    )
}

render()

// Hot Module Replacement API
if (module.hot) {
    module.hot.accept('./components/App', render)
}
