# React Developer Take-Home Assessment

## 📋 Overview

Welcome to the React Developer Assessment! You've been provided with a **working Report Management System** built with React, TanStack Table, and Tailwind CSS. Your task is to enhance this application with missing features that would make it production-ready.

**Difficulty:** Intermediate  
**Focus Areas:** React hooks, state management, real-time search, data export, and debouncing

## 🎯 Current Application State

The application already includes:
- ✅ Functional filter form with search, status, department, priority, and date filters
- ✅ Data table with sorting and pagination using TanStack Table
- ✅ Mock API with realistic data, filtering, and pagination
- ✅ Tailwind CSS styling and responsive design
- ✅ Basic error handling and loading states

## 🚀 Your Tasks

### **Task 1: Real-time Search with Debouncing (Required) - 45 minutes**

**Current State:** Search only works when the form is submitted.  
**Objective:** Convert to real-time search with proper debouncing.

**Requirements:**
1. Search should trigger automatically as the user types
2. Implement debouncing to avoid excessive API calls (300ms delay)
3. Show a subtle loading indicator when searching
4. Do not search when input is empty
5. Preserve other filters while searching

**Acceptance Criteria:**
- [ ] Search results update automatically without clicking "Apply Filters"
- [ ] API calls are debounced by 300ms to prevent excessive requests
- [ ] Search works in combination with other filters
- [ ] Loading indicator appears during search
- [ ] No API calls are made for empty search strings

**Files to modify:**
- `src/components/FiltersForm.jsx`
- `src/hooks/useReportsData.js`
- Create new hook: `src/hooks/useDebounce.js`

---

### **Task 2: CSV Export Functionality (Bonus) - 45 minutes**

**Current State:** No export functionality exists.  
**Objective:** Add CSV export for filtered and sorted data.

**Requirements:**
1. Add "Export CSV" button to the FiltersForm component
2. Export should include all currently filtered and sorted data
3. CSV should have proper headers matching table columns
4. Show loading state during export generation
5. Handle export errors gracefully
6. File should download with a descriptive name

**Acceptance Criteria:**
- [ ] Export button is visible and accessible in the filters section
- [ ] CSV export respects current filters and sorting
- [ ] CSV includes proper column headers (Title, Status, Department, etc.)
- [ ] Loading indicator shows during export generation
- [ ] Success feedback after successful export
- [ ] Error handling with user-friendly messages
- [ ] Downloaded file has meaningful name (e.g., "reports-2025-07-02.csv")

**Files to modify:**
- `src/components/FiltersForm.jsx`
- `src/services/reportsAPI.js` (add export endpoint)
- Create new utility: `src/utils/csvExport.js`

---

## 📁 Project Structure

```
src/
├── components/
│   ├── DataTable.jsx           # Main table component (TanStack Table)
│   └── FiltersForm.jsx         # Filter form component
├── hooks/
│   ├── useReportsData.js       # Data fetching and state management
│   └── useDebounce.js          # Custom debounce hook (to be created)
├── services/
│   └── reportsAPI.js           # Mock API service
├── utils/
│   └── csvExport.js            # CSV export utility (to be created)
├── App.jsx                     # Main application component
└── index.css                   # Tailwind CSS imports
```

## 🛠 Technical Requirements

- **React 19** with modern hooks (useState, useEffect, useMemo, useCallback)
- **Custom debounce hook** implementation
- **CSV export functionality** with proper file handling
- **TanStack Table v8** for table functionality
- **Tailwind CSS v4** for styling
- **Error handling** for async operations and file downloads
- **Real-time user experience** with proper loading states

## 📊 Evaluation Criteria

### **Code Quality (30%)**

- Clean, readable, and well-organized code
- Proper React hook implementation and usage
- Effective debouncing implementation
- Clean CSV export utility implementation
- Consistent naming conventions and formatting

### **Functionality (35%)**

- Real-time search works as user types
- Debouncing prevents excessive API calls
- CSV export works with filtered/sorted data
- Search integrates properly with existing filters
- Loading states are handled appropriately for both features

### **UI/UX (25%)**

- Smooth, responsive search experience
- Clear export functionality with proper feedback
- Proper loading indicators for both features
- Search clears appropriately when empty
- Professional and polished interface

### **Error Handling (10%)**

- Graceful error recovery for search failures
- Export error handling with user feedback
- Network failure handling
- Input validation and edge cases

## 🧪 Testing

This project includes a comprehensive test suite to validate your implementation:

```bash
# Run tests in watch mode (recommended)
npm test

# Run tests once
npm run test:run

# Run tests with UI (optional)
npm run test:ui
```

**Test Status:**
- ✅ **Passing**: Existing functionality works correctly
- ❌ **Failing**: Features you need to implement (expected)
- ⏭️ **Skipped**: Tests ready to enable once features are implemented

The tests are designed to guide your implementation and will help ensure your solution meets requirements.

## 📝 Submission Guidelines

1. **Complete both tasks**
2. **Test your implementation** thoroughly with different search scenarios and export functionality
3. **Ensure the application runs** without errors (`npm run dev`)

## ❓ Need Help?

- Check the existing code for patterns and examples
- Console logs are your friend for debugging
- The mock API in `reportsAPI.js` already supports search functionality
- Focus on the debounce hook implementation first
- For CSV export, consider using browser's built-in download capabilities
- Don't hesitate to make reasonable assumptions

---

Good luck! We're excited to see your React skills in action! 🚀
