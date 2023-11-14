import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faFileUpload, faLink } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import classes from './ModalCreateSurvey.module.scss';
import InputCT from '../../../components/inputCT/InputCT';
import ButtonCT from '../../../components/button/ButtonCT';
import DragDropFile from '../../../components/dragDropFile/DragDropFile';
import SelectOption from '../../../components/selectOption/SelectOption';
import MyProgressBar from '../../../components/progressbar/MyProgressBar';
import useMergeState from '../../../hook/useMergeState';
import useAxiosPrivate from '../../../hook/useAxiosPrivate';
import auth from '../../../utils/auth';

const ModalCreateSurvey = () => {
  const navigate = useNavigate();
  const path = useLocation();
  const axiosPrivate = useAxiosPrivate();
  const [title, setTitle] = useState('');
  const [visibility, setVisibility] = useState('Private');
  const [surveying, setSurveying] = useState('Lock');
  const [xlsxFile, setXLSXFile] = useState(null);
  const [state, setState] = useMergeState({
    step: 1,
    isCreate: false,
    isLoading: false,
    isSuccess: false,
    isStart: false,
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      setXLSXFile(file);
    }
  };

  const handleRemoveFile = () => {
    setXLSXFile(null);
    setState({
      isCreate: false,
      isLoading: false,
      isSuccess: false,
      isStart: false,
    });
  };

  const handleCreate = async () => {
    const object = {
      title,
      summary: '',
      description: '',
      tag: '',
      is_collecting: surveying === 'UnLock',
      is_public: visibility === 'Public',
    };

    try {
      setState({ isLoading: true, isSuccess: false, isStart: true });
      const res = await axiosPrivate.post('/questionnaire/', object);
      console.log(res);

      try {
        const formData = new FormData();
        formData.append('file', xlsxFile);
        formData.append('questionnaire', res.data.data.id);

        if (xlsxFile) {
          await axiosPrivate.post('/upload/question/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        }

        toast.success('Create survey successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
        setTimeout(() => {
          navigate(`/surveys/${res.data.data.slug}/edit`);
        }, 1000);
      } catch (error) {
        console.error('Lỗi khi tải tệp XLSX:', error);
        await axiosPrivate.delete(`/questionnaire/${res.data.data.id}/`, {}, {});
        toast.error('Create survey failed! Please try again!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
        handleRemoveFile();
      } finally {
        setState({ isLoading: false, isSuccess: true });
      }
    } catch (e) {
      console.log(e);
      toast.error('The title of survey is already existed! Please try again!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      handleRemoveFile();
    }
  };

  useEffect(() => {
    if (path.search && path.search.includes('?new=true') && !auth.getAccessToken()) {
      navigate('/auth/login', { state: `${path.pathname}?new=true` });
      toast.info('Please login to create dataset!', {
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
  }, [path]);

  return (
    <div
      className={`${classes.modal_wrapper} ${
        path.search === '?new=true' ? classes['modal_wrapper--show'] : classes['modal_wrapper--hidden']
      }`}
    >
      <div
        className={`${classes.modalCreateSurvey} ${
          path.search === '?new=true' ? classes['modalCreateSurvey--show'] : classes['modalCreateSurvey--hidden']
        }`}
      >
        <div className={classes.modalCreateSurvey__sidebar}>
          <FontAwesomeIcon icon={faFileUpload} fontSize={18} />
          <FontAwesomeIcon icon={faLink} fontSize={18} />
        </div>
        <div className={classes.modalCreateSurvey__body}>
          <div className={classes.modalCreateSurvey__heading}>
            <div>
              <h2>Create Survey</h2>
              <FontAwesomeIcon
                className={classes['modalCreateSurvey__heading-close']}
                icon={faClose}
                fontSize={20}
                onClick={() => navigate(path.pathname)}
              />
            </div>
            <div style={{ padding: '0 10px' }}>
              <InputCT
                standard
                type="text"
                placeholder="Survey Title"
                required
                defaultValue={title}
                setValue={setTitle}
              />
            </div>
          </div>
          <div className={classes.modalCreateSurvey__content}>
            {state.step === 1 ? (
              <div style={{ width: '50%' }}>
                <h5>Visibility</h5>
                <SelectOption options={['Private', 'Public']} defaultValue={visibility} setSelect={setVisibility} />
                <br />
                <h5>Surveying</h5>
                <SelectOption options={['Lock', 'UnLock']} defaultValue={surveying} setSelect={setSurveying} />
              </div>
            ) : xlsxFile ? (
              <div className={classes['modalCreateSurvey__content-progress']}>
                <MyProgressBar
                  miliseconds={((xlsxFile.size / 1000) * 1000) / 2}
                  label={xlsxFile.name}
                  start={state.isStart}
                  end={state.isSuccess}
                />
                <div
                  className={classes['modalCreateSurvey__content-progress--removeBtn']}
                  style={{ pointerEvents: `${state.isLoading ? 'none' : ''}` }}
                  onClick={handleRemoveFile}
                >
                  <FontAwesomeIcon icon={faClose} />
                </div>
              </div>
            ) : (
              <>
                <DragDropFile typeFile=".xlsx" handleImageChange={handleFileChange} />
                <p style={{ paddingTop: '16px', color: 'red', fontSize: '1.4rem' }}>
                  Upload a xlsx file to create questionnaire or Enter a questionnaire form in next step
                </p>
              </>
            )}
          </div>
          <div className={classes.modalCreateSurvey__btn}>
            {state.step !== 1 && (
              <ButtonCT borderRadius opacityBtn medium onClick={() => setState({ step: state.step - 1 })}>
                Back
              </ButtonCT>
            )}
            {state.step === 1 && (
              <ButtonCT
                borderRadius
                outlineBtn
                medium
                disabled={title === ''}
                onClick={() => setState({ step: state.step + 1 })}
                style={{ width: '73px' }}
              >
                Next
              </ButtonCT>
            )}
            {state.step === 2 && (
              <ButtonCT borderRadius primary medium style={{ width: '73px' }} onClick={handleCreate}>
                Create
              </ButtonCT>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalCreateSurvey;
