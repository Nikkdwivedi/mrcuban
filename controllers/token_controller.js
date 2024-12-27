import { Expo } from "expo-server-sdk";
import { Tokens } from "../models/expo.js";
import { Rides } from "../models/rides.js";

// Save Token Function
export const SavedToken = async (req, res) => {
  try {
    const { id, token } = req.query;

    const check = await Tokens.findOne({
      $and: [{ partnerId: id }, { token: token }],
    });

    if (check) {
      return res.status(200).json({ msg: "ok", data: check });
    } else {
      const data = await Tokens.create({ partnerId: id, token: token });
      return res.status(200).json({ msg: "ok", data });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error });
  }
};

// Send Notification Function
// export const SendNotification = async (req, res) => {
//   try {
//     const { title, message, seat } = req.query;

//     let expo = new Expo();

//     const drivers = await Rides.find({
//       $and: [{ seat: Number(seat) }, { status: true }],
//     },'driverId');

//     console.log(drivers,"drivers")
    
//     let newTokens = [];

//     for (let i = 0; i < drivers?.length; i++) {
//       let temp = await Tokens.findOne({ partnerId: drivers[i]?.driverId });
//       if (temp !== null) {
//         newTokens.push(temp);
//       }
//     }

//     if (newTokens?.length === 0) {
//       return res.status(200).json({msg:"No Driver Exist"});
//     }


//     console.log(newTokens,"token")

//     let messages = [];

//     for (let pushToken of newTokens) {
//       // Check if the token is a valid Expo push token
//       if (!Expo.isExpoPushToken(pushToken.token)) {
//         console.error(
//           `Push token ${pushToken.token} is not a valid Expo push token`
//         );
//         continue;
//       }
//       messages.push({
//         to: pushToken.token,
//         sound: "default",
//         title: title,
//         body: message,
//         data: { someData: "goes here" },
//       });
//     }
// console.log(messages)


//     // Send notifications in chunks
//     let chunks = expo.chunkPushNotifications(messages);
//     (async () => {
//       for (let chunk of chunks) {
//         try {
//           let receipts = await expo.sendPushNotificationsAsync(chunk);
//           console.log(receipts,"avc");
//         } catch (error) {
//           console.error(error);
//         }
//       }
//     })();

//     res.status(200).send("Notifications sent");
//   } catch (error) {
//     console.log(error);
//     res
//       .status(400)
//       .json({ msg: error.message || "Error sending notifications" });
//   }
// };

export const SendNotification = async (req, res) => {
  try {
    const { title, message, seat } = req.query;

    const expo = new Expo();

    // Fetch drivers with the given seat and status
    const drivers = await Rides.find(
      { $and: [{ seat: Number(seat) }, { status: true }] },
      'driverId'
    );

    if (!drivers.length) {
      return res.status(200).json({ msg: "No drivers available" });
    }

    const driverIds = drivers.map(driver => driver.driverId);

  

    // Fetch tokens for all drivers
    const newTokens = await Tokens.find({ partnerId: { $in: driverIds } });

    if (!newTokens.length) {
      return res.status(200).json({ msg: "No valid tokens found" });
    }

    const messages = [];

    for (let pushToken of newTokens) {
      if (!pushToken.token || !Expo.isExpoPushToken(pushToken.token)) {
        console.error(`Invalid push token: ${pushToken?.token}`);
        continue;
      }
      messages.push({
        to: pushToken.token,
        sound: "default",
        title,
        body: message,
        data: { someData: "goes here" },
      });
    }

    if (!messages.length) {
      return res.status(200).json({ msg: "No valid push tokens to send notifications" });
    }

    // Send notifications in chunks
    const chunks = expo.chunkPushNotifications(messages);
    try {
      for (let chunk of chunks) {
        const receipts = await expo.sendPushNotificationsAsync(chunk);
        console.log("Receipts:", receipts);
      }
      res.status(200).send("Notifications sent successfully");
    } catch (error) {
      console.error("Error sending notifications:", error);
      res.status(500).json({ msg: "Error sending notifications" });
    }
  } catch (error) {
    console.error("Error in SendNotification API:", error);
    res.status(400).json({ msg: error.message || "Error processing request" });
  }
};


export const SendSingularNotification = async (id, title, message) => {
  try {
    let expo = new Expo();

    const tokens = await Tokens.find({ partnerId: id }, "token");
    let messages = [];

    for (let pushToken of tokens) {
      // Check if the token is a valid Expo push token
      if (!Expo.isExpoPushToken(pushToken.token)) {
        console.error(
          `Push token ${pushToken.token} is not a valid Expo push token`
        );
        continue;
      }
      messages.push({
        to: pushToken.token,
        sound: "default",
        title: title,
        body: message,
        data: { someData: "goes here" },
      });
    }

    // Send notifications in chunks
    let chunks = expo.chunkPushNotifications(messages);
    (async () => {
      for (let chunk of chunks) {
        try {
          let receipts = await expo.sendPushNotificationsAsync(chunk);
          console.log(receipts);
        } catch (error) {
          console.error(error);
        }
      }
    })();

    return "Notification Sent";
  } catch (error) {
    console.log(error);
    return error || "Error sending notifications";
  }
};
