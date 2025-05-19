import React from 'react';
import styles from './SomaiyaLoginButton.css';

const SomaiyaLoginButton = () => {
  const handleSomaiyaLogin = () => {
  };

  return (
    <button className={styles.somaiyaLoginButton} onClick={handleSomaiyaLogin} aria-label="Login with Somaiya mail">
      <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/3b171499d6072aac46754b8d70fe98b50a7940f8" alt="" className={styles.buttonIcon} aria-hidden="true" />
      <span className={styles.buttonText}>Login with Somaiya mail</span>
    </button>
  );
};

export default SomaiyaLoginButton;