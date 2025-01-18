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

interface Email {
  id: string;
  subject: string;
  snippet: string;
}

const Account: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [emailLoading, setEmailLoading] = useState<boolean>(false);

  // Fetch user data
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

  // Gmail authentication handler
  const handleAuth = () => {
    window.location.href = "http://localhost:3004/auth";
  };

  // Fetch emails
  const fetchEmails = async () => {
    setEmailLoading(true);
    try {
      const response = await fetch("http://localhost:3004/fetch-emails", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch emails. Please authenticate first.");
      }

      const data: Email[] = await response.json();
      setEmails(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unexpected error occurred while fetching emails.");
      }
    } finally {
      setEmailLoading(false);
    }
  };

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

      {/* Gmail API Features */}
      <div style={{ marginTop: "20px" }}>
        <h2>Gmail Integration</h2>
        <button onClick={handleAuth} style={{ marginRight: "10px" }}>
          Authenticate with Gmail
        </button>
        <button onClick={fetchEmails} disabled={emailLoading}>
          {emailLoading ? "Fetching Emails..." : "Fetch Emails"}
        </button>
      </div>

      {/* Display Emails */}
      {emails.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Fetched Emails</h3>
          <ul>
            {emails.map((email) => (
              <li key={email.id}>
                <strong>Subject:</strong> {email.subject || "No Subject"}
                <br />
                <strong>Snippet:</strong> {email.snippet}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Account;
