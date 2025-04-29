import { useState } from "react";
import styles from "../../../styles/UserLogin.module.css";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (data.success) {
      setIsNewUser(data.newUser);
      setStep(2);
    } else {
      alert(data.message);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, name }),
    });

    const data = await res.json();
    if (data.success) {
      router.push("/menu"); // redirect on success
    } else {
      alert(data.message);
    }
  };

  return (
    <div className={styles.loginContainer}>
      {step === 1 && (
        <form className={styles.loginForm} onSubmit={handleEmailSubmit}>
          <h2>Enter Email</h2>
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit">Send OTP</button>
        </form>
      )}

      {step === 2 && (
        <form className={styles.loginForm} onSubmit={handleOtpSubmit}>
          <h2>Enter OTP</h2>
          <input
            name="otp"
            type="text"
            placeholder="Enter OTP"
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          {isNewUser && (
            <input
              name="name"
              type="text"
              placeholder="Enter Your Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <button type="submit">Verify & Login</button>
        </form>
      )}
    </div>
  );
}
