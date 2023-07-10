import React from 'react'
import { Stream } from '../events/endpoint'
import { CloudEvent } from '../events/u-cloudevents'
import InfoProps from './info-props'
import { baseAddress } from '../config/backend'
import { formatDistanceToNow } from 'date-fns'
import Highlight, { defaultProps, Language, PrismTheme } from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/vsLight'

const customTheme = ((): PrismTheme => {
  const base = theme
  base.plain.backgroundColor = 'rgba(0, 0, 0, 0)'
  return base
})()

interface LeftColumnProps extends InfoProps {
  stream: Stream<CloudEvent>
}

interface LeftColumnState {
  events: CloudEvent[]
}

class LeftColumn extends React.Component<LeftColumnProps, LeftColumnState> {
  constructor(props: LeftColumnProps) {
    super(props)
    this.state = {
      events: []
    }
    props.stream.onData((ce: CloudEvent) => {
      this.setState({
        events: [ce, ...this.state.events]
      })
    })
  }

  render(): React.ReactNode {
    return (
      <section className="left-column">
        <h2>What can I do from here?</h2>

        <p>
          Invoke a hello endpoint: <a href={`${baseAddress}/hello`}>/hello</a>.<br />
          <span className="note">💡 It will send CloudEvent to <code>K_SINK = {this.props.info.config.sink}</code></span>
        </p>

        <h4>Collected CloudEvents ({this.state.events.length})</h4>
        
        <ul className="events-list">
          {this.renderEvents()}
        </ul>
        <p className="note">💡 This app captures CloudEvents on <code>POST /events</code> endpoint. Newer are listed first.</p>

      </section>
    )
  }

  private renderEvents(): React.ReactNode {
    return this.state.events.map((ce: CloudEvent, i: number) => {
      return (
        <li key={i} className={i%2===0 ? "even" : "odd"}>
          <span className="ce-version">{ce.specversion}</span>
          <table>
            <tbody>
              <tr>
                <td width="40%">
                  <label>id</label>
                  <div className="value"><code>{ce.id}</code></div>
                </td>
                <td width="20%">
                  <label>source</label>
                  <div className="value">{ce.source}</div>
                </td>
                <th rowSpan={2}>
                  <label>{this.getDataContentType(ce)}</label>
                  <div className="value">{this.stringifyData(ce)}</div>
                </th>
              </tr>
              <tr>
                <td>
                  <label>type</label>
                  <div className="value">{ce.type}</div>
                </td>
                <td>
                  <label>time</label>
                  <div className="value" title={ce.time}>{this.stringifyTime(ce)}</div>
                </td>
              </tr>
            </tbody>
          </table>

        </li>
      )
    })
  }

  private getDataContentType(ce: CloudEvent): string {
    if (ce.datacontenttype == null) {
      return "content type not specified"
    } else {
      return ce.datacontenttype
    }
  }

  private stringifyData(ce: CloudEvent): React.ReactNode {
    if (ce.datacontenttype == null || ce.datacontenttype?.startsWith('application/json')) {
      return this.highlightCode(JSON.stringify(ce.data, null, 2), 'json')
    }
    return (
      <pre>{ce.data_base64!}</pre>
    )
  }

  private highlightCode(code: string, language: Language): React.ReactNode {
    return (
      <Highlight {...defaultProps} theme={customTheme} code={code} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={style}>
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    )
  }

  private stringifyTime(ce: CloudEvent): string {
    return formatDistanceToNow(new Date(ce.time))
  }
}

export default LeftColumn
