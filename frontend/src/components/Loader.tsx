import React from 'react'
import '../assets/Loader.css'
import logo from '../assets/rhoss-icon.svg'

const Loader: React.FC = (): JSX.Element => {
  return (
    <div className="Loader">
      <header className="Loader-header">
        <img src={logo} className="Loader-logo" alt="OpenShift Serverless" />
        <p>Loading...</p>
      </header>
    </div>
  )
}

export default Loader
