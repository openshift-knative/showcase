import React from 'react'
import InfoProps from './info-props'

class RightColumn extends React.Component<InfoProps> {
  engine: string;

  constructor(props: InfoProps) {
    super(props)
    this.engine = props.info.project.platform.replace(/^([a-zA-Z0-9]+)\/.+$/, '$1')
  }

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

          <h5>Powered by:</h5>
          <div className="references">
            {this.renderEngine()}

            <img className="thumbnail"
              src="//raw.githubusercontent.com/knative/website/master/assets/icons/logo.svg"
              alt="Knative" />
          </div>
          <p>This application has been written with React & {this.engine} to showcase Knative.</p>
        </div>
      </section>
    )
  }

  private renderEngine(): React.ReactNode {
    switch (this.engine) {
      case 'Express':
        return (
          <img className="thumbnail"
            alt="Express"
            src="//upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" />
        )
      case 'Quarkus':
        return (
          <img className="thumbnail"
            alt="Quarkus"
            src="//design.jboss.org/quarkus/logo/final/SVG/quarkus_logo_vertical_rgb_default.svg" />
        )
      default:
        throw new Error(`Unsupported engine: ${this.engine}`);
    }
  }
}

export default RightColumn
