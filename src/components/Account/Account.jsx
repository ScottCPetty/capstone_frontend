import { useEffect, useState } from "react";
import { useAccountQuery, useUpdateUserMutation } from "./AccountSlice";
import accountImage from "../../../public/assets/dungeon6.jpg";
// import defaultPortrait from "../../../public/assets/dungeon3.jpg";

export default function Account({ loggedIn }) {
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
    // portrait: defaultPortrait,
  });
  const { data, isSuccess } = useAccountQuery();
  const [updateUser, { isLoading, isSuccess: isUpdateSuccess, isError }] =
    useUpdateUserMutation();
  // const [selectedPortrait, setSelectedPortrait] = useState(defaultPortrait);

  // const pPath = "/assets/player-portraits/";
  // const portraits = [
  //   "barbarian.jpg",
  //   "bard.jpg",
  //   "cleric1.jpg",
  //   "cleric2.jpg",
  //   "druid.jpg",
  //   "fighter.jpg",
  //   "gamer1.jpg",
  //   "gnomeArtificer1.jpg",
  //   "gnomeArtificer2.jpg",
  //   "gypsy.jpg",
  //   "highPriestess.jpg",
  //   "Jester.jpg",
  //   "knight.jpg",
  //   "knight1.jpg",
  //   "knight2.jpg",
  //   "knightFemale.jpg",
  //   "leprechaun.jpg",
  //   "merchant.jpg",
  //   "monk.jpg",
  //   "monk2.jpg",
  //   "rogue.jpg",
  //   "rogue3.jpg",
  //   "sellSword.jpg",
  //   "sorceress2.jpg",
  //   "spellBlade.jpg",
  //   "swashbuckler.jpg",
  //   "thief1.jpg",
  //   "warriorPrince.jpg",
  //   "warriorPrincess.jpg",
  //   "warriorPrincess2.jpg",
  //   "werewolf.jpg",
  //   "witch1.jpg",
  //   "witch2.jpg",
  // ];

  useEffect(() => {
    if (loggedIn && isSuccess && data) {
      // console.log("User data fetched:", data);
      setUser(data);
      // setSelectedPortrait(data.portrait || defaultPortrait);
      setForm({
        username: data.username || "",
        password: "",
        // portrait: data.portrait || defaultPortrait,
      });
    }
  }, [data, isSuccess, loggedIn]);

  useEffect(() => {
    if (isUpdateSuccess) {
      // console.log("Update successful:", form);
      setEdit(false);
      // localStorage.setItem("userPortrait", form.portrait);
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
  //   const fullPortraitPath = `${pPath}${portrait}`;
  //   setSelectedPortrait(fullPortraitPath);
  //   setForm((prev) => ({
  //     ...prev,
  //     portrait: fullPortraitPath,
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

    // console.log("Form to submit:", form);

    try {
      const result = await updateUser({
        userId,
        username: form.username,
        password: form.password,
        // portrait: form.portrait,
      }).unwrap();
      // console.log("Update result:", result);
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
            <h3>{`Personal High Score: ${user.score}`}</h3>
            {/* <div className="current-portrait">
              <h3>Current Adventurer</h3>
              <img
                className="portrait"
                src={selectedPortrait}
                alt="Selected Portrait"
              />
            </div> */}
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
                  {/* <div className="portrait-selection">
                    <h3>Select Your Portrait</h3>
                    <div className="portraits">
                      {portraits.map((portrait) => (
                        <img
                          key={portrait}
                          src={`${pPath}${portrait}`}
                          alt="Portrait"
                          className={`portrait ${
                            selectedPortrait === `${pPath}${portrait}`
                              ? "selected"
                              : ""
                          }`}
                          onClick={() => handlePortraitChange(portrait)}
                        />
                      ))}
                    </div>
                    <input
                      type="hidden"
                      name="portrait"
                      value={form.portrait}
                    />
                  </div> */}
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
            <div>
              <img
                className="account-image"
                src={accountImage}
                alt="accountImage"
              />
              <h5>The Souls of the Damned Wander, Like You</h5>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
