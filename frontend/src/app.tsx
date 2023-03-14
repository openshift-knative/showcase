import './assets/style.css'
import React from 'react'
import { Info } from './index/types'
import { factory as index } from './index/endpoint'
import { factory as events, Stream } from './events/endpoint'
import { CloudEvent } from './events/u-cloudevents'
import Lead from './components/lead'
import LeftColumn from './components/left-column'
import RightColumn from './components/right-column'
import Loader from './components/loader'

interface AppState {
  info?: Info
}

class App extends React.Component<any, AppState> {
  stream?: Stream<CloudEvent>

  constructor(props: any) {
    super(props)
    this.state = {
      info: undefined
    }
  }

  componentDidMount() {
    index().info().then((info: Info) => {
      this.setState({ info })
      this.stream = events(info.config).stream()
      this.stream.onError((error: Event) => {
        console.error(error)
        setTimeout(() => {
          this.stream?.reconnect()
        }, 2000)
      })
    })
  }

  componentWillUnmount() {
    this.stream?.close()
  }

  render() {
    if (!this.state.info) {
      return <Loader />
    }
    return (
      <div>
        <Lead info={this.state.info} />
        <section className="container">
          <LeftColumn 
            info={this.state.info}
            stream={this.stream!}
          />
          <RightColumn info={this.state.info} />
        </section>
      </div>
    )
  }
}

export default App
