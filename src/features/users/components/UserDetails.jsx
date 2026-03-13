export function UserDetails({ user }) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div>
        <strong>Name:</strong> {user.name}
      </div>
      <div>
        <strong>Email:</strong> {user.email}
      </div>
      <div>
        <strong>Company:</strong> {user.company?.name}
      </div>
      <div>
        <strong>Website:</strong> {user.website}
      </div>
      <div>
        <strong>City:</strong> {user.address?.city}
      </div>
    </div>
  );
}
