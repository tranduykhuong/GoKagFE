import React from 'react';
import { useNavigate } from 'react-router';
import classes from './Home.module.scss';
import iconCreateDatasets from '../../assets/imgs/ic_create_dataset.png';
import icLearners from '../../assets/svg/ic_learners.svg';
import icDevelopers from '../../assets/svg/ic_developers.svg';
import icResearchers from '../../assets/svg/ic_researchers.svg';
import ButtonCT from '../../components/button/ButtonCT';
import DatasetsSession from './datasetsSession/DatasetsSession';
import QuestionnaireSession from './questionnaireSession/QuestionnaireSession';
import Animate from '../../components/animate/Animate';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className={classes.home}>
      <div className={classes.home__heading}>
        <div className={classes['home__heading-banner']}>
          <div className={classes['home__heading-banner-text']}>
            <h1>
              Level up with the largest Datasets and Surveys community
              <Animate />
            </h1>
            <p>
              Feel free to create your own surveys and data sets and share them with everyone. Discover a huge
              repository of community-published data & survey for your next project.
            </p>
            <div className={classes['home__heading-banner-text--btn']}>
              <ButtonCT large borderRadius outlineBtn block onClick={() => navigate('/surveys')}>
                <strong>Surveys</strong>
              </ButtonCT>
              <ButtonCT
                large
                borderRadius
                opacityBtn
                imgLeft={iconCreateDatasets}
                block
                style={{ minWidth: '190px' }}
                onClick={() => navigate('/datasets?new=true')}
              >
                <strong>Create datasets</strong>
              </ButtonCT>
            </div>
          </div>
          <div className={classes['home__heading-banner-img']}>
            <img
              data-fetchpriority="high"
              src="https://firebasestorage.googleapis.com/v0/b/gokag-19eac.appspot.com/o/bannerHome.jpg?alt=media"
              alt="banner"
            />
          </div>
        </div>
        <div className={classes['home__heading-who']}>
          <h2>Who are on GoKag?</h2>

          <div className={classes.whoSession}>
            <div className={classes.whoSession__item}>
              <div className={classes['whoSession__item-text']}>
                <h3>Learners</h3>
                <p>Learners search for data to serve their learning</p>
              </div>
              <img data-fetchpriority="low" src={icLearners} alt="icLearners" />
            </div>
            <div className={classes.whoSession__item}>
              <div className={classes['whoSession__item-text']}>
                <h3>Developers</h3>
                <p>Programmers use data to develop applications</p>
              </div>
              <img data-fetchpriority="low" src={icDevelopers} alt="icDevelopers" />
            </div>
            <div className={classes.whoSession__item}>
              <div className={classes['whoSession__item-text']}>
                <h3>Researchers</h3>
                <p>Advance ML with our pre-trained model hub & competitions.</p>
              </div>
              <img data-fetchpriority="low" src={icResearchers} alt="icResearchers" />
            </div>
          </div>
        </div>
        <div className={classes['home__session-end']} />
      </div>

      <DatasetsSession />
      <QuestionnaireSession />
    </div>
  );
};

export default Home;
