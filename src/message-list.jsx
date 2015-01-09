import React from 'react'

let MessageList = React.createClass({
  render() {
    let items = this.props.messages.map(
      message => <li key={message.id}>{message.text}</li>
    )

    return <ul>{items}</ul>
  }
})

export { MessageList as default }
