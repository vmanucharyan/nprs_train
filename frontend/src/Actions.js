import work from 'webworkify';
import request from 'superagent';

/*
 * action types
 */
export const REQUEST_IMAGE = 'LOAD_IMAGE';
export const RECEIVE_IMAGE = 'LOAD_IMAGE_RESULT';

export const REQUEST_TRACE = 'LOAD_TRACE_REQUEST';
export const RECEIVE_TRACE = 'LOAD_TRACE_RESULT';

export const CHOOSE_SAMPLE = 'CHOOSE_SAMPLE';
export const UNCHOOSE_SAMPLE = 'UNCHOOSE_SAMPLE';

export const SELECT_SAMPLE = 'SELECT_SAMPLE';
export const SELECT_SAMPELS = 'SELECT_SAMPELS';
export const UNSELECT_SAMPLE = 'UNSELECT_SAMPLE';

export const MARK_SAMPLE = 'MARK_SAMPLE';

export const SELECT_POINT = 'SELECT_POINT';

export const GOTO_STATE = 'GOTO_STATE';

export const POST_SAMPLES_START = 'POST_SAMPLES_START';
export const POST_SAMPLES_END = 'POST_SAMPLES_END';

/**
 * Other contants
 */
export const AppState = {
  LOADING: 'LOADING',
  COLLECT_SAMPLES: 'COLLECT_SAMPLES',
  REVIEW_SAMPLES: 'REVIEW_SAMPLES'
};

/*
 * action creators
 */
export function requestImage(sourceImageId) {
  return {
    type: REQUEST_IMAGE,
    sourceImageId
  };
}

/*
 * action creators
 */
export function receiveImage(image) {
  return {
    type: RECEIVE_IMAGE,
    image
  };
}

export function fetchImage(sourceImageId) {
  return (dispatch) => {
    dispatch(requestImage(sourceImageId));
    const img = new Image;
    img.onload = () => {
      dispatch(receiveImage(img));
    };
    img.src = '/system/source_images/pictures/000/000/053/original/cars_5.png?1464381110';
  };
}

export function requestTrace(sourceImageId) {
  return {
    type: REQUEST_TRACE,
    sourceImageId
  };
}

export function receiveTrace(trace) {
  return {
    type: RECEIVE_TRACE,
    trace
  };
}

export function fetchTrace(sourceImageId) {
  return (dispatch) => {
    dispatch(requestTrace(sourceImageId));

    const oReq = new XMLHttpRequest();
    oReq.open('GET', `/api/source_images/${sourceImageId}/trace_file`, true);
    oReq.responseType = 'arraybuffer';
    oReq.onload = () => {
      const worker = work(require('./workers/LoadTraceWorker.js')); // eslint-disable-line max-len, global-require

      worker.postMessage([oReq.response]);

      worker.onmessage = (e) => {
        const parsed = JSON.parse(e.data[0]);
        dispatch(receiveTrace({
          regions: parsed.regions,
          regionsMap: parsed.regions_map
        }));
      };
    };

    oReq.send();
  };
}

export function chooseSample(regionIdx) {
  return {
    type: CHOOSE_SAMPLE,
    regionIdx
  };
}

export function unchooseSample(regionIdx) {
  return {
    type: UNCHOOSE_SAMPLE,
    regionIdx
  };
}

export function selectSample(regionIdx) {
  return {
    type: SELECT_SAMPLE,
    regionIdx
  };
}

export function selectSamples(indexes) {
  return {
    type: SELECT_SAMPELS,
    indexes
  };
}

export function unselectSample(regionIdx) {
  return {
    type: UNSELECT_SAMPLE,
    regionIdx
  };
}

export function selectPoint(point) {
  return {
    type: SELECT_POINT,
    point
  };
}

export function goToState(newState) {
  return {
    type: GOTO_STATE,
    newState
  };
}

export function sendCommitSamples(samples) {
  return {
    type: POST_SAMPLES_START,
    samples
  };
}

export function endCommitSamples(res) {
  return {
    type: POST_SAMPLES_END,
    res
  };
}

export function commitSamples(samples, marks) {
  return (dispatch) => {
    /* eslint-disable no-underscore-dangle */
    const payload = {
      source_image_id: 53,
      samples: samples.map((s) => Object.assign({}, s, {
        bounds: {
          x: s.bounds._field0.x,
          y: s.bounds._field0.y,
          width: s.bounds._field1.x - s.bounds._field0.x,
          height: s.bounds._field1.y - s.bounds._field0.y
        },
        symbol: marks.get(s.index),
        cser_light_features: s.features
      }))
    };
    /* eslint-enable no-underscore-dangle */

    dispatch(sendCommitSamples(samples));
    request
      .post('/api/symbol_samples')
      .send(payload)
      .set('Accept', 'application/json')
      .end((err, res) => {
        dispatch(endCommitSamples(res));
      });
  };
}

export function markSample(sampleIdx, symbol) {
  return {
    type: MARK_SAMPLE,
    sampleIdx,
    symbol
  };
}
