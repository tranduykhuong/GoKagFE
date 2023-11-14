/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { useRecoilState } from 'recoil';
import classes from './ModalTags.module.scss';
import useAxios from '../../../../hook/useAxios';
import useAxiosPrivate from '../../../../hook/useAxiosPrivate';
import ButtonCT from '../../../../components/button/ButtonCT';
import InputCT from '../../../../components/inputCT/InputCT';
import Tag from '../../../../components/tag/Tag';
import { aboutRecoil } from '../../recoil';

const ModalTags = ({ isOpen, setIsOpen }) => {
  const [search, setSearch] = useState('');
  const [tags, setTags] = useState([]);
  const [selected, setSelected] = useState([]);
  const [about, setAbout] = useRecoilState(aboutRecoil);
  const axiosPrivate = useAxiosPrivate();

  const [response] = useAxios('get', '/questionnaire/all-tags/', {}, {}, []);

  const handleSelect = (item) => {
    const tagsTmp = tags.filter((e) => e !== item);
    const selectedTmp = [...selected, item];
    setTags(tagsTmp);
    setSelected(selectedTmp);
  };

  const handleUnSelect = (item) => {
    const selectedTmp = selected.filter((e) => e !== item);
    const tagsTmp = [...tags, item];
    setTags(tagsTmp);
    setSelected(selectedTmp);
  };

  const handleAddNew = () => {
    const tmp = [...selected, search];
    setSelected(tmp);
    setSearch('');
  };

  const handleSave = async () => {
    try {
      const res = await axiosPrivate.patch(`/questionnaire/${about.id}/`, {
        tags: selected.join('|'),
      });
      console.log(res);
      setAbout(res.data);

      setIsOpen(false);
      setSearch('');

      toast.success('Update tags successfully!', {
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
      toast.error('Update tags failed! Please try again!', {
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
  };

  useEffect(() => {
    if (response) {
      const tagsSelected = about.tags.split('|');
      const tmp = [];
      for (const item of response.data) {
        if (tagsSelected.indexOf(item.name) === -1) {
          tmp.push(item.name);
        }
      }
      setSelected(tagsSelected);
      setTags(tmp);
    }
  }, [response, isOpen]);

  return (
    <div
      className={`${classes.modalTags__wrapper} ${
        isOpen ? classes['modalTags__wrapper--show'] : classes['modalTags__wrapper--hidden']
      }`}
    >
      <div className={`${classes.modalTags} ${isOpen ? classes['modalTags--show'] : classes['modalTags--hidden']}`}>
        <div className={classes.modalTags__heading}>
          <div className={classes['modalTags__heading-close']} onClick={() => setIsOpen(false)}>
            <FontAwesomeIcon icon={faClose} fontSize={20} />
          </div>
          <h2>Edit Tags</h2>
        </div>
        <div className={classes.modalTags__body}>
          <div className={classes['modalTags__body-left']}>
            <div className={classes['modalTags__body-left-search']}>
              <InputCT
                standard
                type="text"
                defaultValue={search}
                nonLabel
                placeholder="Search tag..."
                setValue={setSearch}
              />
            </div>
            {tags
              .filter((item) => item.toLowerCase().includes(search.toLowerCase()))
              .map((item, idx) => (
                <div className={classes['modalTags__body-left-item']} key={+idx} onClick={() => handleSelect(item)}>
                  {item}
                </div>
              ))}
            {search && tags.filter((item) => item.toLowerCase().includes(search.toLowerCase())).length === 0 && (
              <ButtonCT standard medium onClick={handleAddNew}>
                {`Add "${search}"`}
              </ButtonCT>
            )}
          </div>
          <div className={classes['modalTags__body-right']}>
            {selected.map((item, idx) => (
              <Tag title={item} key={+idx} active onClose={() => handleUnSelect(item)} />
            ))}
          </div>
        </div>
        <div className={classes.modalTags__btn}>
          <ButtonCT opacityBtn borderRadius medium onClick={() => setIsOpen(false)}>
            <strong>Cancel</strong>
          </ButtonCT>
          <ButtonCT primary borderRadius medium style={{ width: '100px' }} onClick={handleSave}>
            <strong>Save</strong>
          </ButtonCT>
        </div>
      </div>
    </div>
  );
};

export default ModalTags;
