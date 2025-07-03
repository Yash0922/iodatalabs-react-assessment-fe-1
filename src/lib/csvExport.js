/**
 * CSV Export Utility
 * 
 * This utility provides functions to convert data to CSV format and trigger
 * file downloads in the browser. It's designed to work with the reports data
 * structure and handle proper CSV formatting with headers.
 */

/**
 * Escapes special characters in CSV data
 * @param {string} value - The value to escape
 * @returns {string} - Escaped CSV value
 */
const escapeCSVValue = (value) => {
  if (value == null) return '';
  
  const stringValue = String(value);
  
  // If the value contains commas, quotes, or newlines, wrap it in quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    // Escape any existing quotes by doubling them
    const escapedValue = stringValue.replace(/"/g, '""');
    return `"${escapedValue}"`;
  }
  
  return stringValue;
};

/**
 * Converts an array of objects to CSV format
 * 
 * @param {Array} data - Array of objects to convert to CSV
 * @param {Array} headers - Array of column headers (optional)
 * @returns {string} - CSV formatted string
 */
export const convertToCSV = (data, headers = null) => {
  console.log('convertToCSV: Converting data to CSV format', { data, headers });
  
  // Return empty string if no data
  if (!data || data.length === 0) {
    return '';
  }
  
  // Extract headers from first object if not provided
  const csvHeaders = headers || Object.keys(data[0]);
  
  // Create CSV header row
  const headerRow = csvHeaders.map(header => escapeCSVValue(header)).join(',');
  
  // Convert each data row to CSV format
  const dataRows = data.map(row => {
    return csvHeaders.map(header => {
      const value = row[header];
      
      // Handle date formatting
      if (value instanceof Date) {
        return escapeCSVValue(value.toISOString().split('T')[0]);
      }
      
      // Handle date strings
      if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
        return escapeCSVValue(new Date(value).toLocaleDateString());
      }
      
      return escapeCSVValue(value);
    }).join(',');
  });
  
  // Combine header and data rows
  const csvContent = [headerRow, ...dataRows].join('\n');
  
  return csvContent;
};

/**
 * Triggers a file download in the browser
 * 
 * @param {string} content - The file content to download
 * @param {string} filename - The filename for the download
 * @param {string} mimeType - The MIME type of the file (default: 'text/csv')
 */
export const downloadFile = (content, filename, mimeType = 'text/csv') => {
  console.log('downloadFile: Triggering download', { filename, mimeType });
  
  try {
    // Create a Blob with the content
    const blob = new Blob([content], { type: mimeType });
    
    // Create a temporary URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the temporary URL
    URL.revokeObjectURL(url);
    
    console.log('File download completed successfully');
  } catch (error) {
    console.error('Download failed:', error);
    throw new Error('Failed to download file');
  }
};

/**
 * Exports data as CSV file with proper filename
 * 
 * @param {Array} data - Array of objects to export
 * @param {string} baseFilename - Base filename (without extension)
 * @param {Array} headers - Optional custom headers
 */
export const exportAsCSV = (data, baseFilename = 'export', headers = null) => {
  console.log('exportAsCSV: Starting CSV export', { baseFilename, dataLength: data?.length });
  
  try {
    // Validate data
    if (!data || data.length === 0) {
      throw new Error('No data to export');
    }
    
    // Convert data to CSV format
    const csvContent = convertToCSV(data, headers);
    
    if (!csvContent) {
      throw new Error('Failed to convert data to CSV format');
    }
    
    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const filename = `${baseFilename}-${date}.csv`;
    
    // Trigger file download
    downloadFile(csvContent, filename);
    
    console.log(`CSV export complete: ${filename}`);
    return { success: true, filename };
    
  } catch (error) {
    console.error('CSV export failed:', error);
    throw new Error(`CSV export failed: ${error.message}`);
  }
};

/**
 * Formats report data for CSV export
 * Maps internal data structure to user-friendly column names
 * 
 * @param {Array} reports - Array of report objects
 * @returns {Array} - Formatted data ready for CSV export
 */
export const formatReportsForCSV = (reports) => {
  console.log('formatReportsForCSV: Formatting reports data', { count: reports?.length });
  
  if (!reports || reports.length === 0) {
    return [];
  }
  
  // Map internal field names to user-friendly column names and format data
  return reports.map(report => ({
    'ID': report.id,
    'Title': report.title,
    'Status': report.status,
    'Department': report.department,
    'Priority': report.priority,
    'Author': report.author,
    'Created Date': report.createdAt ? new Date(report.createdAt).toLocaleDateString() : '',
    'Updated Date': report.updatedAt ? new Date(report.updatedAt).toLocaleDateString() : '',
    'Record Count': report.recordCount || '',
    'File Size': report.fileSize || '',
    'Execution Time': report.executionTime || ''
  }));
};

/**
 * Custom headers for reports CSV export
 * Defines the column order and names for the CSV file
 */
export const REPORTS_CSV_HEADERS = [
  'ID',
  'Title',
  'Status',
  'Department',
  'Priority',
  'Author',
  'Created Date',
  'Updated Date',
  'Record Count',
  'File Size',
  'Execution Time'
];

export default {
  convertToCSV,
  downloadFile,
  exportAsCSV,
  formatReportsForCSV,
  REPORTS_CSV_HEADERS
};