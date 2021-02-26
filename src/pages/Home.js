import React from 'react';

import { redirect } from '../helpers';
import './home.scss';

function HomePage() {
    const { localStorage: storage } = window;

    document.body.style.backgroundColor = 'black'

    const track = Math.round(Math.random() * 3);

    storage.setItem('track', track);

    return (<div id="upsell" className="bg-repeat-y bg-contain min-h-full flex flex-col m md:flex-row">
        <div className="flex md:w-1/2 flex-col justify-center relative items-center py-10 md:py-auto">
            <h1 className="uppercase text-5xl md:absolute md:text-6xl lg:text-7xl  font-black text-center text-white">Quiz<br />DEMO<br/></h1>
        </div>
        <div className="md:w-1/2 flex-grow flex py-10 pb-40 md:pb-auto md:py-auto pr-3" id='second-part'>
            <div className="flex-grow flex flex-col justify-center items-center text-center" id='starter'>
                <h2 className="font-black text-3xl px-4 py-2 text-white bg-red-600 italic mb-5">Why?</h2>
                <p className="px-10 py-5">Why quiz? Why now?</p>

                <button onClick={() => {

                    storage.setItem('report', JSON.stringify([]));
                    redirect('/question/1')
                }} className="mt-10 hover:bg-gray-900 uppercase rounded-md bg-black text-white font-bold px-4 py-2">Start Quiz</button>
            </div>
        </div>
    </div>)
}

export default HomePage;