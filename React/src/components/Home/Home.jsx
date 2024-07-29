import { useFetchUsersQuery } from "./HomeSlice";

export default function Home() {
  const { data: users } = useFetchUsersQuery();
  const sortedUsers = users
    ? [...users].sort((a, b) => b.score - a.score).slice(0, 10)
    : [];

  return (
    <div className="background-container">
      <div className="section">
        <h1>Welcome to the Dungeon Delve</h1>
        <h4>
          A wretched entity burrows its tendrils of gold deep into the earth,
          ensnaring unwitting adventurers in its grasp. They call it the
          Flytrap. Many heedless seekers ignore the warnings, drawn inexorably
          deeper into its clutches, never to return. Those fortunate few who
          escape speak of a realm of madness—a labyrinth of twisting, cracked
          walls and impossible rooms. Here, the animated corpses of the lost
          wander endlessly, puppeteered by the malevolent roots that twist and
          warp the horrid place...
        </h4>
      </div>
      <div className="section" id="scoreboard">
        <h1>Scoreboard</h1>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {users &&
              sortedUsers
                .filter((user) => user.isAdmin == false)
                .map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.score}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
