import express, { Request, Response, NextFunction } from "express";
import Subscriber, { ISubscriber } from "../models/subscriber";

const router = express.Router();

interface CustomResponse extends Response {
  subscriber: ISubscriber;
}

// Getting all
router.get("/", async (req: Request, res: Response) => {
  try {
    const subscribers = await Subscriber.find();
    res.json(subscribers);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Getting one
router.get("/:id", getSubscriberMiddleware, (req: Request, res: Response) => {
  // @ts-ignore
  res.json(res.subscriber);
});

// Creating one
router.post("/", async (req: Request, res: Response) => {
  const action = new Subscriber({
    name: req.body.name,
    subscribedToChannel: req.body.subscribedToChannel,
  });

  try {
    const newSubscriber = await action.save();
    res.status(201).json(newSubscriber);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Updating one
/* PUT would update all info at once. PATCH would update only the info that was sent. */
router.patch(
  "/:id",
  getSubscriberMiddleware,
  async (req: Request, res: Response) => {
    if (req.body.name != null) {
      // @ts-ignore
      res.subscriber.name = req.body.name;
    }
    if (req.body.subscribedToChannel != null) {
      // @ts-ignore
      res.subscriber.subscribedToChannel = req.body.subscribedToChannel;
    }

    try {
      // @ts-ignore
      const updatedSubscriber = await res.subscriber.save();
      res.json(updatedSubscriber);
    } catch (err: any) {
      res.status(400).json({ message: err });
    }
  }
);

// Deleting one
router.delete(
  "/:id",
  getSubscriberMiddleware,
  async (req: Request, res: Response) => {
    try {
      // @ts-ignore
      await res.subscriber.deleteOne();
      res.json({ message: "Deleted subscriber" });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }
);

// Middleware
async function getSubscriberMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const subscriber = await Subscriber.findById(req.params.id);

    if (!subscriber) {
      return res.status(404).json({ message: "Can not find subscriber" });
    }

    // @ts-ignore
    res.subscriber = subscriber;
    next();
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
}

export default router;
