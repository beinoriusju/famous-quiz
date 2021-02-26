import React from 'react';
import ReactDOM from 'react-dom';

import HomePage from './pages/Home'
import QuizPage from './pages/Quiz'
import ResultsPage from './pages/Results'

import { Location, Locations, NotFound } from 'react-router-component';

const NotFoundPage = () => {
    return <p>Nothing here.</p>
}

class App extends React.Component {
    render() {
        return <Locations>
        <Location path="/" handler={HomePage} />
        <Location path="/question/:q" handler={QuizPage} total={10} />
        <Location path="/results" handler={ResultsPage} />
        <NotFound handler={NotFoundPage} />
      </Locations>      
    }
}

ReactDOM.render(<App />, document.getElementById('app'));