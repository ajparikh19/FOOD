export const addSequentialIds = (data, currPage, rowsPerPage) => {
    const startIndex = (currPage - 1) * rowsPerPage;
  
    return data.map((item, index) => ({
      ...item,
      seq_id: startIndex + index + 1, // Calculate sequential ID
    }));
  };
  