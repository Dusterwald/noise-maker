import React from 'react';

export default class NodeInputListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false
    }
  }

  onMouseUp(e) {
    e.stopPropagation();
      e.preventDefault();

    this.props.onMouseUp(this.props.index);
  }

  onMouseOver() {
    this.setState({hover: true});
  }

  onMouseOut() {
    this.setState({hover: false});
  }

  render() {
    let {name} = this.props.item;
    let {hover} = this.state;

    const noop = (e) => {
      e.stopPropagation();
      e.preventDefault();
    };

    return (
      <li>
        <button onClick={e => noop(e)} onMouseUp={(e)=>this.onMouseUp(e)} type="button">
          <i className={hover ? 'fa fa-circle-o hover' : 'fa fa-circle-o'}
            onMouseOver={() => {this.onMouseOver()}}
            onMouseOut={() => {this.onMouseOut()}}
          ></i>
          {name}
        </button>
      </li>
    );
  }
}
