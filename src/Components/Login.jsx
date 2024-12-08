import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contaxt/AuthContaxt";
import Cookies from "js-cookie";

// Getting a cookie

function AuthForm() {
  const navigate = useNavigate();
  const { login ,URL} = useAuth();
  const [activeTab, setActiveTab] = useState("login");
  const [step, setStep] = useState("details");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signUpData, setSignUpData] = useState({
    email: "",
    username: "",
    password: "",
  });
  // const [otpVerified , setOtpVerified] = useState(false)
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(""); // State for error messages
  const [success, setSuccess] = useState(false);

  const handleLoginSubmit = async () => {
    setError(""); // Clear previous errors
    try {
      const response = await fetch(`${URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
        credentials: "include",
      });
      const result = await response.json();

      if (response.ok) {
        login(loginData);
        navigate("/");
      } else {
        setError(result.message || "Failed to log in.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while logging in.");
    }
  };

  const handleSignUpSubmit = async () => {
    setError(""); // Clear previous errors
    setLoading(true);
    try {
      const response = await fetch(
        `${URL}/v1/users/register/temp-user`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(signUpData),
          credentials: "include", // Uncomment if you need cookies for sign-up
        }
      );
      const result = await response.json();

      if (response.ok) {
        alert("OTP sent to your email.");
        setStep("otp");
      } else {
        setError(result.message || "Failed to send OTP.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred during sign-up.");
    } finally {
      setLoading(false); // Hide the loading indicator
    }
  };

  const handleOtpSubmit = async () => {
    setLoading(true);
    setSuccess(false); // Reset success state on new request
    setError(null); // Clear any previous error messages
    try {
      const response = await fetch(
        `${URL}/users/register/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({ otp }),
          credentials: "include",
        }
      );
      const result = await response.json();

      if (response.ok) {
        setLoading(false);
        setSuccess(true); // Set success to true on successful verification
        setSignUpData("");
        setStep("details")
        // alert('Registration successful!');
        // Proceed to the next step or handle accordingly
      } else {
        setLoading(false); // Stop loading if there's an error
        setError(result.message || "Invalid OTP.");
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false); // Stop loading on error
      setError("An error occurred during OTP verification.");
    }
  };
 
  
  return (
    <Wrapper>
      <div className="auth-form-container">
        <div className="auth-tabs">
          <button
            onClick={() => {
              setActiveTab("login");
              setStep("details");
            }}
            className={activeTab === "login" ? "active" : ""}
          >
            Login
          </button>
          <button
            onClick={() => {
              setActiveTab("signup");
              setStep("details");
            }}
            className={activeTab === "signup" ? "active" : ""}
          >
            Sign Up
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
        {/* Display error message */}
        {activeTab === "login" && (
          <div className="auth-form">
            {/* <h2>Login</h2> */}
            <input
              type="email"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
            />
            <button className="form-btn" onClick={handleLoginSubmit}>
              Login
            </button>
          </div>
        )}
        {activeTab === "signup" && (
          <div className="auth-form">
            {step === "details" && (
              <>
                {/* <h2>Sign Up</h2> */}
                <input
                  type="email"
                  placeholder="Email"
                  value={signUpData.email}
                  onChange={(e) =>
                    setSignUpData({ ...signUpData, email: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Username"
                  value={signUpData.username}
                  onChange={(e) =>
                    setSignUpData({ ...signUpData, username: e.target.value })
                  }
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={signUpData.password}
                  onChange={(e) =>
                    setSignUpData({ ...signUpData, password: e.target.value })
                  }
                />
                {loading ? (
                  <>
                    <p style={{ color: "#007bff" }}>Loading ...</p>
                  </>
                ) : (
                  <>
                    {/* <p>OTP sent to your email</p> */}
                    <p></p>
                  </>
                )}
                <button className="form-btn" onClick={handleSignUpSubmit}>
                  Submit
                </button>
              </>
            )}

            {step === "otp" && (
              <>
                <h2>Enter OTP</h2>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                  {/* <p>Request New OTP...</p> */}
                {loading && <p style={{ color: "#007bff" }}>Verifying...</p>} {/* Show loading text */}
                {success && <p style={{ color: "green" }}>Registration Success</p>}{" "}
                {/* Show success text */}
                {/* {error && <p style={{ color: "red" }}>{error}</p>}{" "} */}
                {/* Show error text */}
                <button className="form-btn" onClick={handleOtpSubmit}>
                  Verify OTP
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  /* Container for the entire form */

  .auth-form-container {
    width: 400px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: inset 0 4px 6px rgba(0, 0, 0, 0.4);
    background: #fff;
    // background:#c2dcff;
    font-family: Arial, sans-serif;
  }

  /* Tabs for switching between login and sign up */
  .auth-tabs {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .auth-tabs button {
    flex: 1;
    padding: 10px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    border: none;
    border-bottom: 2px solid transparent;
    background: #f9f9f9;
    transition: all 0.3s ease;
    border-radius: 4px;
  }

  .auth-tabs .active {
    border-bottom: 2px solid #007bff;
    // background: #fff;
    background:#cce4fc;
  }

  /* Input fields styling */
  .auth-form input {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ddd;
    // border:none;
    // outline:none;
    border-radius: 4px;
    // box-shadow:inset 0 4px 6px rgba(0, 0, 0, 0.2);
  }
  .auth-form p {
    text-align: center;
    font-size: 1rem;
  }
  /* Button styling */
  .form-btn {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .form-btn:hover {
    background-color: #0056b3;
  }

  /* Error message styling */
  .error-message {
    color: red;
    margin-bottom: 10px;
    font-size: 14px;
  }

  @media (max-width: 768px) {
    .auth-form-container {
      width: 350px;
      padding: 1rem 2rem;
    }
  }
`;

export default AuthForm;
