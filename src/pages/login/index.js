import { useState, useEffect } from "react";
import styles from "../../styles/UserLogin.module.css";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

export default function Login() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [name, setName] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [timer, setTimer] = useState(60);
  const [error, setError] = useState("");

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      const user = JSON.parse(userCookie);
      router.push("/home");
    }

    let countdown;
    if (step === 2 && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    if (timer === 0) {
      router.push("/");
    }

    return () => clearInterval(countdown);
  }, [step, timer, router]);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleOtpChange = (index, value) => {
    if (value === '' || /^[0-9]$/.test(value)) {
      const newOtpDigits = [...otpDigits];
      newOtpDigits[index] = value;
      setOtpDigits(newOtpDigits);
      setOtp(newOtpDigits.join(''));
      
      if (value && index < 5) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (data.success) {
      setIsNewUser(data.newUser);
      setStep(2);
      setTimer(60);
      setOtpDigits(['', '', '', '', '', '']); // Reset OTP boxes
    } else {
      alert(data.message);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, name }),
    });

    const data = await res.json();

    if (data.success) {
      Cookies.set("user", JSON.stringify({
        id: data.user._id, 
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
      }), { expires: 7 });

      if (data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/home");
      }
    } else {
      setError("Invalid OTP!");
      Cookies.remove("user");
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
          <p>OTP expires in: <strong>{formatTime(timer)}</strong></p>
          
          <div className={styles.otpContainer}>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                maxLength={1}
                value={otpDigits[index]}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className={styles.otpInput}
                autoFocus={index === 0}
              />
            ))}
          </div>

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
          {error && <p className={styles.errorMessage}>{error}</p>}
          <button type="submit">Verify & Login</button>
        </form>
      )}
    </div>
  );
}