import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ChatEngineCore from 'chat-engine';
import styled from 'styled-components';
import backgroundImage from './download.png';


const now = new Date().getTime();


const ChatEngine = ChatEngineCore.create({
    publishKey: 'pub-c-a35fd731-56ef-4e64-8f68-b887a5c3ad0e',
    subscribeKey: 'sub-c-4fb07876-24df-11e8-9bf4-060db84035e6'
}, {
        globalChannel: 'chat-engine-react'
    });

const getUsername = () => {
    const persons = ['Ryan', 'Matthew', 'Abhineet','Siddharth','Archita','Shashank','Ayush'];
    return persons[Math.floor(Math.random() * persons.length)];
};

ChatEngine.connect(getUsername(), {
    signedOnTime: now
}, 'auth-key');


class Message extends React.Component {

    render() {
        return (<div> {this.props.uuid}: {this.props.text}
        </div>
        );
    }
};


var createReactClass = require('create-react-class');

var Chat = createReactClass({

    // return the initial state of our Chat class
    getInitialState: function () {
        return {
            messages: [],
            chatInput: ''
        };
    },

    // update the input field when the user types something
    setChatInput: function (event) {
        this.setState({ chatInput: event.target.value })
    },

    // send the message to the other users
    sendChat: function () {
        if (this.state.chatInput) {
            ChatEngine.global.emit('message', {
                text: this.state.chatInput
            });
            this.setState({ chatInput: '' })
        }
    },

    // listen for a 'message' event and fire a callback
    componentDidMount: function () {
        ChatEngine.global.on('message', (payload) => {
            let messages = this.state.messages;
            messages.push(
                <Message key={this.state.messages.length} uuid={payload.sender.uuid} text={payload.data.text}
                />
            );
            this.setState({
                messages: messages
            });
        });
    },

    // bind the 'Enter' key for sending messages
    _handleKeyPress: function (e) {
        if (e.key === 'Enter') {
            this.sendChat();
        }
    },

    // render the input field and send button
    render: function () {

        const Footer = styled.footer`
        position: fixed;
        font:15px;
        font-weight:bold;
        left: 500px;
        bottom: 10;
        width: 200px;
        background-color: lightgray;
        color: black;
        text-align: center;
      `;

        return (
            <div>
                <section className="sayhello">
                    <div className="article-img fadeInLeft" >

                        <img src={backgroundImage} />

                    </div>

                </section>

                <section className="box">
                    <div></div>
                    <div className="headerBar">
                        <div className="user-photo">
                            <img src="https://www.applozic.com/assets/resources/images/1-1-Chat@512px.svg" />
                        </div>
                        <p className="title">Chat Engine Demo</p>
                    </div>

                    <div className="chatbox">
                        <div className="chatlogs">

                            <div className="chat">
                            </div>

                            <div className="chat-right" id="chat-output"> {this.state.messages}


                            </div>

                        </div>
                        <div className="chat-form">


                            <div >
                                <textarea id="chat-input" className="inputDiv" type="text" name="" placeholder="Type your message" value={this.state.chatInput} onChange={this.setChatInput} onKeyPress={this._handleKeyPress} />
                            </div>
                            <div >
                                <input type="button" className="buttonStyle" onClick={this.sendChat} value="Send" />

                            </div>

                        </div>



                    </div>


                </section>


                <Footer>Abhineet Gupta  2018</Footer>

            </div>
        );
    },
});

ChatEngine.on('$.ready', () => {
    ReactDOM.render(<Chat />,
        document.getElementById('root')
    );
});
