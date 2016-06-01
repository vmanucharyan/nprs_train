import React from 'react';
import { connect } from 'react-redux';
import SampleSelector from './SampleSelector';
import Preloader from '../components/Preloader';
import SamplesReview from './SamplesReview';
import { AppState } from '../Actions';

const App = ({ appState, image, trace, chosenSamples }) => {
  switch (appState) {
    case AppState.LOADING:
      return (
        <section className="np-trace-body np-fullscreen">
          <div
            className="fixed-action-btn"
            style={{ top: '50%', left: '50%', marginTop: '-45px' }}
          >
            <Preloader />
          </div>
        </section>
      );

    case AppState.COLLECT_SAMPLES:
      return (
        <section className="np-trace-body np-fullscreen">
          <SampleSelector />
        </section>
      );

    case AppState.REVIEW_SAMPLES:
      return (
        <SamplesReview
          image={image}
          trace={trace}
          chosenSamples={chosenSamples.toArray()}
        />
      );

    default:
      return (<h1>Something went wrong...</h1>);
  }
};

App.propTypes = {
  appState: React.PropTypes.string,
  image: React.PropTypes.object,
  trace: React.PropTypes.object,
  chosenSamples: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    appState: state.appState,
    image: state.image,
    trace: state.trace,
    chosenSamples: state.chosenSamples
  };
}

export default connect(mapStateToProps)(App);
