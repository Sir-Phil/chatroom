import express, { Router, Request, Response } from 'express';

const router: Router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.send({ response: "Server is up and running." }).status(200);
});

export default router;
