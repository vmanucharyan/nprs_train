/* eslint-disable react/jsx-no-bind */

import React from 'react';

class ImageView extends React.Component {
  constructor(props) {
    super(props);
    this.onImageClick.bind(this);
    this.state = {
      dragEntered: false,
      dragEnterPos: { x: -1, y: -1 },
      image: null,
      imagePos: { x: 0, y: 0 }
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

    if (this.state.dragEntered) {
      this.onImageDragLeave(e);
    }

    this.setState({
      dragEntered: false,
      dragEnterPos: { x: -1, y: -1 }
    });

    if (e.pageX === ep.x && e.pageY === ep.y) {
      this.onImageClick(e);
    }

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

  onImageMouseDoubleClick(e) {
    console.log('double click');
  }

  onImageDragEntered(e) {
    console.log('drag entered');
    this.setState({
      dragEnterPos: { x: e.clientX, y: e.clientY }
    });
  }

  onImageDrag(e) {
    const ep = this.state.dragEnterPos;
    const offset = { x: e.pageX - ep.x, y: e.pageY - ep.y };

    console.log('image drag');
    console.log(offset);

    const canvas = this.refs.canvas;
    const ctx = canvas.getContext('2d');

    const imagePos = {
      x: this.state.imagePos.x + offset.x,
      y: this.state.imagePos.y + offset.y
    };

    ctx.fillStyle = '#202020';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      this.state.image,
      0, 0,
      this.state.image.width, this.state.image.height,
      imagePos.x, imagePos.y,
      canvas.width, canvas.height
    );
  }

  onImageDragLeave(e) {
    console.log('drag leave');
    console.log(this.state);

    const ep = this.state.dragEnterPos;
    const offset = { x: ep.x - e.pageX, y: ep.y - e.pageY };
    this.setState({
      imagePos: {
        x: this.state.imagePos.x - offset.x,
        y: this.state.imagePos.y - offset.y
      }
    });
  }

  updateImage(src) {
    const img = new Image;
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext('2d');
    img.onload = () => {
      canvas.height = canvas.width * (img.height / img.width);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      this.setState({ image: img });
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
        onDoubleClick={this.onImageMouseDoubleClick.bind(this)}
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
