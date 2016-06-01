import React from 'react';
import { connect } from 'react-redux';

import { unchooseSample, commitSamples, goToState, AppState } from '../Actions';

import SamplesForm from '../components/SamplesForm';

class SamplesReview extends React.Component {
  constructor(props) {
    super(props);

    this.onRemoveSample = this.onRemoveSample.bind(this);
    this.onCommit = this.onCommit.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  onRemoveSample(sampleIdx) {
    const { dispatch } = this.props;
    dispatch(unchooseSample(sampleIdx));
  }

  onCommit() {
    const { dispatch } = this.props;
    dispatch(commitSamples(this.props.chosenSamples)
      .then(dispatch()));
  }

  onCancel() {
    const { dispatch } = this.props;
    dispatch(goToState(AppState.COLLECT_SAMPLES));
  }

  render() {
    const { chosenSamples, image, trace } = this.props;

    return (
      <SamplesForm
        chosenSamples={chosenSamples}
        image={image}
        trace={trace}
        onRemoveSample={this.onRemoveSample}
        onCancel={this.onCancel}
        onCommit={this.onCommit}
      />
    );
  }
}

SamplesReview.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  chosenSamples: React.PropTypes.array.isRequired,
  image: React.PropTypes.object.isRequired,
  trace: React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    chosenSamples: state.chosenSamples.map(sidx =>
      Object.assign({}, state.trace.regions[sidx], { index: sidx })
    ).toArray(),
    image: state.image,
    trace: state.trace
  };
}

export default connect(mapStateToProps)(SamplesReview);
