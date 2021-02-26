import React from 'react';

import { redirect } from '../helpers'

import './quiz.scss'

const parseQuestion = (text) => {
    return new Promise((resolve, reject) => {
        const titleR = /(\s*)(.*)/g;

        const titleText = titleR.exec(text)[0];

        const answers = [];
    
        const negativeAnswersR = /^-(\s*)(.*)$/gm;

        const textAnswersOnly = text.replace(titleText, '');
    
        let m;
    
        while ((m = negativeAnswersR.exec(textAnswersOnly)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === negativeAnswersR.lastIndex) {
                negativeAnswersR.lastIndex++;
            }
            
            answers.push({
                positive: false,
                title: m[m.length - 1]
            });
        }

    
        let countPos = 0;    
        
        const positiveAnswersR = /^\+(\s*)(.*)$/gm;
    
        while ((m = positiveAnswersR.exec(textAnswersOnly)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === positiveAnswersR.lastIndex) {
                positiveAnswersR.lastIndex++;
            }

            answers.push({
                positive: true,
                title: m[m.length - 1]
            });

            countPos++
        }

        shuffleArray(answers);

        resolve ({
            title: titleText,
            answers,
            multiple: countPos > 1,
            countPos
        })
    })
}

function shuffleArray(arr) {
    arr.sort(() => Math.random() - 0.5);
  }

  const formatTime = (seconds) => {
    const secondsF = `0${seconds}`.slice(-2);
    return <span>00:{secondsF}</span>
  }


class QuizPage extends React.Component {
    constructor(props) {
        super(props);

        this.state ={
            question: null,
            answers: [],
            time: 45,
            lock: false
        }

        this.choose = this.choose.bind(this);
        this.store = this.store.bind(this);
        this.next = this.next.bind(this);

        this.timer = null;
    }

    componentDidMount() {
        document.body.classList.add('loading');

        const { localStorage: storage } = window;

        let report = storage.getItem('report');

        if (report) {
            report = JSON.parse(report);

            if (report.length > this.props.q) {
                this.next();
            }
        }

        const track = window.localStorage.getItem('track');

        const questionNumber = ('00' + this.props.q).slice(-3);

        fetch(`/questions/${questionNumber}.question`)
            .then(response => response.text())
            .then(parseQuestion)
            .then(question => {
                this.setState({
                    question
                });

                this.timer = setInterval(() => {
                    const time = this.state.time > 1 ? this.state.time - 1 : 0;

                    if (time == 0) {
                        this.setState({
                            time,
                            lock: true
                        })
    
                        this.store();

                        clearInterval(this.timer);
                        setTimeout(this.next, 2000);
                    } else {
                        this.setState({
                            time
                        })
                    }
                }, 1000)
            })
            .catch(error => {
                this.setState({
                    alert: {
                        type: 'danger',
                        message: error.message
                    }
                })
            })
    }

    next(store = false) {
        if (store) {
            this.store();
        }

        const next = Number.parseInt(this.props.q) + 1; 

        if (next > this.props.total) {
            redirect(`/results`);
        } else {
            redirect(`/question/${next}`);
        }
    }

    store() {
        const { localStorage: storage } =  window;

        let report = storage.getItem('report');

        if (report) {
            report = JSON.parse(report);
        } else {
            report = []
        }

        report.push(this.state);

        storage.setItem('report', JSON.stringify(report));
    }
    
    choose(answer) {
        const { question, answers } = this.state;

        if (this.lock || answers.indexOf(answer) > -1) {
            return;
        }

        answers.push(answer);

        if (answers.length == question.countPos) {
            clearInterval(this.timer);
            this.setState({ answers, lock: true })

            setTimeout(() => {
                this.store();
                this.next();
            }, 1000)
        } else {
            this.setState({
                answers
            })
        }
    }

    render() {
        const { question, answers, lock } = this.state;

        if (this.state.alert) {
            return <p>WARNING: {this.state.alert.message}</p>
        }

        if (!question) {
            return <p>Loading...</p>
        }

        const answersL = question.answers.map((answer, index) => {
            const classList = ['answer'];

            classList.push(answer.positive ? 'positive' : 'negative');

            if (answers.indexOf(answer) > -1) {
                classList.push('selected')
            }

            return <li className={classList.join(' ')} key={`a${index}`} onClick={() => this.choose(answer)}>{answer.title}</li>
        });

        const quizClassses = [
            'container',
            'mx-auto',
            'p-3',
            'lg:p-0',
            'max-w-screen-lg'
        ];

        if (this.state.lock) {
            quizClassses.push('lock')
        }

        return    (<div className={quizClassses.join(' ')}>
        <h3 className="text-center text-gray-500 text-5xl uppercase mt-20 hidden lg:block ">Quiz Demo</h3>

        <div className="w-full  mt-28 lg:mt-20 relative" id='widget'>
            <div className="relative">
                <h4 id="question" className="bg-red-600 text-white rounded-t-md p-3 block pb-5">{question.title}</h4>

                <span id='pager' className="text-gray-900 absolute top-1/2 block text-center right-0 transform -translate-y-1/2">
                    <p className="lg:hidden font-bold">Quiz Demo</p>
                    <p>Question {this.props.q}/10</p>
                    <p className="lg:hidden"><span className="timer py-1 px-5 ">{formatTime(this.state.time)}</span></p>
                </span>
            </div>

            <ul className={(question.multiple ? 'multi' : '') + ' block bg-gray-100 rounded-bl-md lg:rounded-bl lg:rounded-tr pt-5 px-3 pb-5'}>
                {answersL}
            </ul>

            <div id='control' className="absolute -bottom-10 flex flex-row">
                <button className="rounded-b bg-gray-300 text-gray-900 py-1 px-5 hover:text-white hover:bg-gray-800 uppercase" onClick={() => this.next(true)}>Skip</button>
                <div className={'timer hidden hidden lg:block py-1 px-5' + (this.state.time ? 'text-red-600' : '')}>{formatTime(this.state.time)}</div>
            </div>
        </div>
    </div>)
    }
}

export default QuizPage;