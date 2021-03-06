import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { usersRouter } from "./routes/users-routes.js";
import { contactRouter } from "./routes/contact-route.js";
import { chatRouter } from "./routes/chat-routes.js";
import { markerRouter } from "./routes/marker-routes.js";
import { notificationsRouter } from "./routes/notifications-routes.js";
import { reviewsRouter } from "./routes/reviews-routes.js";

const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicPath = path.join(__dirname, "../client/build");

app.use(express.static(publicPath));

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());

app.use("/users", usersRouter);
app.use("/contact", contactRouter);
app.use("/chat", chatRouter);
app.use("/markers", markerRouter);
app.use("/notifications", notificationsRouter);
app.use("/reviews", reviewsRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

export { app };
