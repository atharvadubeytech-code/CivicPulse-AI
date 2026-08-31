const API_BASE_URL = "http://localhost:5000";

export async function submitComplaint(complaint) {
  const response = await fetch(`${API_BASE_URL}/api/complaints`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(complaint),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || data.message || "Failed to submit complaint"
    );
  }

  return data;
}

export async function testBackend() {
  const response = await fetch(`${API_BASE_URL}/`);

  if (!response.ok) {
    throw new Error("Backend is not responding");
  }

  return response.json();
}