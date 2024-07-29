import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "./RegisterSlice";

export default function Register({ setLoggedIn }) {
  const [registerUser] = useRegisterMutation();
  const [registerError, setRegisterError] = useState(false);

  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const updateForm = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    // console.log("This is the form:", form);
    setRegisterError(false);
    try {
      let success = false;
      success = await registerUser(form).unwrap();
      if (success) {
        setLoggedIn(true);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      setRegisterError(true);
    }
  };

  const toLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="background-container">
      <div className="section">
        <h2 className="form-header">Register</h2>
        <form onSubmit={submit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter username"
              name="username"
              value={form.username}
              onChange={updateForm}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              name="password"
              value={form.password}
              onChange={updateForm}
            />
          </div>
          <div className="form-button">
            <button type="submit" className="btn btn-primary">
              Register
            </button>
          </div>
        </form>
        {registerError && (
          <h1 style={{ color: "red", marginTop: "10px" }}>
            Username is already taken.
          </h1>
        )}
        <div className="redirect-container">
          <h3>Already Have an Account?</h3>
          <button
            type="button"
            className="btn btn-primary"
            onClick={toLoginRedirect}
          >
            Click Here to Sign In!
          </button>
        </div>
      </div>
    </div>
  );
}
