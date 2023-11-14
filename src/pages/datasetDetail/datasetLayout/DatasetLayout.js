import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { faDownload, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { useRecoilState, RecoilRoot, useSetRecoilState } from 'recoil';
import { faShareFromSquare } from '@fortawesome/free-regular-svg-icons';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import classes from './DatasetLayout.module.scss';
import Author from '../../../components/author/Author';
import ButtonCT from '../../../components/button/ButtonCT';
import useAxios from '../../../hook/useAxios';
import { aboutRecoil, datasetRecoil, likersRecoil, statisticsRecoil } from '../recoil';
import { Loading } from '../../../components/loading/Loading';
import auth from '../../../utils/auth';
import NotFound from '../../notFound/notFound';
import ModalShare from './modalShare/ModalShare';
import { axiosPrivate } from '../../../api/axios';

const DatasetLayoutRecoil = () => {
  const path = useLocation();
  const navigate = useNavigate();
  const [curTab, setCurTab] = useState();
  const [pathname, setPathname] = useState();
  const [isOpenShare, setIsOpenShare] = useState(false);
  const [about, setAbout] = useRecoilState(aboutRecoil);
  const [likers, setLikers] = useRecoilState(likersRecoil);
  const setDataset = useSetRecoilState(datasetRecoil);
  const setStatistics = useSetRecoilState(statisticsRecoil);

  const [response] = useAxios('get', `/datasets/${path.pathname.split('/')[2]}/`, {}, {}, [
    path.pathname.split('/')[2],
  ]);
  const [resAbout, err, isLoadingAbout] = useAxios('get', `/questionnaire/${path.pathname.split('/')[2]}/`, {}, {}, [
    path.pathname.split('/')[2],
  ]);

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

  const handleLike = async () => {
    try {
      if (!auth.getAccessToken()) {
        navigate('/auth/login', { state: path.pathname });
        return;
      }
      const res = await axiosPrivate.patch(`/questionnaire/like/?questionnaire=${about.id}`);
      setLikers(res.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (response) {
      // setAbout(response.data.about);
      setDataset(response.data.datasets);
      setStatistics(response.data.statistics);
    }
  }, [response]);

  useEffect(() => {
    if (resAbout) {
      setAbout(resAbout.data);
      setLikers(resAbout.data.likers);
    }
  }, [resAbout]);

  useEffect(
    () => () => {
      const title = document.querySelector('title');
      if (title) {
        title.innerText = 'GoKag';
      }
    },
    []
  );

  useEffect(() => {
    const tmp = path.pathname.split('/');
    setPathname(tmp.slice(0, 3).join('/'));
    if (tmp.length === 3) {
      setCurTab('');
    } else {
      setCurTab(tmp[3]);
    }
  }, [path.pathname]);

  useEffect(() => {
    setDataset(null);
    setStatistics(null);
  }, [path.pathname.split('/')[2]]);

  return (isLoadingAbout || !about) && !err ? (
    <Loading />
  ) : err ? (
    <NotFound />
  ) : (
    <div className={classes.datasetLayout}>
      <Helmet>{about && <title>{`Datasets - ${about.title}`}</title>}</Helmet>
      <div className={classes.datasetLayout__heading}>
        <div>
          <Author size="28" rank={Math.floor(((Math.random() * 10) % 4) + 1)} img={about.author.avatar} />
          <p>
            {`${`${about.author.last_name} ${about.author.first_name}`} · UPDATE AT ${moment(about.create_at).format(
              'YYYY-MM-DD HH:mm:ss'
            )}`}
          </p>
        </div>
        <div>
          <div className={classes['datasetLayout__heading-vote']}>
            <div style={{ cursor: 'pointer' }} onClick={handleLike}>
              <FontAwesomeIcon
                color={
                  auth.getUser() && likers.filter((e) => e.id === auth.getUser().id).length > 0 ? 'orange' : '#666'
                }
                icon={faStar}
              />
            </div>
            <div>{likers ? likers.length : '0'}</div>
          </div>
          <ButtonCT
            className={classes['datasetLayout__heading-download-btn']}
            primary
            medium
            borderRadius
            iconLeft={faDownload}
            style={{ width: '130px' }}
            onClick={handleDownload}
            disabled={!about.is_public}
          >
            Download
          </ButtonCT>
          <div className={classes['datasetLayout__heading-btn']} onClick={() => setIsOpenShare(true)}>
            <FontAwesomeIcon icon={faShareFromSquare} />
          </div>
        </div>
      </div>
      <div className={classes.datasetLayout__info}>
        <div>
          <h1>{about.title}</h1>
          <p>{about.summary}</p>
        </div>
        <img data-fetchpriority="low" width="680" height="360" src={about.thumb} alt="" />
      </div>
      <div className={classes.datasetLayout__nav}>
        <div>
          <Link
            to={pathname}
            className={curTab === '' ? classes['datasetLayout__nav--active'] : undefined}
            onClick={() => setCurTab('')}
          >
            General
          </Link>
          <Link
            to={`${pathname}/data`}
            className={curTab === 'data' ? classes['datasetLayout__nav--active'] : undefined}
            onClick={() => setCurTab('data')}
          >
            Data Card
          </Link>
          <Link
            to={`${pathname}/visualize`}
            className={curTab === 'visualize' ? classes['datasetLayout__nav--active'] : undefined}
            onClick={() => setCurTab('visualize')}
          >
            Visualize
          </Link>

          {!!auth.getAccessToken() && auth.getUser().id === about.author.id && (
            <Link
              to={`${pathname}/settings`}
              className={curTab === 'settings' ? classes['datasetLayout__nav--active'] : undefined}
              onClick={() => setCurTab('settings')}
            >
              Settings
            </Link>
          )}
        </div>
        <span className={classes['datasetLayout__nav--line']} />
      </div>
      <Outlet />
      <span className={classes['datasetLayout__nav--line']} />
      <ModalShare isOpen={isOpenShare} setIsOpen={setIsOpenShare} />
    </div>
  );
};

const DatasetLayout = () => (
  <RecoilRoot>
    <DatasetLayoutRecoil />
  </RecoilRoot>
);

export default DatasetLayout;
