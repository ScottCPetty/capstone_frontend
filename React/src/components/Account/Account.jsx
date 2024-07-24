import { useEffect, useState } from "react";
import { useAccountQuery, useUpdateUserMutation } from "./AccountSlice";
import accountImage from "../../assets/dungeon6.jpg";

export default function Account({ loggedIn, setAdmin }) {
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const { data, isSuccess, refetch } = useAccountQuery();
  const [updateUser] = useUpdateUserMutation();

  useEffect(() => {
    const fetchData = async () => {
      if (loggedIn && isSuccess && data) {
        refetch();
        setUser(data);
        console.log(user);
        if (user && user.isAdmin === true) {
          setAdmin(true);
        }
      }
    };

    fetchData();
  }, [data, isSuccess, loggedIn, refetch, setAdmin, user]);

  const updateForm = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    // console.log(form);
  };

  const submit = async (e) => {
    e.preventDefault();
    let userId = user.id;

    if (form.password == "") {
      alert("Password Field Left Blank");
      return;
    } else if (form.username == "") {
      form.username = user.username;
    }
    console.log("This is the form:", form);

    try {
      let success = false;
      success = await updateUser({ form, userId }).unwrap();
      console.log("Success response:", success);
      setEdit(false);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="background-container">
      <div className="section">
        {loggedIn && isSuccess && user && (
          <div>
            <h1>{`Welcome, ${user.username}!`}</h1>
            <img
              className="account-image"
              src={accountImage}
              alt="accountImage"
            />
            <h5>The Souls of the Damned Wander, Like You</h5>
            <div className="account-info">
              <h3>{`Personal High Score: ${user.score}`}</h3>
            </div>
            {edit ? (
              <div>
                <form onSubmit={submit}>
                  <div className="row">
                    <div className="col">
                      <label className="form-label">Email</label>
                      <input
                        type="text"
                        className="form-control"
                        id="formGroupExampleInput"
                        placeholder={user.username}
                        name="username"
                        value={form.username}
                        onChange={updateForm}
                      />
                    </div>
                    <div className="col">
                      <label className="form-label">Password</label>
                      <input
                        type="text"
                        className="form-control"
                        id="formGroupExampleInput2"
                        placeholder="New Password"
                        name="password"
                        value={form.password}
                        onChange={updateForm}
                      />
                    </div>
                  </div>
                  <div className="user-buttons">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setEdit(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setEdit(true)}
              >
                Edit User
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
