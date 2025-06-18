// For development
export const BASE_URL = 'http://localhost:4000';

// For production (replace with your actual production URL)
// export const BASE_URL = 'http://your-production-url.com';

// Helper function to handle API errors
export const handleApiError = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};
