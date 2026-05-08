import { initializeApp } from "./app";

const port = process.env.PORT || 3000;

initializeApp()
  .then((app) => {
    app.listen(port, () =>
      console.log(`Example app listening at http://localhost:${port}`)
    );
  })
  .catch((error) => {
    console.error("Failed to initialize app:", error);
    process.exit(1);
  });
