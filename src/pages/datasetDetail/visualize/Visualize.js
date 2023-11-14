import React from 'react';
import { useRecoilValue } from 'recoil';
import classes from './Visualize.module.scss';
import PieChart from '../../../components/chartCT/PieChart';
import { statisticsRecoil } from '../recoil';
import HorizontalLineChart from '../../../components/chartCT/HorizontalLineChart';
import ChartPlaceholder from '../../../components/chartPlaceholder/ChartPlaceholder';

const Visualize = () => {
  const statistics = useRecoilValue(statisticsRecoil);

  return (
    <div className={classes.visualize}>
      <h2 className={classes.visualize__heading}>Statistics</h2>
      <div className={classes.visualize__chart}>
        {statistics ? (
          statistics.map((item, idx) => {
            if (item.type === 'SelectType' && item.multiselect === false) {
              return (
                <div className={classes['visualize__chart-item']} key={+idx}>
                  <p className={classes['visualize__chart-label']}>{item.label}</p>
                  <PieChart statistics={item} />
                </div>
              );
            }
            if (item.type === 'SelectType' && item.multiselect === true) {
              return (
                <div className={classes['visualize__chart-item']} key={+idx}>
                  <p className={classes['visualize__chart-label']}>{item.label}</p>
                  <HorizontalLineChart statistics={item} />
                </div>
              );
            }
            if (item.type === 'InputType') {
              return (
                <div className={classes['visualize__chart-item']} key={+idx}>
                  <p className={classes['visualize__chart-label']}>{item.label}</p>
                  <div className={classes['visualize__chart-list']}>
                    {Object.keys(item.statistics).map((key, index) => (
                      <div key={+index}>{key}</div>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          })
        ) : (
          <ChartPlaceholder />
        )}
      </div>
    </div>
  );
};

export default Visualize;
