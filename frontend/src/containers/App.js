import React from 'react';
import { connect } from 'react-redux';

import SampleSelector from './SampleSelector';
import Preloader from '../components/Preloader';

const App = ({ loadingImage, loadingTrace }) => (
  <section className="np-trace-body np-fullscreen">
  {
    (() => {
      if (loadingImage || loadingTrace) {
        return (
          <div
            className="fixed-action-btn"
            style={{ top: '50%', left: '50%', marginTop: '-45px' }}
          >
            <Preloader />
          </div>
        );
      }
      return (<SampleSelector />);
    })()
  }
  </section>
);

App.propTypes = {
  loadingImage: React.PropTypes.bool.isRequired,
  loadingTrace: React.PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    loadingImage: state.loadingImage,
    loadingTrace: state.loadingTrace
  };
}

export default connect(mapStateToProps)(App);
