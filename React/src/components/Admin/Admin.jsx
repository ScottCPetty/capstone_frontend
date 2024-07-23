import { useFetchUsersQuery, useDeleteUserMutation } from "./AdminSlice";

const Admin = () => {
  const { data: users, error, isLoading } = useFetchUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

  const handleDelete = (userId) => {
    deleteUser(userId);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading users</div>;

  return (
    <div>
      <h1>Admin Panel</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users &&
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
//
