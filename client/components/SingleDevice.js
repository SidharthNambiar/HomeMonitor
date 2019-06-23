import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getDevice} from '../store/devices'
import {Link} from 'react-router-dom'
// import UpdateCampus from './UpdateCampus';
// import {socket} from '../socket'
import socketIOClient from 'socket.io-client'
import axios from 'axios'

class SingleDevice extends Component {
  constructor() {
    super()
    this.state = {
      response: false,
      endpoint: 'http://localhost:8080',
      temperature: null,
      humidity: null,
      humidityLowPoint: '',
      humidityHighPoint: ''
      // showUpdateForm: false
    }
    // this.handleClick = this.handleClick.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.updateSetPoints = this.updateSetPoints.bind(this)
  }

  componentDidMount() {
    const serialNum = Number(this.props.match.params.serialNumber)
    // console.log("COMPONENT MOUNT", serialNum)
    this.props.getDevice(serialNum)
    console.log('State Props', this.props.state)
    const {endpoint} = this.state
    const socket = socketIOClient(endpoint)
    socket.on('temp-hum', data => this.setState({response: data}))
  }

  // handleClick() {
  //   return this.setState({
  //     showUpdateForm: !this.state.showUpdateForm,
  //   });
  // }

  async updateSetPoints(userId, updatedSetPoints) {
    try {
      console.log('In here dog')
      await axios.put(`/api/users/${userId}`, updatedSetPoints)
    } catch (error) {
      console.log(error)
    }
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value})
  }

  handleSubmit(event) {
    event.preventDefault()
    console.log('DEVICE STATE>>>', this.state)
    const updatedSetPoints = this.state
    const userId = String(this.props.user.id)
    console.log(userId)
    this.updateSetPoints(userId, updatedSetPoints)
  }

  render() {
    console.log('inside render>>>', this.props)
    // console.log("Serial>>>", this.props.match.params.serialNumber)
    const serialNum = this.props.match.params.serialNumber
    // console.log(typeof serialNum)
    const {response} = this.state
    console.log('response', response)
    return (
      <React.Fragment>
        <div style={{textAlign: 'center'}}>
          {response[2] !== Number(serialNum) ? (
            <div>
              {' '}
              <h2>Device not connected!</h2>{' '}
            </div>
          ) : null}
          {response && response[2] === Number(serialNum) ? (
            <div>
              <h2>The temperature is: {response[0]} °F</h2>
              <h2>The humidity is: {response[1]} %</h2>
              <h2> STATUS: {response[3]}</h2>
            </div>
          ) : (
            <p>Loading...</p>
          )}

          <form onSubmit={this.handleSubmit}>
            <h3>Set Humidity</h3>
            <label>
              Humidity (Low Point)
              <input
                type="text"
                name="humidityLowPoint"
                onChange={this.handleChange}
                value={
                  this.state.humidityLowPoint ||
                  this.props.user.humidityLowPoint
                }
              />{' '}
              %
            </label>

            <label>
              Humidity (High Point)
              <input
                type="text"
                name="humidityHighPoint"
                onChange={this.handleChange}
                value={
                  this.state.humidityHighPoint ||
                  this.props.user.humidityHighPoint
                }
              />{' '}
              %
            </label>
            <h3>{this.state.message}</h3>
            <button type="submit">SET</button>
          </form>
        </div>
      </React.Fragment>
    )
  }
}

function mapState(state) {
  console.log('<<MAP>>STATE>>', state)
  return {
    device: state.devices.device,
    user: state.user
  }
}

function mapDispatch(dispatch) {
  return {
    getDevice: sn => dispatch(getDevice(sn))
  }
}

export default connect(mapState, mapDispatch)(SingleDevice)
