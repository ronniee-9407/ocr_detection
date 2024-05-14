const express = require('express');
const path = require('path');


const app = express();


// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist/ocr-detection')));
// Redirect all requests to the index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/ocr-detection/index.html'));
  });
  
  
  // Start the server
  const port = process.env.PORT || 4800;   
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  