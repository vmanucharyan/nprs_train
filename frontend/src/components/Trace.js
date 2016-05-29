/* eslint-disable react/jsx-no-bind */

import React from 'react';
import work from 'webworkify';
import Preloader from './Preloader';
import ImageView from './ImageView';
import RegionView from './RegionView';

export class Trace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '[10, 12, 14]',
      loaded: false,
      selectedRegions: [],
      image: null
    };
    this.onImageClick.bind(this);
    this.regions = null;
    this.regionsMap = null;
  }

  componentDidMount() {
    this.updateImage(53);
  }

  onImageClick(e) {
    console.log(`click [${e.texCoordX}, ${e.texCoordY}]`);
    console.log(this);

    if (!this.regionsMap) {
      return;
    }

    const regionsIndexes = this.regionsMap[e.texCoordY][e.texCoordX];
    this.setState({
      selectedRegions: regionsIndexes
    });

    console.log(regionsIndexes);

    const regions = regionsIndexes.map((idx) => this.regions[idx]);

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
        this.regions = parsed.regions;
        this.regionsMap = parsed.regions_map;
        this.setState({
          text: 'loaded',
          loaded: true
        });
      };
    };

    const img = new Image;
    img.onload = () => {
      console.log('image loaded');
      this.setState({ image: img });
    };
    img.src = '/system/source_images/pictures/000/000/053/original/cars_5.png?1464381110';

    oReq.send(null);
  }

  render() {
    return (
      <section className="np-trace-body np-fullscreen">
        {
          this.state.loaded && this.state.image
          ?
            <ImageView
              image={this.state.image}
              onImageClick={this.onImageClick.bind(this)}
            />
          :
            <div
              className="fixed-action-btn"
              style={{ top: '50%', left: '50%', marginTop: '-45px' }}
            >
              <Preloader />
            </div>
        }
        <div className="np-overlay-bottom">
          <div className="row center">
            <div className="col s12">
            {
              this.state.selectedRegions.length > 0
              ?
                this.state.selectedRegions.map((r) =>
                  <RegionView
                    className="z-depth-1 np-symbol-image"
                    key={r}
                    image={this.state.image}
                    region={this.regions[r]}
                  />
              )
              :
                <p>Click on image to select regions</p>
            }
            </div>
          </div>
        </div>
        <div className="fixed-action-btn horizontal" style={{ bottom: '45px', right: '24px' }} >
          <a className="btn-floating btn-large">
            <i className="large material-icons">send</i>
          </a>
          <ul>
            <li>
              <a className="btn-floating red">
                <i className="material-icons">cancel</i>
              </a>
            </li>
          </ul>
        </div>
      </section>
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
