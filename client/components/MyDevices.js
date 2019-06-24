import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getAllDevices} from '../store/devices'
import {Link} from 'react-router-dom'
// import {addToCartDb} from '../store/cart' //TODO:

class MyDevices extends Component {
  componentDidMount() {
    this.props.getAllDevices()
  }

  render() {
    return (
      <div>
        <h2 className="title">Devices</h2>
        <div id="all-devices">
          {this.props.devices.map(device => {
            return (
              <div key={device.id} className="device-container">
                {/* <Link to={`/devices/${device.id}`}> */}

                <Link to={`/devices/${device.serialNumber}`}>
                  <img className="p-img" src={device.imageUrl} />
                </Link>

                {/* <p>{device.description}</p> */}
                {/* <h4>${device.price}</h4> */}

                {/* </Link> */}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

function mapState(state) {
  return {
    devices: state.devices.devices
  }
}

function mapDispatch(dispatch) {
  return {
    getAllDevices: () => dispatch(getAllDevices())
    // addToCart: device => dispatch(addToCartDb(device))
  }
}

export default connect(mapState, mapDispatch)(MyDevices)

// export default ProductList
