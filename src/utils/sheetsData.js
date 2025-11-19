/**
 * Fetches data from Google Sheets and converts it to JSON format
 * @param {string} spreadsheetId - The Google Sheets spreadsheet ID
 * @returns {Promise<Object>} - JSON object mapping headers to arrays of values
 */
export async function fetchSheetsData(spreadsheetId) {
  try {
    // Use CSV export format (public access)
    const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv`;
    
    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    
    const csvText = await response.text();
    return parseCsvToJson(csvText);
  } catch (error) {
    console.error('Error fetching sheets data:', error);
    throw error;
  }
}

/**
 * Parses CSV text and converts it to JSON format
 * First row is treated as headers, subsequent rows as values
 * @param {string} csvText - CSV formatted text
 * @returns {Object} - JSON object mapping headers to arrays of values
 */
function parseCsvToJson(csvText) {
  const lines = csvText.split('\n').filter(line => line.trim() !== '');
  
  if (lines.length === 0) {
    return {};
  }
  
  // Parse CSV line (handles quoted values with commas)
  const parseCsvLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };
  
  // First row is headers
  const headers = parseCsvLine(lines[0]);
  const result = {};
  
  // Initialize result object with empty arrays for each header
  headers.forEach(header => {
    if (header && header.trim() !== '') {
      result[header.trim()] = [];
    }
  });
  
  // Process data rows
  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    
    headers.forEach((header, index) => {
      if (header && header.trim() !== '') {
        const value = values[index] ? values[index].trim() : '';
        // Only add non-empty values
        if (value !== '') {
          result[header.trim()].push(value);
        }
      }
    });
  }
  
  return result;
}

