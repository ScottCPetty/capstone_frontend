import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "./LoginSlice";

export default function Login({ setLoggedIn }) {
  const [loginUser] = useLoginMutation();

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
    console.log("This is the form:", form);
    try {
      let success = false;
      success = await loginUser(form).unwrap();
      console.log("Success response:", success);
      if (success) {
        setLoggedIn(true);
        navigate("/account");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toRegistrationRedirect = () => {
    navigate("/registration");
  };

  return (
    <div className="background-container">
      <div className="section">
        <h2 className="form-header">Login</h2>
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
              Login
            </button>
          </div>
        </form>
        <div className="redirect-container">
          <h3>Not Signed In?</h3>
          <button
            type="button"
            className="btn btn-primary"
            onClick={toRegistrationRedirect}
          >
            Click Here to Register!
          </button>
        </div>
      </div>
    </div>
  );
}
