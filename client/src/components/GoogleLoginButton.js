import { FcGoogle } from "react-icons/fc";

function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    window.location.href =
      "https://react-reaction-time-test.onrender.com/auth/google"; // cambia porta se necessario
  };

  return (
    <button className="g-login" onClick={handleGoogleLogin}>
      <FcGoogle className="g-login-icon" />
      <span className="g-login-text">Login with Google</span>
    </button>
  );
}

export default GoogleLoginButton;
