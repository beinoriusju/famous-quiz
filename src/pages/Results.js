import React from 'react';

import './report.scss';

const ResultsPage = () => {
    const { localStorage: storage } = window;

    let report = storage.getItem('report');

    if (!report) {
        return <p>Ooops! You come too early.</p>
    }

    report = JSON.parse(report);

    let score = 0;

    const questionsL = report.map((state, questionIndex)=> {
        const { question, answers } = state;

        let skipped = false;
        let passed = false;

        if (answers.length != question.countPos) {
            skipped = true;
        } else {
            passed = answers.filter(answer => answer.positive).length / question.countPos > 0.5;
        }

        if (passed) {
            score++;
        }

        const answersL = question.answers.map((answer, index) => {
            const chosen =  answers.find(a => a.title === answer.title);

            const classNames = ['answer'];

            if (chosen) {
                classNames.push('selected');
            }

            classNames.push(answer.positive ? 'positive' : 'negative');

            return <li key={`a${index}`} class={classNames.join(' ')}>{answer.title}</li>;
        });

        return (<div className="w-full  mt-10 lg:mt-15 relative lock" id='widget'>
        <div className="relative">
            <h4  className="bg-gray-600 block  lg:w-4/5 text-white rounded-t-md p-3 pb-5">{question.title}</h4>

            <div className="text-gray-900 hidden lg:block absolute w-1/5 top-1/2 block text-center right-0 transform -translate-y-1/2">
                <p>Points: {passed ? 1 : 0}</p>
            </div>
        </div>

        <ul className="block bg-gray-100 rounded-bl-md lg:rounded-bl lg:rounded-tr pt-5 px-3  pb-5 ">
            {answersL}
        </ul>

        <p className="text-center lg:hidden mt-5">Points: {passed ? 1 : 0}</p>
    </div>)
    });

    return (<div className="container mx-auto p-3 lg:p-0 max-w-screen-lg">
            <h3 className="text-center font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase my-10 block ">GS Demo</h3>
            <p className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl"><span class="bg-yellow-200 px-1">Congratiolations!</span> You finished it.</p>
            <p className="mt-10  text-1xl sm:text-2xl md:text-3xl lg:text-4xl  text-center">Your score is <strong>{score}</strong></p>

            <div>{questionsL}</div>

            <div className="my-10 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                <p className="text-center">Try again? <a href="/">Do it.</a></p>
                <p className="text-center">Anything to add? <a href="mailto:justinasbeinorius@pm.me">Drop me an email.</a></p>
                <p className="text-center">Spot an error? <a href="https://github.com/beinoriusju/famous-quiz">Suggest edit on Github.</a></p>
            </div>
        </div>)
}

export default ResultsPage;