const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello world!");
});

//function to bring up docs that we created in the firebase database
exports.getScreams = functions.https.onRequest((req, res) => {
  admin
    .firestore()
    .collection("screams")
    .get()
    .then(data => {
      let screams = [];
      //loops through each doc in the screams collection
      data.forEach(doc => {
        screams.push(doc.data());
      });
      return res.json(screams);
    })
    //if there's an error it will be logged to the console
    .catch(err => console.error(err));
});

//function to create documents
exports.createScream = functions.https.onRequest((req, res) => {
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    //new Date passes in the current date
    createdAt: admin.firestore.Timestamp.fromDate(new Date())
  };
  //allows us to persist the data in firebase
  admin
    .firestore()
    .collection("screams")
    .add(newScream)
    .then(doc => {
      //once the document is create it will have an id associated with it
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch(err => {
      //if there's an error it we'll return a response with the status code 500 which means it's a server error
      res.status(500).json({ error: `something went wrong` });
      console.error(err);
    });
});
