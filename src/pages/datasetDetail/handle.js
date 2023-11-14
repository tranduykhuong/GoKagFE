import moment from 'moment';

export const handleDataChartViews = (views) => {
  const labels = [];
  const data = [];
  let currentDate = moment();
  let yMax = 0;

  for (let i = 0; i < views.length; i += 1) {
    const e = views[i];
    yMax = Math.max(yMax, e.views);
    if (i === 0) {
      labels.push(e.create_at);
      data.push(e.views);
      currentDate = moment(e.create_at);
    } else {
      currentDate = currentDate.add(1, 'days');
      let formattedDate = currentDate.format('YYYY-MM-DD');
      while (e.create_at !== formattedDate) {
        labels.push(formattedDate);
        data.push(0);

        currentDate = currentDate.add(1, 'days');
        formattedDate = currentDate.format('YYYY-MM-DD');
      }
      labels.push(e.create_at);
      data.push(e.views);
    }
  }

  return { labels, data, yMax };
};
