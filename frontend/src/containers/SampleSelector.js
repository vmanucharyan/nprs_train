/* eslint-disable react/jsx-no-bind */

import React from 'react';
import { connect } from 'react-redux';
import ImageView from '../components/ImageView';
import RegionView from '../components/RegionView';
import CommitSamples from '../components/CommitSamples';

import {
  selectSample,
  unselectSample,
  chooseSample,
  selectPoint
} from '../Actions';

const $ = window.$;

export class SampleSelector extends React.Component {
  constructor(props) {
    super(props);
    this.onImageClick = this.onImageClick.bind(this);
    this.onImageClick = this.onImageClick.bind(this);
    this.onRegionClick = this.onRegionClick.bind(this);
  }

  componentDidMount() {
    $('.modal-trigger').leanModal();
  }

  onImageClick(e) {
    const { dispatch } = this.props;
    dispatch(selectPoint({ x: e.texCoordX, y: e.texCoordY }));
  }

  onRegionClick(ridx) {
    const { dispatch } = this.props;

    console.log('region click');
    console.log(ridx);

    dispatch(chooseSample(ridx));
  }

  render() {
    console.log('render SampleSelector');
    console.log(this.props);

    const { trace, image, selectedSamples, chosenSamples } = this.props;

    return (
      <section className="np-trace-body np-fullscreen">
        <ImageView
          image={image}
          onImageClick={this.onImageClick.bind(this)}
          chosenRegions={chosenSamples.toArray().map((r) => trace.regions[r])}
          selectedRegion={
            selectedSamples.size > 0
              ? trace.regions[selectedSamples.first()]
              : null
          }
        />
        <div className="np-overlay-bottom">
          <div className="row center">
            <div className="col s12">
            {
              this.props.pointSamples.length > 0
              ?
                this.props.pointSamples.map((ridx) =>
                  <RegionView
                    className="z-depth-1 np-symbol-image"
                    key={ridx}
                    image={image}
                    region={trace.regions[ridx]}
                    onClick={() => this.onRegionClick(ridx)}
                    onMouseEnter={() => this.props.dispatch(selectSample(ridx))}
                    onMouseLeave={() => this.props.dispatch(unselectSample(ridx))}
                  />
              )
              :
                <p>Left click on symbol to add sample</p>
            }
            </div>
          </div>
        </div>
        <div className="fixed-action-btn horizontal" style={{ bottom: '45px', right: '24px' }} >
          <a
            href="/#/trace"
            className="btn-floating btn-large"
            onClick={() => window.$('#commitModal').openModal()}
          >
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
        <div id="commitModal" className="modal fixed-footer">
          <div className="modal-content">
            <CommitSamples />
          </div>
          <div className="modal-footer">
            <a
              href="/#/trace"
              className=" modal-action modal-close waves-effect waves-green btn-flat"
            >
              Agree
            </a>
          </div>
        </div>
      </section>
    );
  }
}

SampleSelector.propTypes = {
  dispatch: React.PropTypes.func,
  image: React.PropTypes.object,
  chosenSamples: React.PropTypes.object,
  selectedSamples: React.PropTypes.object,
  pointSamples: React.PropTypes.array,
  trace: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    image: state.image,
    chosenSamples: state.chosenSamples,
    selectedSamples: state.selectedSamples,
    pointSamples: state.pointSamples,
    trace: state.trace
  };
}

export default connect(mapStateToProps)(SampleSelector);
