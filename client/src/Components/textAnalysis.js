import React, {useState, useEffect} from 'react'
import * as tf from '@tensorflow/tfjs';
import {} from 'semantic-ui-react'

function textAnalysis(){

    //model and metadata url
    const url= {
        model: 'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/model.json',
        metadata: 'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/metadata.json'
        }

    async function loadModel (url){
        try{
            const Model = await tf.loadLayersModel(url.model);
            setModel(model);
        }

        catch (err) {
            console.log(err);
            }
    }   
    
    async function loadMetadata(url) {
        try {
        const metadataJson = await fetch(url.metadata);
        const metadata = await metadataJson.json();
        setMetadata(metadata);} 
        catch (err) {
        console.log(err);
        }}

    const [metaData, setMetadata] = useState();
    const [model, setModel] = useState();

    useEffect(()=>{
        tf.ready().then(()=>{
        loadModel(url)
        loadMetadata(url)
        });
        },[])

        //tokenize each word in the sentence
        const inputText = text.trim().toLowerCase().replace(/(\.|\,|\!)/g, '').split(' ');

        //Convert the alphabetical token to numerical token using metadata
        const OOV_INDEX = 2;
        const sequence = inputText.map(word => {
        let wordIndex = metadata.word_index[word] + metadata.index_from;
        if (wordIndex > metadata.vocabulary_size) {
        wordIndex = OOV_INDEX;
        }
        return wordIndex;
        });

        const PAD_INDEX = 0;
        const padSequences = (sequences, maxLen, padding = 'pre', truncating = 'pre', value = PAD_INDEX) => {
        return sequences.map(seq => {
        if (seq.length > maxLen) {
        if (truncating === 'pre') {
        seq.splice(0, seq.length - maxLen);
        } else {
        seq.splice(maxLen, seq.length - maxLen);
        }
        }
        if (seq.length < maxLen) {
        const pad = [];
        for (let i = 0; i < maxLen - seq.length; ++i) {
        pad.push(value);
        }
        if (padding === 'pre') {
        seq = pad.concat(seq);
        } else {
        seq = seq.concat(pad);
        }
        }
        return seq;});}
        const paddedSequence = padSequences([sequence], metadata.max_len);

        //convert padded sequence into 2D tensorflow matrix
        const input = tf.tensor2d(paddedSequence, [1, metadata.max_len]);

        //Load tensor 2D matrix into our model 
        const predictOut = model.predict(input);
        const score = predictOut.dataSync()[0];
        predictOut.dispose();
        setScore(score)
        return score;

        const [testText, setText]= useState("");

        return(
            
        )
}

export default textAnalysis;