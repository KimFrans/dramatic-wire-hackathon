// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/w8xEgEtnA/";

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    document.getElementById("webcam-container").appendChild(webcam.canvas);

}

init()

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
    // const animal =  document.querySelector('.animal').id
    // predict can take in an image, video or canvas html element
    const targetAnimal = 'fox'
    const prediction = await model.predict(webcam.canvas);
    let success = false;
    const results = {
        'nothing': 0,
        'fish': 0,
        'fox': 0,
        'dog': 0
    }

    let bestMatch = '';
    let matchProbability = 0;
    
    for (let i = 0; i < maxPredictions; i++) {
        results[prediction[i].className] = prediction[i].probability.toFixed(2);
        for(animal in results) {
            if (results[animal] >= matchProbability) {
                bestMatch = animal;
                matchProbability = results[animal]
            }
        }
    }
    console.log(bestMatch);
    if(bestMatch == targetAnimal) {
        success = true;
    }
    console.log(success);
}

