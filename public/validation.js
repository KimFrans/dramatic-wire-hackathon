// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/w8xEgEtnA/";
let timer = '';
setTimeout(() => {
        timer = true;
}, 12000)
let success = false;
let matchCount = 0;
const targetAnimal = document.querySelector('.animal').id

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {
    console.log(timer)
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
    webcam = new tmImage.Webcam(600, 600, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    const loader = document.querySelector('.loader');
    loader.remove()
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    const myReq = window.requestAnimationFrame(loop);

    const canvas = document.getElementById("webcam-container").children[0];
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    if (success) {
        localStorage.setItem('completed', targetAnimal);
        console.log(localStorage.getItem('completed'));
        window.location.href = `/${targetAnimal}/success`;
    } else if(timer) {
        window.location.href = `/${targetAnimal}/not-found`;
    } else {
        myReq = window.requestAnimationFrame(loop);
    }
}

// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    
    const prediction = await model.predict(webcam.canvas);
    
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
    if(bestMatch == targetAnimal) {
        matchCount++;
    } else {
        matchCount = 0;
    }
    if (matchCount == 30) {
        success = true;
    }
}

init();