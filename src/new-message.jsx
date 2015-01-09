import React from 'react'

let NewMessage = React.createClass({
  getInitialState() {
    return {
      text: ''
    }
  },

  handleChange(e) {
    this.setState({ text: e.target.value })
  },

  submit(e) {
    e.preventDefault()

    this.props.onSubmit(this.state.text)
    this.setState({ text: '' })
  },

  render() {
    return <form onSubmit={this.submit}>
      <input value={this.state.text} onChange={this.handleChange} />

      <button type="submit">Submit</button>
    </form>
  }
})

export { NewMessage as default }
