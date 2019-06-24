import React from 'react'
import {Navbar} from './components'
import Routes from './routes'
// import defaultTheme from '@material-ui/core/styles/defaultTheme'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
// import getMuiTheme from '@material-ui/core/baseTheme/getMuiTheme'
// import AppBar from '@material-ui/core/AppBar'
// import TextField from 'material-ui/TextField'
// import RaisedButton from 'material-ui/RaisedButton'

const App = () => {
  return (
    <MuiThemeProvider>
      <div>
        <Navbar />
        <Routes />
      </div>
    </MuiThemeProvider>
  )
}

export default App
