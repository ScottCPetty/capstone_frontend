import { useFetchUsersQuery, useDeleteUserMutation } from "./AdminSlice";

const Admin = (isAdmin) => {
  const { data: users, refetch } = useFetchUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users &&
                  users
                    .filter((user) => user.username !== "admin")
                    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) // Sort users by createdAt date
                    .map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.score}</td>
                        <td>{user.createdAt}</td>
                        <td>{user.updatedAt}</td>

                        <td>
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
