import React from 'react'

import MessageList from './message-list.jsx!'
import NewMessage from './new-message.jsx!'

var App = React.createClass({
  getInitialState() {
    return {
      messages: [
        { id: 1, text: "Always leave a note." },
        { id: 2, text: "Take a sweater." },
        { id: 3, text: "Don't forget to wear sunscreen." }
      ],
      nextId: 4
    }
  },

  addMessage(text) {
    this.setState({
      messages: this.state.messages.concat([{ id: this.state.nextId++, text: text }])
    })
  },

  render() {
    return <div>
      <MessageList messages={this.state.messages} />

      <NewMessage onSubmit={this.addMessage} />
    </div>
  }
})

React.render(<App />, document.body)
