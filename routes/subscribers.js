const express = require("express");
const Subscriber = require("../models/subscriber");

const router = express.Router();

// Getting all
router.get("/", async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting one
router.get("/:id", getSubscriberMiddleware, (req, res) => {
  res.json(res.subscriber);
});

// Creating one
router.post("/", async (req, res) => {
  const action = new Subscriber({
    name: req.body.name,
    subscribedToChannel: req.body.subscribedToChannel,
  });

  try {
    const newSubscriber = await action.save();
    res.status(201).json(newSubscriber);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Updating one
/* PUT would update all info at once. PATCH would update only the info that was sent. */
router.patch("/:id", getSubscriberMiddleware, async (req, res) => {
  if (req.body.name != null) {
    res.subscriber.name = req.body.name;
  }
  if (req.body.subscribedToChannel != null) {
    res.subscriber.subscribedToChannel = req.body.subscribedToChannel;
  }

  try {
    const updatedSubscriber = await res.subscriber.save();
    res.json(updatedSubscriber);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

// Deleting one
router.delete("/:id", getSubscriberMiddleware, async (req, res) => {
  try {
    await res.subscriber.deleteOne();
    res.json({ message: "Deleted subscriber" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Middleware
async function getSubscriberMiddleware(req, res, next) {
  try {
    subscriber = await Subscriber.findById(req.params.id);

    if (!subscriber) {
      return res.status(404).json({ message: "Can not find subscriber" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.subscriber = subscriber;
  next();
}

module.exports = router;
