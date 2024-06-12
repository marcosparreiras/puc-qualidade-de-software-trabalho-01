import { app } from "./app";
import { env } from "../../env";
import { myController } from "./controllers/my-contorller";

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT} 😉`);
});

app.get("/", myController);
