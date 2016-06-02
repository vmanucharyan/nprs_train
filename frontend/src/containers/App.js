import React from 'react';
import { connect } from 'react-redux';
import SampleSelector from './SampleSelector';
import Preloader from '../components/Preloader';
import SamplesListContainer from './SamplesListContainer';
import { AppState } from '../Actions';

const App = ({ appState, image, trace, chosenSamples }) => {
  switch (appState) {
    case AppState.LOADING:
      return (<Preloader />);

    case AppState.COLLECT_SAMPLES:
      return (
        <section className="np-trace-body np-fullscreen">
          <SampleSelector />
        </section>
      );

    case AppState.REVIEW_SAMPLES:
      return (
        <SamplesListContainer
          image={image}
          trace={trace}
          chosenSamples={chosenSamples.toArray()}
        />
      );

    default:
      return (
        <div>
          <h1>Something went wrong...</h1>
          <p>Please, try to reload this page</p>
        </div>
      );
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
