/* eslint-disable react/jsx-no-bind */

import React from 'react';

class ImageView extends React.Component {
  constructor(props) {
    super(props);
    this.onImageClick.bind(this);
    this.state = {
      dragEntered: false,
      dragEnterPos: { x: -1, y: -1 }
    };
  }

  componentDidMount() {
    this.updateImage(this.props.src);
  }

  componentWillReceiveProps(newProps) {
    this.updateImage(newProps.src);
  }

  onImageClick(e) {
    const args = {
      texCoordX: e.pageX,
      texCoordY: e.pageY
    };
    this.props.onImageClick(args);
  }

  onImageMouseDown(e) {
    if (this.state.dragEntered) {
      return;
    }

    this.setState({
      dragEnterPos: { x: e.pageX, y: e.pageY }
    });
  }

  onImageMouseUp(e) {
    console.log('mouse up');
    console.log(this.state);

    const ep = this.state.dragEnterPos;
    if (e.pageX === ep.x && e.pageY === ep.y) {
      this.onImageClick(e);
    }

    this.setState({
      dragEntered: false,
      dragEnterPos: { x: -1, y: -1 }
    });

    console.log(this.state);
  }

  onImageMouseMove(e) {
    const ep = this.state.dragEnterPos;

    if (!this.state.dragEntered && (ep.x !== -1 && ep.y !== -1)) {
      this.setState({ dragEntered: true });
      this.onImageDragEntered(e);
    } else if (this.state.dragEntered && (ep.x !== -1 && ep.y !== -1)) {
      this.onImageDrag(e);
    }
  }

  onImageDragEntered(e) {
    console.log('drag entered');
    this.setState({
      dragEnterPos: { x: e.clientX, y: e.clientY }
    });
  }

  onImageDrag(e) {
    const ep = this.state.dragEnterPos;
    const offset = { x: ep.x - e.screenX, y: ep.y - e.screenY };

    console.log('image drag');
    console.log(offset);

    // const canvas = this.refs.canvas;
    // const ctx = canvas.getContext('2d');
  }

  updateImage(src) {
    const img = new Image;
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext('2d');
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
    };
    img.src = src;
  }

  render() {
    return (
      <canvas
        ref="canvas"
        width="1000"
        height="600"
        className={`responsive-img ${this.props.className}`}
        disabled={this.props.disabled}
        onMouseDown={this.onImageMouseDown.bind(this)}
        onMouseUp={this.onImageMouseUp.bind(this)}
        onMouseMove={this.onImageMouseMove.bind(this)}
      ></canvas>
    );
  }
}

ImageView.propTypes = {
  src: React.PropTypes.string,
  className: React.PropTypes.string,
  onImageClick: React.PropTypes.func,
  disabled: React.PropTypes.bool
};

export default ImageView;
