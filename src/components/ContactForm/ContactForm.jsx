'use client'
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import styles from './ContactForm.module.scss';

const initialValues = {
  name: '',
  email: '',
  message: '',
};

const validationSchema = Yup.object({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email address').required('Required'),
  message: Yup.string().required('Required'),
});

export const ContactForm = ({ onSubmitSuccess }) => {

  const [values, setValues] = useState(initialValues);

  const [fieldStates, setFieldStates] = useState({
    name: false,
    email: false,
    message: false,
  });

  const [isMessageSent, setIsMessageSent] = useState(false);
  const [isMessageVisible, setIsMessageVisible] = useState(false);

  const handleFieldChange = (fieldName, value) => {
    setFieldStates((prevFieldStates) => ({
      ...prevFieldStates,
      [fieldName]: !!value.trim(),
    }));
  };

  const onSubmit = async (values, { resetForm }) => {
    try {
      await axios.post('/api/contact', values); // Отправляем данные формы на сервер
      // Здесь вы можете добавить код для обработки успешной отправки, например, очистка формы или вывод сообщения пользователю
      console.log('Форма успешно отправлена!');
      resetForm(); // Сбрасываем значения полей формы к исходным значениям
      setValues(initialValues); // Сбрасываем значения полей формы в локальном состоянии
      setIsMessageSent(true);
      setIsMessageVisible(true);

      // Call the onSubmitSuccess callback after successful form submission
      if (isMessageSent) {
        onSubmitSuccess();
      }

      setTimeout(() => {
        setIsMessageVisible(false);
      }, 5000); // Hide the message popup after 5 seconds
    } catch (error) {
      console.error('Ошибка при отправке формы:', error);
      // Здесь вы можете добавить код для обработки ошибки отправки, например, вывод сообщения пользователю
    }
  };

  // Создаем портал для всплывающего окна
  const MessagePopup = ({ isOpen }) => {
    if (!isMessageVisible) return null;
    // if (!isOpen) return null;

    return ReactDOM.createPortal(
      <div className={styles.popupContainer}>
        <div className={styles.messagePopup}>
          <div className={styles.messageContent}>
            <svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" viewBox="0 0 20 20" fill="none">
              <path d="M15 7L7.99998 14L4.99994 11M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <div className={styles.messageTextWrapper}>
              <h3 className={styles.messageTitle}>Collaboration in progress...</h3>
              <p className={styles.messageText}>I received your message and will contact you soon.</p>
            </div>
            {/* <button onClick={closeMessagePopup}>Close</button> */}
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div>
      <Formik initialValues={initialValues} validationSchema={validationSchema} validateOnBlur onSubmit={onSubmit}>
        <Form className={styles.form}>
          <div
            className={styles.inputData}
          >
            <Field
              className={styles.input}
              type="text"
              id="name"
              name="name"
              onFocus={() => setFieldStates({ ...fieldStates, name: true })}
              onBlur={(e) => handleFieldChange('name', e.target.value)}
            />
            <label
              htmlFor="name"
              className={`${styles.label} ${fieldStates.name || initialValues.name ? styles.focused : ''}`}
            >
              Name
            </label>
            <ErrorMessage name="name" component="div" className={styles.errorMessage} />
          </div>

          <div
            className={styles.inputData}
          >
            <Field
              className={styles.input}
              type="email"
              id="email"
              name="email"
              onFocus={() => setFieldStates({ ...fieldStates, email: true })}
              onBlur={(e) => handleFieldChange('email', e.target.value)}
            />
            <label
              htmlFor="email"
              className={`${styles.label} ${fieldStates.email || initialValues.email ? styles.focused : ''}`}
            >
              Email
            </label>
            <ErrorMessage name="email" component="div" className={styles.errorMessage} />
          </div>

          <div
            className={`${styles.inputData} ${styles.textarea}`}
          >
            <Field
              as="textarea"
              id="message"
              name="message"
              onFocus={() => setFieldStates({ ...fieldStates, message: true })}
              onBlur={(e) => handleFieldChange('message', e.target.value)}
            />
            <label
              htmlFor="message"
              className={`${styles.labelTextarea} ${fieldStates.message || initialValues.message ? styles.focused : ''}`}
            >
              Message
            </label>
            <ErrorMessage name="message" component="div" className={styles.errorMessage} />
          </div>

          <div
            className={styles.buttonBlock}>
            <button
              className={styles.button}
              type="submit"
            >
              <div className="svg-wrapper-1">
                <div className={styles.svgWrapper}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                  >
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path
                      fill="currentColor"
                      d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                    ></path>
                  </svg>
                </div>
              </div>
              <span>Send</span>
            </button>
          </div>
        </Form>
      </Formik>
      <MessagePopup isOpen={isMessageSent} />
    </div>
  );
};