import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { useRecoilValue } from 'recoil';
import classes from './DataCard.module.scss';
import useWindowEvent from '../../../hook/useWindowEvent';
import { aboutRecoil, datasetRecoil } from '../recoil';
import { LoadingDonut } from '../../../components/loading/Loading';

const DataCard = () => {
  const table = document.getElementById('table');
  const [isScroll, setIsScroll] = useState(false);
  const about = useRecoilValue(aboutRecoil);
  const dataset = useRecoilValue(datasetRecoil);

  const handleDownload = () => {
    // Tạo URL để tải tệp XLSX
    const downloadUrl = `${process.env.REACT_APP_API_ENDPOINT}/datasets/download?slug=${about.slug}`;

    // Tạo một thẻ a ẩn để kích hoạt tải về
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.target = '_blank';
    link.download = 'example.xlsx';
    link.click();
  };

  useWindowEvent(
    'scroll',
    (e) => {
      setIsScroll(e.target.scrollTop !== 0);
    },
    table
  );

  return (
    <div className={classes.dataCard}>
      <div className={classes.dataCard__heading}>
        <h2>{`${about.title}.xlsx`}</h2>
        <div style={{ cursor: 'pointer' }} onClick={handleDownload}>
          <FontAwesomeIcon icon={faDownload} />
        </div>
      </div>
      <div className={classes.dataCard__nav}>
        <div className={`${classes['dataCard__nav-item']} ${classes['dataCard__nav--active']}`}>Compact</div>
        <div className={classes['dataCard__nav-item']}>Analyst</div>
      </div>

      <div className={classes.dataCard__wrapper_table} id="table">
        <div className={classes.dataCard__table}>
          <div
            className={`${classes['dataCard__table-heading']} ${
              isScroll ? classes['dataCard__table-heading--sticky'] : undefined
            }`}
          >
            {about &&
              about.questions.map((item, idx) => (
                <div className={classes['dataCard__table-heading--col']} key={+idx}>
                  <span>{item.label}</span>
                </div>
              ))}
          </div>
          {dataset ? (
            Object.keys(dataset).length ? (
              Object.keys(dataset).map((key, idx) => (
                <div className={classes['dataCard__table-row']} key={+idx}>
                  {dataset[key].map((item, index) => (
                    <div className={classes['dataCard__table-row--col']} key={+index}>
                      {item.value}
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <p style={{ padding: '20px' }}>No data</p>
            )
          ) : (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <LoadingDonut large />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataCard;
