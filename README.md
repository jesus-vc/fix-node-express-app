# This repo contains two applications.

# App #1 --> A CLI program (/src/fetchData.js)
  1. Takes as input a .txt file of URLs
  2. Sends HTTP requests per URL
  3. Stores results (including errors) in unique files under /results.

  Example of CLI command: 
  ```
  "node src/fetchdata.js urls.txt"
  ```

# App #2 --> An API application that fetches user data from Github (/broken-app)
  1. http://localhost:3000/ takes as input a POST request such as
  ```
  { "developers": ["joelburton", "elie"] }
  ```
  3. Returns an array of objects with user information such as:
  ```
  [
    {
      "bio": "Open source developer. Former dev at Apple...",
      "name": "Joel Burton"
    },
    {
      "bio": "Co-founder + Lead Instructor @rithmschool ",
      "name": "Elie Schoppik"
    }
  ]
  ```
  3. Error Handling: If any user or if all users are "not found', an appropriate error message will be included in response. 
