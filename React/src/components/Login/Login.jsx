import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useLoginMutation } from "./LoginSlice";

export default function Login({ setLoggedIn }) {
  // const [loginUser] = useLoginMutation();

  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
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
        sessionStorage.setItem("CurrentUser", form.email);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toRegistrationRedirect = () => {
    navigate("/registration");
  };

  return (
    <div className="form-container">
      <h2 className="form-header">Login</h2>
      <form onSubmit={submit}>
        <div className="form-group">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            name="email"
            value={form.email}
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
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
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
  );
}
