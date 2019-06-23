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
  // console.log("<><><><><IN HERE<><><><><><")
  // console.log(sn)
  try {
    const res = await axios.get(`/api/devices/${sn}`)
    console.log('IN GET DEVICE>>', res.data)
    dispatch(getSingleDevice(res.data))
  } catch (err) {
    console.error(err)
  }
}

// export const createNewProduct = product => async dispatch => {
//   try {
//     const {data} = axios.post('/api/devices', product)
//     dispatch(createProduct(data))
//   } catch (error) {
//     console.error(error)
//   }
// }

/**
 * REDUCER
 */
export default function(state = initialState, action) {
  console.log('state>>', state)
  console.log('action>>', action)
  switch (action.type) {
    case GET_ALL_DEVICES:
      return {...state, devices: [...action.devices]}
    case GET_SINGLE_DEVICE:
      return {...state, device: [...action.device]}
    default:
      return state
  }
}
