import React from 'react'
import InfoProps from './InfoProps'

class RightColumn extends React.Component<InfoProps> {
  render(): React.ReactNode {
    return (
      <section className="right-column">
        <div className="right-section">
          <h3>Application</h3>
          <ul>
            <li>Group: <code>{this.props.info.project.group}</code></li>
            <li>Artifact: <code>{this.props.info.project.artifact}</code></li>
            <li>Version: <code>{this.props.info.project.version}</code></li>
            <li>Platform: <code>{this.props.info.project.platform}</code></li>
          </ul>
        </div>
      </section>
    )
  }
}

export default RightColumn
