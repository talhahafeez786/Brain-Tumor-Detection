const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const predictImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_URL}/api/v1/predict/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Prediction error:', error);
    throw error;
  }
};

export const fetchPredictions = async () => {
  try {
    const response = await fetch(`${API_URL}/api/v1/predictions/`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch predictions error:', error);
    throw error;
  }
};

export const fetchStatistics = async () => {
  try {
    const response = await fetch(`${API_URL}/api/v1/statistics/`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch statistics error:', error);
    throw error;
  }
};