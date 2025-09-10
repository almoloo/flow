/**
 * Utility for making authenticated API calls
 */

export interface AuthenticatedFetchOptions extends RequestInit {
  authToken?: string;
}

/**
 * Wrapper around fetch that adds authentication headers
 * @param url - API endpoint URL
 * @param options - Fetch options including authToken
 * @returns Promise<Response>
 */
export async function authenticatedFetch(url: string, options: AuthenticatedFetchOptions = {}): Promise<Response> {
  const { authToken, ...fetchOptions } = options;

  // Get auth token from localStorage if not provided
  const token = authToken || localStorage.getItem("auth_token");

  if (!token) {
    throw new Error("No authentication token available. Please authenticate first.");
  }

  // Add authorization header
  const headers = {
    "Content-Type": "application/json",
    ...fetchOptions.headers,
    Authorization: `Bearer ${token}`,
  };

  return fetch(url, {
    ...fetchOptions,
    headers,
  });
}

/**
 * Helper function for authenticated GET requests
 */
export async function authenticatedGet(url: string, authToken?: string): Promise<Response> {
  return authenticatedFetch(url, { method: "GET", authToken });
}

/**
 * Helper function for authenticated POST requests
 */
export async function authenticatedPost(url: string, data: any, authToken?: string): Promise<Response> {
  return authenticatedFetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    authToken,
  });
}

/**
 * Helper function for authenticated PUT requests
 */
export async function authenticatedPut(url: string, data: any, authToken?: string): Promise<Response> {
  return authenticatedFetch(url, {
    method: "PUT",
    body: JSON.stringify(data),
    authToken,
  });
}

/**
 * Helper function for authenticated DELETE requests
 */
export async function authenticatedDelete(url: string, authToken?: string): Promise<Response> {
  return authenticatedFetch(url, { method: "DELETE", authToken });
}
