import { useEffect, useState } from "react";
import { useAccountQuery, useUpdateUserMutation } from "./AccountSlice";
// import accountImage from "../../../public/assets/dungeon6.jpg";
// import defaultPortrait from "../../../public/assets/dungeon3.jpg";

export default function Account({ loggedIn }) {
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
    portrait: "",
  });
  const { data, isSuccess } = useAccountQuery();
  const [updateUser, { isLoading, isSuccess: isUpdateSuccess, isError }] =
    useUpdateUserMutation();
  const [selectedPortrait, setSelectedPortrait] = useState("");

  const portraits = [
    "/assets/player-portraits/barbarian.jpg",
    "/assets/player-portraits/bard.jpg",
    "/assets/player-portraits/cleric1.jpg",
    "/assets/player-portraits/cleric2.jpg",
    "/assets/player-portraits/druid.jpg",
    "/assets/player-portraits/fighter.jpg",
    "/assets/player-portraits/gamer1.jpg",
    "/assets/player-portraits/gnomeArtificer1.jpg",
    "/assets/player-portraits/gnomeArtificer2.jpg",
    "/assets/player-portraits/gypsy.jpg",
    "/assets/player-portraits/highPriestess.jpg",
    "/assets/player-portraits/Jester.jpg",
    "/assets/player-portraits/knight.jpg",
    "/assets/player-portraits/knight1.jpg",
    "/assets/player-portraits/knight2.jpg",
    "/assets/player-portraits/knightFemale.jpg",
    "/assets/player-portraits/leprechaun.jpg",
    "/assets/player-portraits/merchant.jpg",
    "/assets/player-portraits/monk.jpg",
    "/assets/player-portraits/monk2.jpg",
    "/assets/player-portraits/rogue.jpg",
    "/assets/player-portraits/rogue3.jpg",
    "/assets/player-portraits/sellSword.jpg",
    "/assets/player-portraits/sorceress2.jpg",
    "/assets/player-portraits/spellBlade.jpg",
    "/assets/player-portraits/swashbuckler.jpg",
    "/assets/player-portraits/thief1.jpg",
    "/assets/player-portraits/warriorPrince.jpg",
    "/assets/player-portraits/warriorPrincess.jpg",
    "/assets/player-portraits/warriorPrincess2.jpg",
    "/assets/player-portraits/werewolf.jpg",
    "/assets/player-portraits/witch1.jpg",
    "/assets/player-portraits/witch2.jpg",
  ];

  useEffect(() => {
    if (loggedIn && isSuccess && data) {
      console.log("User data fetched:", data);
      setUser(data);
      setSelectedPortrait(
        data.portrait || "/assets/player-portraits/gamer1.jpg"
      );
      setForm({
        username: data.username || "",
        password: "",
        portrait: data.portrait || "/assets/player-portraits/gamer1.jpg",
      });
    }
  }, [data, isSuccess, loggedIn]);

  useEffect(() => {
    if (isUpdateSuccess) {
      console.log("Update successful:", form);
      setEdit(false);
      localStorage.setItem("userPortrait", form.portrait);
    } else if (isError) {
      console.error("Error updating user");
    }
  }, [isUpdateSuccess, isError, form]);

  const updateForm = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // const handlePortraitChange = (portrait) => {
  //   setSelectedPortrait(portrait);
  //   setForm((prev) => ({
  //     ...prev,
  //     portrait: portrait,
  //   }));
  // };

  const submit = async (e) => {
    e.preventDefault();
    let userId = user.id;

    if (form.password === "") {
      alert("Password Field Left Blank");
      return;
    } else if (form.username === "") {
      form.username = user.username;
    }

    console.log("Form to submit:", form);

    try {
      const result = await updateUser({
        userId,
        username: form.username,
        password: form.password,
        portrait: form.portrait,
      }).unwrap();
      console.log("Update result:", result);
    } catch (error) {
      console.log("Error updating user:", error);
    }
  };

  return (
    <div className="background-container">
      <div className="section">
        {user && (
          <div>
            <h1>{`Welcome, ${user.username}!`}</h1>
            {/* <img
              className="account-image"
              src={accountImage}
              alt="accountImage"
            />
            <h5>The Souls of the Damned Wander, Like You</h5> */}
            <div className="account-info">
              <h3>{`Personal High Score: ${user.score}`}</h3>
            </div>
            <div className="current-portrait">
              <h3>Current Adventurer</h3>
              <img
                className="portrait"
                src={selectedPortrait}
                alt="Selected Portrait"
              />
            </div>
            {edit ? (
              <div>
                <form onSubmit={submit}>
                  <div className="row">
                    <div className="col">
                      <label className="form-label">Username</label>
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
                  <div className="portrait-selection">
                    <h3>Select Your Portrait</h3>
                    <div className="portraits">
                      {portraits.map((portrait) => (
                        <img
                          key={portrait}
                          src={portrait}
                          alt="Portrait"
                          className={`portrait ${
                            selectedPortrait === portrait
                              ? "selected"
                              : "/assets/gamer1.jpg"
                          }`}
                          onClick={() => {
                            setSelectedPortrait(portrait);
                            setForm((prev) => ({
                              ...prev,
                              portrait: portrait,
                            }));
                          }}
                        />
                      ))}
                    </div>
                    <input
                      type="hidden"
                      name="portrait"
                      value={form.portrait}
                    />
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
                      {isLoading ? "Saving..." : "Save"}
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
                Edit My Account
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
