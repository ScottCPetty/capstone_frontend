import { useFetchUsersQuery, useDeleteUserMutation } from "./AdminSlice";

const Admin = (isAdmin) => {
  const { data: users, error, isLoading } = useFetchUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

  const handleDelete = (userId) => {
    deleteUser(userId);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading users</div>;

  return (
    isAdmin && (
      <div className="background-container">
        <div className="section">
          <div className="table-container">
            <h1>Admin Panel</h1>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>High Score</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th>isAdmin</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users &&
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.username}</td>
                      <td>{user.score}</td>
                      <td>{user.createdAt}</td>
                      <td>{user.updatedAt}</td>
                      <td>{user.isAdmin ? "true" : "false"}</td>

                      <td>
                        <button type="button" className="btn btn-primary">
                          Edit
                        </button>
                        {user.isAdmin == false && (
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => handleDelete(user.id)}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  );
};

export default Admin;
