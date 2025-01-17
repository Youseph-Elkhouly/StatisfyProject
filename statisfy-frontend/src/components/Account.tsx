import React, { useEffect, useState } from "react";

interface User {
  id: string;
  full_name: string;
  email: string;
  address: string;
  graduation_date: string;
  is_canadian_citizen: boolean;
  school: string;
  major: string;
  minor: string;
  gpa: string;
}

const Account: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = localStorage.getItem("email");
        if (!email) {
          throw new Error("No email found in local storage. Please log in.");
        }

        const response = await fetch(`http://localhost:3004/user/${email}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data. Please try again later.");
        }

        const data: User = await response.json();
        setUser(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }

  if (!user) {
    return <div>No user data available.</div>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto", textAlign: "left" }}>
      <h1>Account Page</h1>
      <p><strong>Full Name:</strong> {user.full_name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Address:</strong> {user.address}</p>
      <p><strong>Graduation Date:</strong> {user.graduation_date}</p>
      <p><strong>School:</strong> {user.school}</p>
      <p><strong>Major:</strong> {user.major}</p>
      <p><strong>Minor:</strong> {user.minor}</p>
      <p><strong>GPA:</strong> {user.gpa}</p>
    </div>
  );
};

export default Account;
