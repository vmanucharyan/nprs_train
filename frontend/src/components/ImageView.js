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

    const clientPos = { x: e.clientX, y: e.clientY };

    const newZoom = this.state.zoom - (e.deltaY / this.refs.canvas.height);

    const m1 = this.mapPointToImageCoords(clientPos, newZoom);
    const m2 = this.mapPointToImageCoords(clientPos, this.state.zoom);

    const d = {
      x: (m2.x - m1.x) * newZoom,
      y: (m2.y - m1.y) * newZoom
    };

    this.setState({
      imagePos: {
        x: this.state.imagePos.x - d.x,
        y: this.state.imagePos.y - d.y
      },
      zoom: newZoom
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

  mapPointToImageCoords(p, zoom, imagePos) {
    function clientPos(canvas) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: p.x - rect.left,
        y: p.y - rect.top
      };
    }

    const canvas = this.refs.canvas;
    const canvasPos = clientPos(canvas);

    const z = zoom || this.state.zoom;
    const pos = imagePos || this.state.imagePos;

    return {
      x: (canvasPos.x - pos.x) / z,
      y: (canvasPos.y - pos.y) / z
    };
  }

  mapImageCoordToCanvas(p) {
    return {
      x: p.x * this.state.zoom + this.state.imagePos.x,
      y: p.y * this.state.zoom + this.state.imagePos.y
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
