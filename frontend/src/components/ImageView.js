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
      imagePos: { x: 0, y: 0 },
      zoom: 1.0
    };
  }

  componentDidMount() {
    this.updateImage(this.props.src);
  }

  componentWillReceiveProps(newProps) {
    this.updateImage(newProps.src);
  }

  onImageClick(e) {
    const p = { x: e.clientX, y: e.clientY };
    const tp = this.mapPointToImageCoords(p);

    this.props.onImageClick({
      texCoordX: Math.round(tp.x),
      texCoordY: Math.round(tp.y)
    });
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
    this.setState({
      dragEnterPos: { x: e.clientX, y: e.clientY }
    });
  }

  onImageDrag(e) {
    const ep = this.state.dragEnterPos;
    const offset = { x: e.pageX - ep.x, y: e.pageY - ep.y };

    const imagePos = {
      x: this.state.imagePos.x + offset.x,
      y: this.state.imagePos.y + offset.y
    };

    this.redrawImage(imagePos);
  }

  onImageDragLeave(e) {
    const ep = this.state.dragEnterPos;
    const offset = { x: ep.x - e.pageX, y: ep.y - e.pageY };
    this.setState({
      imagePos: {
        x: this.state.imagePos.x - offset.x,
        y: this.state.imagePos.y - offset.y
      }
    });
  }

  onImageWheel(e) {
    e.preventDefault();
    e.stopPropagation();

    this.setState({
      zoom: this.state.zoom - (e.deltaY / this.refs.canvas.height)
    });
    this.redrawImage();
  }

  updateImage(src) {
    const img = new Image;
    const canvas = this.refs.canvas;
    img.onload = () => {
      canvas.height = canvas.width * (img.height / img.width);
      this.setState({
        image: img,
        zoom: canvas.height / img.height
      });
      this.redrawImage({ x: 0, y: 0 });
    };
    img.src = src;
  }

  redrawImage(pos) {
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext('2d');
    const img = this.state.image;

    const imgPos = pos || this.state.imagePos;

    ctx.fillStyle = '#202020';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      img,
      0, 0,
      img.width, img.height,
      imgPos.x, imgPos.y,
      (img.width * this.state.zoom), (img.height * this.state.zoom)
    );
  }

  mapPointToImageCoords(p) {
    function clientPos(canvas) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: p.x - rect.left,
        y: p.y - rect.top
      };
    }

    const canvas = this.refs.canvas;
    const canvasPos = clientPos(canvas);

    return {
      x: (canvasPos.x - this.state.imagePos.x) / this.state.zoom,
      y: (canvasPos.y - this.state.imagePos.y) / this.state.zoom
    };
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
        onWheel={this.onImageWheel.bind(this)}
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
