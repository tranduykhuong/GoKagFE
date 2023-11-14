import React, { useEffect, useState } from 'react';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { useRecoilState } from 'recoil';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useDispatch } from 'react-redux';
import classes from './Settings.module.scss';
import InputCT from '../../../components/inputCT/InputCT';
import SelectOption from '../../../components/selectOption/SelectOption';
import ButtonCT from '../../../components/button/ButtonCT';
import ModalUploadImg from './modalUploadImg/ModalUploadImg';
import { aboutRecoil } from '../recoil';
import useAxiosPrivate from '../../../hook/useAxiosPrivate';
import useMergeState from '../../../hook/useMergeState';
import auth from '../../../utils/auth';
import { clearCache } from '../../../store/reducers/cacheSlice';

const Settings = () => {
  const navigate = useNavigate();
  const [visibility, setVisibility] = useState();
  const [surveying, setSurveying] = useState();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [isOpenModalImg, setIsOpenModalImg] = useState(false);
  const [about, setAbout] = useRecoilState(aboutRecoil);
  const [state, setState] = useMergeState({
    isLoading: false,
    isLoadingDelete: false,
    isChange: false,
  });
  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();

  const handleSave = async () => {
    const object = {
      title,
      summary,
      is_public: visibility === 'Public',
      is_collecting: surveying === 'UnLock',
    };

    try {
      setState({ isLoading: true });

      const res = await axiosPrivate.patch(`/questionnaire/${about.id}/`, object);

      if (about.slug !== res.data.slug) {
        navigate(`/datasets/${res.data.slug}/settings`);
      } else {
        setAbout(res.data);
      }

      toast.success('Update successfully!', {
        position: 'top-right',
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      setState({ isChange: false });
      dispatch(clearCache());
    } catch (e) {
      toast.error('Update failed! Please try again!', {
        position: 'top-right',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    } finally {
      setState({ isLoading: false });
    }
  };

  const handleDelete = async () => {
    try {
      setState({ isLoadingDelete: true });

      await axiosPrivate.delete(`/questionnaire/${about.id}/`);

      toast.success('Delete successfully!', {
        position: 'top-right',
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      dispatch(clearCache());
      navigate('/datasets');
    } catch (e) {
      toast.error('Delete failed! Please try again!', {
        position: 'top-right',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    } finally {
      setState({ isLoadingDelete: false });
    }
  };

  useEffect(() => {
    if (!auth.getAccessToken() || auth.getUser().id !== about.author.id) {
      navigate('/');
    }

    setVisibility(about.is_public ? 'Public' : 'Private');
    setSurveying(about.is_collecting ? 'UnLock' : 'Lock');
    setTitle(about.title);
    setSummary(about.summary);
  }, [about]);

  useEffect(() => {
    if (
      (title && title !== about.title) ||
      (summary && summary !== about.summary) ||
      (visibility && (visibility === 'Public') !== about.is_public) ||
      (surveying && (surveying === 'UnLock') !== about.is_collecting)
    ) {
      setState({ isChange: true });
    } else {
      setState({ isChange: false });
    }
  }, [visibility, surveying, title, summary]);

  return (
    <>
      <div className={classes.settings}>
        <h2>Settings</h2>
        <h3>General</h3>
        <InputCT
          standard
          type="text"
          defaultValue={title}
          title="Title"
          required
          nonLabel
          style={{ width: '50%' }}
          setValue={setTitle}
          // value={title}
        />
        <InputCT
          standard
          type="text"
          nonLabel
          defaultValue={summary}
          title="Summary"
          style={{ width: '75%' }}
          setValue={setSummary}
          // value={summary}
        />
        <div style={{ width: '40%' }}>
          <h5>Visibility</h5>
          <SelectOption options={['Private', 'Public']} defaultValue={visibility} setSelect={setVisibility} />
          <br />
          <h5>Surveying</h5>
          <SelectOption options={['Lock', 'UnLock']} defaultValue={surveying} setSelect={setSurveying} />
        </div>
        <br />
        <br />
        <h3>Image</h3>
        <div className={classes.settings__image}>
          <img src={about.thumb} alt="" />
          <div>
            <h4>Edit Header Image</h4>
            <ButtonCT outlineBtn medium borderRadius iconLeft={faImage} onClick={() => setIsOpenModalImg(true)}>
              Edit Image
            </ButtonCT>
          </div>
        </div>
        <div className={classes.settings__btn}>
          <ButtonCT
            borderRadius
            primary
            medium
            onClick={handleSave}
            style={{ width: '150px' }}
            loading={state.isLoading}
            disabled={!state.isChange}
          >
            <strong>Save Changes</strong>
          </ButtonCT>
          <ButtonCT
            borderRadius
            standard
            medium
            onClick={handleDelete}
            style={{ width: '120px' }}
            iconLeft={faTrashCan}
            loading={state.isLoadingDelete}
          >
            <strong>Delete</strong>
          </ButtonCT>
        </div>
      </div>
      <ModalUploadImg isOpen={isOpenModalImg} setIsOpen={setIsOpenModalImg} />
    </>
  );
};

export default Settings;
