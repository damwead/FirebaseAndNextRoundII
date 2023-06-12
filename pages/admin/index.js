import AuthCheck from "../../components/AuthCheck";

export default function AdminPostEdit(props) {
  return (
    <AuthCheck>
      <h3>Admin</h3>
    </AuthCheck>
  );
}