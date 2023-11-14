import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faFileUpload, faLink } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import classes from './ModalCreate.module.scss';
import InputCT from '../../../components/inputCT/InputCT';
import ButtonCT from '../../../components/button/ButtonCT';
import DragDropFile from '../../../components/dragDropFile/DragDropFile';
import SelectOption from '../../../components/selectOption/SelectOption';
import useMergeState from '../../../hook/useMergeState';
import useAxiosPrivate from '../../../hook/useAxiosPrivate';
import MyProgressBar from '../../../components/progressbar/MyProgressBar';
import auth from '../../../utils/auth';

const ModalCreate = () => {
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
      is_collecting: surveying === 'Unlock',
      is_public: visibility === 'Public',
    };

    try {
      setState({ isLoading: true, isSuccess: false, isStart: true });
      const res = await axiosPrivate.post('/questionnaire/', object);
      console.log(res);

      const formData = new FormData();
      formData.append('file', xlsxFile);
      formData.append('questionnaire', res.data.data.id);

      try {
        await axiosPrivate.post('/upload/datasets/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        toast.success('Create datasets successfully!', {
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
          navigate(`/datasets/${res.data.data.slug}`);
          setXLSXFile(null);
        }, 700);
      } catch (error) {
        console.error('Lỗi khi tải tệp XLSX:', error);
        await axiosPrivate.delete(`/questionnaire/${res.data.data.id}/`, {}, {});
        toast.error('Create datasets failed! Please try again!', {
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
      toast.error('The title of dataset is already existed! Please try again!', {
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
        className={`${classes.modalCreate} ${
          path.search === '?new=true' ? classes['modalCreate--show'] : classes['modalCreate--hidden']
        }`}
      >
        <div className={classes.modalCreate__sidebar}>
          <FontAwesomeIcon icon={faFileUpload} fontSize={18} />
          <FontAwesomeIcon icon={faLink} fontSize={18} />
        </div>
        <div className={classes.modalCreate__body}>
          <div className={classes.modalCreate__heading}>
            <div>
              <h2>Create Dataset</h2>
              <FontAwesomeIcon
                className={classes['modalCreate__heading-close']}
                icon={faClose}
                fontSize={20}
                onClick={() => navigate(path.pathname)}
              />
            </div>
            <div style={{ padding: '0 10px' }}>
              <InputCT
                standard
                type="text"
                placeholder="Dataset Title"
                required
                defaultValue={title}
                setValue={setTitle}
              />
            </div>
          </div>
          <div className={classes.modalCreate__content}>
            {state.step === 1 ? (
              <div style={{ width: '50%' }}>
                <h5>Visibility</h5>
                <SelectOption options={['Private', 'Public']} defaultValue={visibility} setSelect={setVisibility} />
                <br />
                <h5>Surveying</h5>
                <SelectOption options={['Lock', 'Unlock']} defaultValue={surveying} setSelect={setSurveying} />
              </div>
            ) : xlsxFile ? (
              <div className={classes['modalCreate__content-progress']}>
                <MyProgressBar
                  miliseconds={((xlsxFile.size / 1000) * 1000) / 2}
                  label={xlsxFile.name}
                  start={state.isStart}
                  end={state.isSuccess}
                />
                <div
                  className={classes['modalCreate__content-progress--removeBtn']}
                  style={{ pointerEvents: `${state.isLoading ? 'none' : ''}` }}
                  onClick={handleRemoveFile}
                >
                  <FontAwesomeIcon icon={faClose} />
                </div>
              </div>
            ) : (
              <DragDropFile typeFile=".xlsx" handleImageChange={handleFileChange} />
            )}
          </div>
          <div className={classes.modalCreate__btn}>
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
              <ButtonCT
                borderRadius
                primary
                medium
                disabled={xlsxFile === null}
                loading={state.isLoading}
                style={{ width: '73px' }}
                onClick={handleCreate}
              >
                Create
              </ButtonCT>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalCreate;
