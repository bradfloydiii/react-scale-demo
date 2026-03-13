import { sleep, message } from "../../../shared/utils/sleep.js";

export async function fetchUsers({ apiBaseUrl, signal }) {
  // Add a small delay so loading states are visible in interviews.
  await sleep(300);

  message(`fetching users...`);
  const res = await fetch(`${apiBaseUrl}/users`, { signal });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json();
}
