import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_ALL_DEVICES = 'GET_ALL_DEVICES'
const GET_SINGLE_DEVICE = 'GET_SINGLE_DEVICE'
// const CREATE_PRODUCT = 'CREATE_PRODUCT'

/**
 * INITIAL STATE
 */
const initialState = {
  devices: [],
  device: []
}
/**
 * ACTION CREATORS
 */
const getDevices = devices => ({type: GET_ALL_DEVICES, devices})
const getSingleDevice = device => ({type: GET_SINGLE_DEVICE, device})
// const createProduct = product => ({type: CREATE_PRODUCT, product})

/**
 * THUNK CREATORS
 */
export const getAllDevices = () => async dispatch => {
  try {
    const res = await axios.get('/api/devices')

    dispatch(getDevices(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const getDevice = sn => async dispatch => {
  try {
    const res = await axios.get(`/api/devices/${sn}`)
    dispatch(getSingleDevice(res.data))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_DEVICES:
      return {...state, devices: [...action.devices]}
    case GET_SINGLE_DEVICE:
      return {...state, device: [...action.device]}
    default:
      return state
  }
}
