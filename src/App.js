import React, { Component } from 'react';
import * as _ from 'lodash'
const synth = window.speechSynthesis;

class App extends Component {
    constructor(props){
        super(props)
        this.state = {
          voiceOptions: [],
          text: '',
          selectedVoice:'',
          rate: 1,
          pitch: 1
        };
        if(synth.onvoiceschanged !== undefined){
            synth.onvoiceschanged = this.getVoices.bind(this);
        }
        this.onSpeak = this.onSpeak.bind(this)
        this.onChangeText = this.onChangeText.bind(this)
        this.onChangeVoice = this.onChangeVoice.bind(this)
    }

    getVoices(){
        const voiceOptions = synth.getVoices();

        this.setState({
            voiceOptions: voiceOptions,
            selectedVoice: _.first(voiceOptions).name
        })
    }

    onSpeak(){
        if(synth.speaking){
            console.error('Already speaking...');
            return;
        }

        const { text, selectedVoice, voiceOptions } = this.state
        if(text !== ""){
            const speakText = new SpeechSynthesisUtterance(text);
            speakText.onend = e => {
                console.log('Done speaking');
            }

            speakText.onerror = e => {
                console.error('Some thing went wrong');
            }

            speakText.voice = _.first(_.filter(voiceOptions, (voice) => {
                return voice.name === selectedVoice
            }));

            synth.speak(speakText)
        }

    }

    onChangeText(event){
        this.setState({
            text: event.target.value
        })
    }

    onChangeVoice(event){
        this.setState({
            selectedVoice: event.target.value
        })
    }

  render() {
    const { voiceOptions, selectedVoice, text, pitch, rate } = this.state
    return (
        <form>
            <div className="form-group">
                <textarea name="" value={text} id="text-input" className="form-control form-control-lg"
                          placeholder="Type anything..." onChange={this.onChangeText}></textarea>
            </div>
            <div className="form-group">
                <label htmlFor="rate">Rate</label>
                <div id="rate-value" className="badge badge-primary float-right">1</div>
                <input type="range" id="rate" className="customer-range form-control" min="0.5" max="2" value={rate} step="0.1" />
            </div>
            <div className="form-group">
                <label htmlFor="pitch">Pitch</label>
                <div id="pitch-value" className="badge badge-primary float-right">1</div>
                <input type="range" id="pitch" className="customer-range form-control" min="0" max="2" value={pitch} step="0.1" />
            </div>
            <div className="form-group">
                <select name="" id="voice-select" className="form-control form-control-lg" defaultValue={selectedVoice} onChange={this.onChangeVoice}>
                    {voiceOptions &&
                      voiceOptions.map((voice, i) => (
                          <option value={voice.name} key={i}>{voice.name}</option>
                      ))
                    }
                </select>
            </div>
            <button type="button" className="btn btn-light btn-lg btn-block" onClick={this.onSpeak}>Speak It</button>
        </form>
    );
  }
}

export default App;
