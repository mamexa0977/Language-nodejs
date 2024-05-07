const Feedback = require('./feedbackschema');
const express = require('express');
const router = express.Router();
const Sentiment = require('sentiment');
const sentiment = new Sentiment();

router.post('/feedback', async (req, res) => {
 try {
    const { email, message, } = req.body;


// Sample feedback message
    const feedbackText = req.body.message;
    
    // Analyze sentiment
    const analysis = sentiment.analyze(feedbackText);
    const score = analysis.score;
    
    console.log("Sentiment Analysis Result:");
    console.log("Score:", analysis.score);
  
    let messageType;
    if (analysis.score > 0) {
      messageType = 'good';
    } else if (analysis.score < 0) {
      messageType = 'bad';
    } else {
      messageType = 'neutral';
    }
    console.log(messageType)
    const feedback = await Feedback.create({email, message, messageType});
    res.status(201).json({ message: 'Feedback Sent successfully' });
    console.log("Feedback Sent successfully")
 } catch (error) {
    
 }
});

router.get("/status", async(req, res)=>{
    try {
        const totalbad = await Feedback.countDocuments({ messageType: "bad" });
        const totalgood = await Feedback.countDocuments({ messageType: "good" });
        const totalneutral = await Feedback.countDocuments({ messageType: "neutral" });
        console.log("total bad lengt: " + totalbad)
        console.log("total good lengt: " + totalgood)
        console.log("total neutral lengt: " + totalneutral)
        res.status(200).json({
         "totalbad": totalbad,
         "totalgood": totalgood,
         "totalneutral": totalneutral


     })

        
    } catch (error) {
        
    }

})
module.exports = router;
