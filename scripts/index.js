import {selectors, intervalTemplate, stopwatchTemplate, stopwatchContainer, buttonAddStopwatch} from './constants.js'
import Timer from './Timer.js'
import Stopwatch from './Stopwatch.js'

const createStopwatch = () => {
  const newStopwatch = new Stopwatch(stopwatchTemplate.cloneNode(true), intervalTemplate, selectors, (node, next, uppestValue) => {
    return new Timer(node, next, uppestValue)
  });
  newStopwatch.createContent();
  return newStopwatch.container;
};

const addNodeAppend = (createNode, place) => {
  place.append(createNode());
};

buttonAddStopwatch.addEventListener('click', () => addNodeAppend(createStopwatch, stopwatchContainer));

addNodeAppend(createStopwatch, stopwatchContainer);
