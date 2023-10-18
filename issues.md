# Broken App Issues

# Bugs

    - An incorrect object notation was being used to capture the appropriate properties (name and bio).

# Enhancements

    - Promise.allSettled was added to await properly the map of promises.
    - Codebase was divided into multiple files (inside /broken-app) to separate logic and enhance readability.
    - A new ExpressError class was created to handle "Not Found" and "Github does not recognize any of your users" scenarios.
