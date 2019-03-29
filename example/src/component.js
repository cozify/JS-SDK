import React, { Component } from 'react'
import PropTypes from 'prop-types'

import styles from './component.css'


export class ExampleComponent extends Component {
  static propTypes = {
    text: PropTypes.string
  }

  render() {
    const {
      text
    } = this.props

    return (
      <div className={styles.test}>
        React Component: {text}
      </div>
    )
  }
}
