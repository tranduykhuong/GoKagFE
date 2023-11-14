import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import Cropper from 'react-cropper';
import { toast } from 'react-toastify';
import classes from './ModalUploadImg.module.scss';
import 'cropperjs/dist/cropper.css';
import DragDropFile from '../../../components/dragDropFile/DragDropFile';
import ButtonCT from '../../../components/button/ButtonCT';
import { base64ToBlob } from '../../../utils/base64toBlob';
import useAxiosPrivate from '../../../hook/useAxiosPrivate';
import auth from '../../../utils/auth';

const ModalUploadImg = ({ isOpen, setIsOpen, defaultImg }) => {
  const [imageSrc, setImageSrc] = useState(defaultImg);
  const [croppedImage, setCroppedImage] = useState(null);
  const cropperRef = useRef(null);

  const axiosPrivate = useAxiosPrivate();

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
      formData.append('avatar', image);

      const res = await axiosPrivate.patch('/auth/avatar/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      auth.updateAvatar(res.data.data.avatar);
      setIsOpen(false);

      toast.success('Upload avatar successfully!', {
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
      toast.error('Upload avatar failed! Please try again!', {
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
                aspectRatio={1 / 1}
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
              <img src={croppedImage} alt="Cropped" height={164} />
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
