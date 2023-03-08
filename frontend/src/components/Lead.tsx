import React from 'react'
import logo from '../assets/rhoss-icon.svg'
import InfoProps from './InfoProps'

const Lead: React.FC<InfoProps> = (props: InfoProps) : JSX.Element => {
  return (
    <section className="banner lead">
      <img className="logo" src={logo} alt="OpenShift Serverless" />
      { props.info.config.greet } to Serverless, Cloud-Native world!
    </section>
  )
}

export default Lead;
