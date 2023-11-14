import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { useRecoilState } from 'recoil';
import Cropper from 'react-cropper';
import { toast } from 'react-toastify';
import classes from './ModalUploadImg.module.scss';
import DragDropFile from '../../../../components/dragDropFile/DragDropFile';
import 'cropperjs/dist/cropper.css';
import ButtonCT from '../../../../components/button/ButtonCT';
import { aboutRecoil } from '../../recoil';
import { base64ToBlob } from '../../../../utils/base64toBlob';
import { axiosPrivate } from '../../../../api/axios';

const ModalUploadImg = ({ isOpen, setIsOpen }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [about, setAbout] = useRecoilState(aboutRecoil);
  const cropperRef = useRef(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = () => {
    if (typeof cropperRef.current.cropper.getCroppedCanvas() === 'undefined') {
      return;
    }
    setCroppedImage(cropperRef.current.cropper.getCroppedCanvas().toDataURL());
  };

  const handleRemoveImg = () => {
    setImageSrc(null);
    setCroppedImage(null);
  };

  const handleSave = async () => {
    try {
      const file = base64ToBlob(croppedImage);
      const formData = new FormData();
      const image = new File([file], 'image.png', { type: 'image/png' });
      formData.append('thumb', image);

      const res = await axiosPrivate.patch(`/questionnaire/thumb/?questionnaire=${about.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const aboutUpdated = { ...about, thumb: res.data.data.thumb };
      setAbout(aboutUpdated);

      setIsOpen(false);

      toast.success('Upload image successfully!', {
        position: 'top-right',
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    } catch (e) {
      toast.error('Upload image failed! Please try again!', {
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
    setImageSrc(about.thumb);
  }, [about]);

  return (
    <div
      className={`${classes.modalUploadImg__wrapper} ${
        isOpen ? classes['modalUploadImg__wrapper--show'] : classes['modalUploadImg__wrapper--hidden']
      }`}
    >
      <div
        className={`${classes.modalUploadImg} ${
          isOpen ? classes['modalUploadImg--show'] : classes['modalUploadImg--hidden']
        }`}
      >
        <div className={classes.modalUploadImg__heading}>
          <div className={classes['modalUploadImg__heading-close']} onClick={() => setIsOpen(false)}>
            <FontAwesomeIcon icon={faClose} fontSize={20} />
          </div>
          <h2>Edit Dataset Image</h2>
        </div>
        <div className={classes.modalUploadImg__body}>
          {imageSrc ? (
            <div style={{ backgroundColor: '#fff' }}>
              <Cropper
                ref={cropperRef}
                src={imageSrc}
                style={{ height: 250, width: '100%' }}
                aspectRatio={17 / 9}
                guides={false}
                crop={handleCrop}
                viewMode={1}
                dragMode="none"
              />
            </div>
          ) : (
            <DragDropFile handleImageChange={handleImageChange} />
          )}
          {croppedImage && (
            <div className={classes['modalUploadImg__body-crop']}>
              <h5>PREVIEW</h5>
              <img src={croppedImage} alt="Cropped" width={310} height={164} />
            </div>
          )}
        </div>
        {imageSrc && (
          <div className={classes.modalUploadImg__btn}>
            <ButtonCT opacityBtn borderRadius medium onClick={handleRemoveImg}>
              <strong>Remove Image</strong>
            </ButtonCT>
            <ButtonCT primary borderRadius medium style={{ width: '100px' }} onClick={handleSave}>
              <strong>Save</strong>
            </ButtonCT>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalUploadImg;
