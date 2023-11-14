/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
export const handleData = (statistics) => {
  let s = 0;
  for (const key in statistics.statistics) {
    s += statistics.statistics[key];
  }
  const labelsTmp = [];
  const dataTmp = [];
  for (const key in statistics.statistics) {
    labelsTmp.push(key);
    dataTmp.push((statistics.statistics[key] / s) * 100);
  }

  return { labels: labelsTmp, data: dataTmp };
};
