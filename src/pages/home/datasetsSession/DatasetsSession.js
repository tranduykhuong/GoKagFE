import React from 'react';
import classes from './DatasetsSession.module.scss';
import Session from '../components/session/Session';
import CardList from '../components/cardList/CardList';
import img1 from '../../../assets/imgs/temp/img1.png';
import img2 from '../../../assets/imgs/temp/img2.png';
import img3 from '../../../assets/imgs/temp/img3.png';
import useAxios from '../../../hook/useAxios';
import { LoadingDonut } from '../../../components/loading/Loading';

const imgList = [img1, img2, img3];

const DatasetsSession = () => {
  const [response, e, isLoading] = useAxios('get', '/questionnaire/?limit=4&offset=0', {}, {}, []);
  console.log(response);

  return (
    <div className={classes.datasetsSession}>
      <Session
        title="Don't let the lack of data bother you"
        summary="On GoKag you'll find all the resources and knowledge needed for your next real-world project."
        statistics={[
          { number: '245k', unit: 'DATASETS' },
          { number: '945', unit: 'VIEWS' },
          { number: '345k', unit: 'DOWNLOADS' },
        ]}
        imgList={imgList}
      />
      {!isLoading && response ? (
        <CardList
          title="Datasets"
          description="Collecting data from surveys is no longer a difficult problem with GoKag"
          path="/datasets"
          data={response.results}
        />
      ) : (
        <LoadingDonut />
      )}
      <div className={classes.datasetsSession__end} />
    </div>
  );
};

export default DatasetsSession;
