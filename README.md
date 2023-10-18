# fix-node-express-app
Fixing broken Node-Express app.

# This repo contains two applications.

# App #1 --> A CLI program (/src/fetchData.js)
  1. Takes as input a .txt file of URLs
  2. Sends HTTP requests per URL
  3. Stores results (including errors) in unique files under /results.

  Example of CLI command: "node src/fetchdata.js urls.txt"

# App #2 --> An API application that fetches user data from Github.
  1. http://localhost:3000/ takes as input a POST request such as { "developers": ["joelburton", "elie"] }.
  2. Returns an array of objects with user information such as:
![Screenshot 2023-10-18 at 9 52 18 AM](https://github.com/jesus-vc/fix-node-express-app/assets/52462476/133c5ea8-ea81-4e14-85ad-494e654c1397)

  3. Error Handling: If any user or if all users are "not found', an appropriate error message will be included in response. 
