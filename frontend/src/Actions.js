import work from 'webworkify';

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

export const SELECT_POINT = 'SELECT_POINT';

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
