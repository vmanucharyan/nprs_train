import React from 'react';
import RegionView from './RegionView';

const SamplesForm = ({ chosenSamples, image, onCommit, onCancel, onRemoveSample }) => (
  <section className="container">
    <div className="row" style={{ marginTop: '50px' }}>
      <form className="col s12">
        {
          chosenSamples.map((sample) => (
            <t>
              <div className="divider"></div>
              <div className="row section">
                <div className="col s2 center">
                  <RegionView
                    key={sample.index}
                    image={image}
                    region={sample}
                  />
                </div>
                <div className="input-field col s2 center" style={{ maxWidth: '50px' }}>
                  <input id={`sample-${sample.index}`} type="text" limit="1" />
                  <label htmlFor={`sample-${sample.index}`}>Symbol</label>
                </div>
                <div className="col s8 right-align">
                  <a
                    href="#"
                    onClick={() => onRemoveSample(sample.index)}
                    className="material-icons np-samplesform-delete-icon"
                  >
                    delete
                  </a>
                </div>
              </div>
            </t>
          ))
        }
      </form>
    </div>
    <br />
    <div className="row">
      <div className="col s12 right-align">
        <a className="waves-effect waves-light btn-flat" onClick={onCancel}>
          Back to image
        </a>
        <a className="waves-effect waves-light btn" onClick={onCommit}>
          <i className="material-icons right">cloud</i>
          Commit
        </a>
      </div>
    </div>
  </section>
);

SamplesForm.propTypes = {
  chosenSamples: React.PropTypes.array,
  image: React.PropTypes.object,
  onCommit: React.PropTypes.func,
  onCancel: React.PropTypes.func,
  onRemoveSample: React.PropTypes.func
};

export default SamplesForm;
