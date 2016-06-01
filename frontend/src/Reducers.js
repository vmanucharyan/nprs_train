import { Set } from 'immutable';
import * as Actions from './Actions';

export default function teacherApp(state, action) {
  switch (action.type) {

    case Actions.REQUEST_IMAGE:
      return Object.assign({}, state, {
        loadingImage: true
      });

    case Actions.RECEIVE_IMAGE:
      return Object.assign({}, state, {
        loadingImage: false,
        image: action.image,
        appState: state.loadingTrace
          ? Actions.AppState.LOADING
          : Actions.AppState.COLLECT_SAMPLES
      });

    case Actions.REQUEST_TRACE:
      return Object.assign({}, state, {
        loadingTrace: true
      });

    case Actions.RECEIVE_TRACE:
      return Object.assign({}, state, {
        loadingTrace: false,
        trace: action.trace,
        appState: state.loadingImage
          ? Actions.AppState.LOADING
          : Actions.AppState.COLLECT_SAMPLES
      });

    case Actions.CHOOSE_SAMPLE:
      return Object.assign({}, state, {
        chosenSamples: state.chosenSamples.add(action.regionIdx)
      });

    case Actions.UNCHOOSE_SAMPLE:
      return Object.assign({}, state, {
        chosenSamples: state.chosenSamples.remove(action.regionIdx)
      });

    case Actions.MARK_SAMPLE:
      return Object.assign({}, state, {
        sampleMarks: state.sampleMarks.set(action.sampleIdx, action.symbol)
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

    case Actions.GOTO_STATE:
      return Object.assign({}, state, {
        appState: action.newState
      });

    case Actions.POST_SAMPLES_START:
      return Object.assign({}, state, {
        appState: Actions.AppState.LOADING
      });

    case Actions.POST_SAMPLES_END:
      return Object.assign({}, state, {
        appState: Actions.AppState.REVIEW_SAMPLES
      });

    default:
      return state;

  }
}
