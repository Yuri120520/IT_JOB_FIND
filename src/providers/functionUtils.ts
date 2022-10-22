import { random } from 'lodash';
import moment, * as Moment from 'moment';
import { extendMoment } from 'moment-range';
import { nanoid } from 'nanoid';
import slug from 'slug';

export const getFileName = (fileName: string) => {
  const index = fileName.indexOf('.');
  const file = slug(fileName.substring(0, index));
  const extension = fileName.substring(index);
  return `${new Date().getTime()}-${file}${extension}`;
};

export const randomCode = () => {
  //output '1492341545873'
  let now = Date.now().toString();
  now += now + Math.floor(Math.random() * 10);
  return [now.slice(0, 4), now.slice(4, 10), now.slice(10, 14)].join('');
};

/* Function return list arr date from a to b by day - month - year - week */
export const getArrDates = ({ key, startDate, endDate }: { key: string; startDate: any; endDate: any }) => {
  const rangeMoment = extendMoment(Moment);
  const start = moment(startDate);
  const end = moment(endDate);

  if (key === 'week') {
    /* Weekly: start from Monday to Monday */
    const result = [];
    const current = start.clone();
    while (current.day(8).isBefore(end)) {
      result.push(current.clone().startOf('day').utc(true).toISOString());
    }
    return result;
  }
  if (key === 'day' || key === 'month' || key === 'year') {
    const range = rangeMoment.range(startDate, endDate).by(key);
    return Array.from(range).map(e => e.startOf('day').utc(true).toISOString());
  }
};

export const getRandomToken = function () {
  return nanoid(64);
};

export const randomSpecialChar = function () {
  const specialCharacters = '!§$%&/()=?\u{20ac}';

  return specialCharacters.substring(Math.floor(specialCharacters.length * Math.random()), 1);
};

export const generatePassword = function () {
  const randomString = String(random(10000, 9999));
  return `TPS${randomSpecialChar()}${randomString}`;
};

export const isNil = function (obj: any) {
  return obj === null || obj === undefined;
};

export const isEmpty = function (obj: any) {
  return [Object, Array].includes((obj || {}).constructor) && !Object.entries(obj || {}).length;
};

export const isNilOrEmpty = function (obj: any) {
  return isNil(obj) || isEmpty(obj);
};
