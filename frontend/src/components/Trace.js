/* eslint-disable react/jsx-no-bind */

import React from 'react';
import work from 'webworkify';
import Preloader from './Preloader';
import ImageView from './ImageView';

export class Trace extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: '[10, 12, 14]', regionsMap: [], regions: {}, loaded: false };
    this.onImageClick.bind(this);
  }

  componentDidMount() {
    this.updateImage(50);
  }

  onImageClick(e) {
    if (!this.state.regionsMap) {
      return;
    }

    console.log(`click [${e.texCoordX}, ${e.texCoordY}]`);

    const regions = this.state.regionsMap[e.texCoordY][e.texCoordX];

    console.log(regions);
  }

  updateImage(imageId) {
    const oReq = new XMLHttpRequest();
    oReq.open('GET', `/api/source_images/${imageId}/trace_file`, true);
    oReq.responseType = 'arraybuffer';

    oReq.onload = () => {
      const worker = work(require('../workers/LoadTraceWorker.js')); // eslint-disable-line max-len, global-require

      worker.postMessage([oReq.response]);

      this.setState({ text: 'loading...' });
      worker.onmessage = (e) => {
        const parsed = JSON.parse(e.data[0]);

        this.setState({
          regions: parsed.regions,
          regionsMap: parsed.regions_map,
          text: 'loaded',
          loaded: true
        });
      };
    };

    oReq.send(null);
  }

  render() {
    const testImageUrl = 'http://localhost:3000/system/source_images/pictures/000/000/050/original/cars_14.png?1464163775';

    return (
      <div className="row">
        <div className="col s12 center">
          {
            this.state.loaded
            ?
              <ImageView
                src={testImageUrl}
                className="z-depth-1"
                onImageClick={this.onImageClick.bind(this)}
              />
            :
              <Preloader />
          }
        </div>
        <div className="col s12">
          <pre>
            {this.state.text}
          </pre>
        </div>
      </div>
    );
  }
}

Trace.propTypes = {
  image_id: React.PropTypes.number,
  text: React.PropTypes.string
};

Trace.defaultProps = {
  text: '[123, 13, 41]'
};

export default Trace;
