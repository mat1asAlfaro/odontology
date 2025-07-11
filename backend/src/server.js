require("dotenv").config({ debug: false });
const app = require("./app");
const seed = require("./seed/seed");

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);

  await seed();
});
