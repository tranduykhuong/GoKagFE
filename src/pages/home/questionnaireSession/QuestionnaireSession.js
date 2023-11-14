import React from 'react';
import classes from './QuestionnaireSession.module.scss';
import Session from '../components/session/Session';
import CardList from '../components/cardList/CardList';
import img1 from '../../../assets/imgs/temp/img1.png';
import img3 from '../../../assets/imgs/temp/img3.png';
import img4 from '../../../assets/imgs/temp/img4.png';
import useAxios from '../../../hook/useAxios';
import { LoadingDonut } from '../../../components/loading/Loading';

const imgList = [img4, img3, img1];

const QuestionnaireSession = () => {
  const [response, e, isLoading] = useAxios(
    'get',
    '/questionnaire/?limit=4&offset=0&is_collecting=True',
    {},
    {},
    []
  );

  return (
    <div className={classes.questionnaireSession}>
      <Session
        title="Tackle your next Survey with GoKag"
        summary="On GoKag you'll create surveys from xlsx files or enter and collect data quickly."
        statistics={[
          { number: '200', unit: 'SURVEYS' },
          { number: '505k', unit: 'USERS' },
          { number: '245k', unit: 'DOWNLOADS' },
        ]}
        imgList={imgList}
      />
      {!isLoading && response ? (
        <CardList
          title="Surveys"
          description="Collecting data from surveys is no longer a difficult problem with GoKag"
          path="/surveys"
          data={response.results}
        />
      ) : (
        <LoadingDonut />
      )}
      <div className={classes.questionnaireSession__end} />
    </div>
  );
};

export default QuestionnaireSession;
