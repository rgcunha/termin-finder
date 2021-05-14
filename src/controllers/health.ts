import express from "express";

const get = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

export default {
  get,
};
