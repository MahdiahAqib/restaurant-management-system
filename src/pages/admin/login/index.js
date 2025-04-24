// src/pages/admin/login/index.js

import React, { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../../../styles/Login.module.css'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({ email, password, rememberMe })
  }

  return (
    <>
      <Head>
        <title>Admin Login | Restaurant Admin</title>
      </Head>
      <div className={styles.loginContainer}>
        <div className={styles.leftPanel}>
          <div className={styles.formContainer}>
            <div className={styles.glowBorder} /> {/* Glow */}
            <div className={styles.formInner}>
              <div className={styles.branding}>
                <h1 className={styles.restaurantName}>Restaurant</h1>
                <p className={styles.adminText}>ADMIN PORTAL</p>
              </div>
              <form onSubmit={handleSubmit} className={styles.loginForm}>
                <h2 className={styles.loginTitle}>Sign In</h2>
                <div className={styles.inputGroup}>
                  <label htmlFor="email" className={styles.inputLabel}>Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.inputField}
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="password" className={styles.inputLabel}>Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.inputField}
                    required
                  />
                </div>
                <div className={styles.rememberMe}>
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className={styles.checkbox}
                  />
                  <label htmlFor="rememberMe" className={styles.rememberLabel}>Remember me</label>
                </div>
                <button type="submit" className={styles.loginButton}>Login</button>
                <a href="#" className={styles.forgotPassword}>Forgot password?</a>
              </form>
            </div>
          </div>
        </div>
        <div className={styles.rightPanel}>
          <Image
            src="/food-login.jpg"
            alt="Restaurant background"
            fill
            priority
            quality={100}
            className={styles.backgroundImage}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    </>
  )
}

export default LoginPage
