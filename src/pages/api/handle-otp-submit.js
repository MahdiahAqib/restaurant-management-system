import { useRouter } from "next/router";
import Cookies from "js-cookie";

const handleOtpSubmit = async (e) => {
    e.preventDefault();
    
    // Assuming you are sending OTP and getting a response from the API
    const data = await sendOtpVerification();
    console.log(data); // Log the response data to check its structure
    
    if (data && data.user) {
      Cookies.set("user", JSON.stringify({
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
      }), { expires: 7 });
    } else {
      console.error('User data is undefined');
    }
  };
  
