/* eslint-disable no-return-assign */
import React, { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Editor } from '@tinymce/tinymce-react';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { useRecoilState } from 'recoil';
import { toast } from 'react-toastify';
import classes from './General.module.scss';
import Tag from '../../../components/tag/Tag';
import CardDatasets from '../../../components/cardDatasets/CardDatasets';
import ButtonCT from '../../../components/button/ButtonCT';
import { aboutRecoil } from '../recoil';
import useAxiosPrivate from '../../../hook/useAxiosPrivate';
import auth from '../../../utils/auth';
import ModalTags from './modalTags/ModalTags';
import useAxios from '../../../hook/useAxios';
import { handleDataChartViews } from '../handle';

ChartJS.register(...registerables);

const General = () => {
  const [description, setDescription] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [isOpenTags, setIsOpenTags] = useState(false);
  const [chartData, setChartData] = useState({
    labels: [],
    data: [],
    yMax: 10,
  });
  const [about, setAbout] = useRecoilState(aboutRecoil);
  const editorRef = useRef(null);
  const axiosPrivate = useAxiosPrivate();

  const [similarData, e, isLoading] = useAxios(
    'get',
    `/questionnaire/?tags=${about.tags}&limit=12&offset=0`,
    {},
    {},
    []
  );

  const handleSave = async () => {
    if (editorRef.current) {
      setDescription(editorRef.current.getContent());

      try {
        const res = await axiosPrivate.patch(`/questionnaire/${about.id}/`, {
          description: editorRef.current.getContent(),
        });
        console.log(res);
        setAbout(res.data);
        setIsEdit(false);
        toast.success('Update description successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      } catch (e) {
        toast.error('Update description failed! Please try again!', {
          position: 'top-right',
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      }
    }
  };

  useEffect(() => {
    setDescription(about.description);
    const res = handleDataChartViews(about.statistic_views);
    setChartData({
      labels: res.labels,
      data: res.data,
      yMax: res.yMax,
    });
  }, [about]);

  useEffect(() => {
    const element = document.getElementById('about_dataset');
    if (element) {
      element.innerHTML = description;
      const ulTags = element.getElementsByTagName('ul');
      for (let i = 0; i < ulTags.length; i += 1) {
        ulTags[i].style.paddingLeft = '30px';
      }

      if (isEdit) {
        element.innerHTML = '';
      }
    }
  }, [description, isEdit]);

  const dataChart = {
    labels: chartData.labels,
    datasets: [
      {
        id: 1,
        data: chartData.data,
        borderColor: ['rgb(65 89 205)'],
        tension: 0.05,
      },
    ],
  };
  const options = {
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      title: {
        display: false,
      },
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      y: {
        grid: {
          borderDash: [2, 2],
          drawBorder: true,
          borderColor: 'rgba(230, 233, 235, 1)',
        },
        min: 0,
        max: chartData.yMax,
      },
      x: {
        grid: {
          borderDash: [2, 2],
          drawBorder: true,
          borderColor: 'rgba(230, 233, 235, 1)',
        },
      },
    },
  };

  return (
    <div className={classes.datasetDetail}>
      <div className={`${classes.datasetDetail__session} ${classes.datasetDetail__about}`}>
        <div className={classes['datasetDetail__about-left']}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h2>About Dataset</h2>
            {!isEdit && !!auth.getAccessToken() && auth.getUser().id === about.author.id && (
              <ButtonCT standard borderRadius medium iconLeft={faPencil} onClick={() => setIsEdit(true)}>
                Edit
              </ButtonCT>
            )}
          </div>
          <div id="about_dataset">{description}</div>
          {isEdit && (
            <>
              <Editor
                apiKey={process.env.REACT_APP_API_TINY}
                onInit={(_evt, editor) => (editorRef.current = editor)}
                initialValue={description}
                init={{
                  height: 500,
                  menubar: false,
                  plugins: [
                    'advlist',
                    'autolink',
                    'lists',
                    'link',
                    'image',
                    'charmap',
                    'preview',
                    'anchor',
                    'searchreplace',
                    'visualblocks',
                    'code',
                    'fullscreen',
                    'insertdatetime',
                    'media',
                    'table',
                    'code',
                    'help',
                    'wordcount',
                  ],
                  toolbar:
                    'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                  content_style:
                    'body { font-family:Rubik, Roboto, BlinkMacSystemFont, Inter; font-size:16px; color: #3c4043 }',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'end', gap: '10px', padding: '16px 0' }}>
                <ButtonCT opacityBtn medium borderRadius onClick={() => setIsEdit(false)}>
                  <strong>Cancel</strong>
                </ButtonCT>
                <ButtonCT primary medium borderRadius onClick={handleSave}>
                  <strong>Save</strong>
                </ButtonCT>
              </div>
            </>
          )}
        </div>
        <div className={classes['datasetDetail__about-right']}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h3>Tags</h3>
            {!!auth.getAccessToken() && auth.getUser().id === about.author.id && (
              <ButtonCT standard borderRadius medium iconLeft={faPencil} onClick={() => setIsOpenTags(true)}>
                Edit
              </ButtonCT>
            )}
          </div>
          {about.tags.split('|').map((item) => (
            <Tag title={item} key={item} />
          ))}
        </div>
      </div>
      <div className={classes.datasetDetail__overview}>
        <h2>Activity overview</h2>
        <div className={classes['datasetDetail__overview-wrapper']}>
          <div className={classes['datasetDetail__overview-figures']}>
            <div>
              <span>Views</span>
              <h1>{about.views}</h1>
            </div>
            <div>
              <span>Downloads</span>
              <h1>{about.downloads}</h1>
            </div>
          </div>
          <div className={classes['datasetDetail__overview-chart']}>
            <Line width="100%" datasetIdKey="id" data={dataChart} options={options} />
          </div>
        </div>
      </div>

      <div className={classes.datasetDetail__similar}>
        <h2>Similar Datasets</h2>
        {!isLoading && similarData && (
          <div className={classes['datasetDetail__similar-list']}>
            {similarData.results
              .filter((e) => e.title !== about.title)
              .map((item, idx) => (
                <CardDatasets type={1} item={item} key={+idx} />
              ))}
          </div>
        )}
      </div>
      <ModalTags isOpen={isOpenTags} setIsOpen={setIsOpenTags} />
    </div>
  );
};

export default General;
