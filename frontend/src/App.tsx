import React from 'react'
import './assets/style.css'
import { Info } from './index/types'
import Lead from './components/Lead'
import LeftColumn from './components/LeftColumn'
import RightColumn from './components/RightColumn'
import { EndpointFactory } from './index/Endpoint'
import Loader from './components/Loader'

class App extends React.Component {

  info?: Info

  constructor(props: any) {
    super(props)
    this.state = {}
    const endpoint = EndpointFactory()
    endpoint.info().then((info: Info) => {
      this.info = info
      this.forceUpdate()
    })
  }

  render() {
    if (!this.info) {
      return <Loader />
    }
    return (
      <div>
        <Lead info={this.info} />
        <section className="container">
          <LeftColumn info={this.info} />
          <RightColumn info={this.info} />
        </section>
      </div>
    )
  }
}

export default App
