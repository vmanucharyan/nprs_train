import { Set } from 'immutable';
import * as Actions from './Actions';

const initialState = {
  loadingImage: true,
  loadingTrace: true,
  image: null,
  trace: null,
  selectedSamples: new Set(),
  chosenSamples: new Set(),
  pointSamples: []
};

export default function teacherApp(state = initialState, action) {
  switch (action.type) {

    case Actions.REQUEST_IMAGE:
      return Object.assign({}, initialState, {
        loadingImage: true
      });

    case Actions.RECEIVE_IMAGE:
      return Object.assign({}, state, {
        loadingImage: false,
        image: action.image
      });

    case Actions.REQUEST_TRACE:
      return Object.assign({}, state, {
        loadingTrace: true
      });

    case Actions.RECEIVE_TRACE:
      return Object.assign({}, state, {
        loadingTrace: false,
        trace: action.trace
      });

    case Actions.CHOOSE_SAMPLE:
      return Object.assign({}, state, {
        chosenSamples: state.chosenSamples.add(action.regionIdx)
      });

    case Actions.UNCHOOSE_SAMPLE:
      return Object.assign({}, state, {
        chosenSamples: state.chosenSamples.remove(action.regionIdx)
      });

    case Actions.SELECT_SAMPLE:
      return Object.assign({}, state, {
        selectedSamples: state.selectedSamples.add(action.regionIdx)
      });

    case Actions.SELECT_SAMPELS:
      return Object.assign({}, state, {
        selectedSamples: state.selectedSamples.union(Set.of(action.indexes))
      });

    case Actions.UNSELECT_SAMPLE:
      return Object.assign({}, state, {
        selectedSamples: state.selectedSamples.remove(action.regionIdx)
      });

    case Actions.SELECT_POINT:
      return Object.assign({}, state, {
        pointSamples: state.trace.regionsMap[action.point.y][action.point.x]
      });

    default:
      return state;

  }
}
