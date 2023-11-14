import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import classes from './Session.module.scss';
import desktopBefore from '../../../../assets/svg/desktop_before.svg';
import desktopAfter from '../../../../assets/svg/desktop_after.svg';

const Session = ({ title, summary, statistics, imgList }) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  const dataList = imgList || [];

  const handleClickPrev = () => {
    setCurrentIdx((pre) => (pre === 0 ? dataList.length - 1 : pre - 1));
  };

  const handleClickNext = () => {
    setCurrentIdx((pre) => (pre + 1) % dataList.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleClickNext();
    }, 4000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={classes.session}>
      <div className={classes.session__content}>
        <h1>{title}</h1>
        <p>{summary}</p>
        <div className={classes['session__content-statistic']}>
          {statistics &&
            statistics.map((item, idx) => (
              <div key={+idx}>
                <h2>{item.number}</h2>
                <p>{item.unit}</p>
              </div>
            ))}
        </div>
      </div>
      <div className={classes.session__desktop}>
        <div className={classes['session__desktop-wrap']}>
          <img src={desktopBefore} className={classes.desktop_before} alt="" />
          <img src={desktopAfter} className={classes.desktop_after} alt="" />
          <div className={classes['session__desktop-wrap--bg']}>
            <div className={classes['session__desktop-wrap--bg-header']}>
              <div className={classes['session__desktop-wrap--bg-header-tool-1']} />
              <div className={classes['session__desktop-wrap--bg-header-tool-2']} />
              <div className={classes['session__desktop-wrap--bg-header-tool-3']} />
              <div className={classes['session__desktop-wrap--bg-header-tool-4']} />
            </div>
            <div className={classes['session__desktop-wrap--bg-content']}>
              <div className={classes.desktop_list} style={{ transform: `translateX(-${currentIdx * 100}%)` }}>
                {dataList &&
                  dataList.map((item, idx) => (
                    <div className={classes['desktop_list--item']} key={+idx}>
                      <img src={item} alt="" width="100%" />
                    </div>
                  ))}
              </div>
              <div className={classes.desktop_directional}>
                <FontAwesomeIcon
                  className={classes['desktop_directional-prev']}
                  icon={faAngleLeft}
                  onClick={handleClickPrev}
                />
                <FontAwesomeIcon
                  className={classes['desktop_directional-next']}
                  icon={faAngleRight}
                  onClick={handleClickNext}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Session;
