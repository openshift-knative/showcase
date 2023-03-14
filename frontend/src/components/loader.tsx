import React from 'react'
import '../assets/loader.css'
import logo from '../assets/rhoss-icon.svg'

interface LoaderState {
  dots: string
}

export default class Loader extends React.Component<any, LoaderState> {
  private intervalID? : NodeJS.Timer

  constructor(props: any) {
    super(props)
    this.state = { dots: '...' }
  }
  
  componentDidMount(): void {
    this.intervalID = setInterval(() => {
      var newDots = { dots: this.state.dots + '.' }
      if (this.state.dots.length >= 3) {
        newDots = { dots: '.' }
      }
      this.setState(newDots)
    }, 250)
  }

  componentWillUnmount(): void {
    clearInterval(this.intervalID)
  }

  render(): React.ReactNode {
    return (
      <div className="Loader">
        <header className="Loader-header">
          <img src={logo} className="Loader-logo" alt="OpenShift Serverless" />
          <p>Loading{this.state.dots}</p>
        </header>
      </div>
    )
  }
}
