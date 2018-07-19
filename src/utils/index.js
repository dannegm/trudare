import moment from 'moment';

const levels = [
  'Zero Zone',
  'Safe Zone',
  'Funny Zone',
  'Chill Zone',
  'Devilry Zone',
  'Danger Zone',
];
const levelsColors = [
  'grey',
  'green',
  'blue',
  'purple',
  'red',
  'black',
];
const levelsGardients = [
  'to top, #fafafa, #cccccc',
  'to top, #398235, #c9de96',
  'to top, #729ce0, #88c7c9',
  'to top, #a849a3, #e570e7',
  'to top, #cf0404, #ff3019',
  'to top, #0e0e0e, #7d7e7d',
];

function rand (from, to) {
  return Math.floor (Math.random () * to) + from;
};

function transformItem (item) {
  return {
    uuid: item.uuid,
    title: item.text,
    levelTxt: levels [ item.level ],
    level: item.level,
    time: moment (item.timestamp).fromNow (),
    type: item.type,
  }
};

export {
  levels,
  levelsColors,
  levelsGardients,
  rand,
  transformItem,
};