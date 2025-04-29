import { useState, useEffect } from "react";
import styles from "../../styles/UserLogin.module.css";
import { useRouter } from "next/router";
import Cookies from "js-cookie"; // To read cookies

export default function Login() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    // Check if the user is already logged in
    const userCookie = Cookies.get("user"); // Check if there's a user cookie
    if (userCookie) {
      const user = JSON.parse(userCookie);
      // Redirect based on role
      if (user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/home");
      }
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
      setTimer(300); // reset timer to 5 minutes
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
      // Store session info in cookies
      Cookies.set("user", JSON.stringify({
        id: data.user._id, 
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
      }), { expires: 7 }); // Cookie expires in 7 days
  
      // Redirect based on role
      if (data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        console.log("Cookie name: ", Cookies.name)
        router.push("/home");
      }
    } else {
        // Clear cookie just in case
        Cookies.remove("user");
        //alert(data.message || "User not found or login failed.");
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
