import React, {useState} from 'react';
import './App.css';
import axios from 'axios';
import {  TextField, Button } from '@material-ui/core'


function App() {

    const [numbers, setNumbers] = useState('');
    const [weights, setWeights] = useState('');
    const [weighted_average, setWeighted_average] = useState('');
    const [error, setError] = useState('');
    const handleClick = async (e) => {
        e.preventDefault();
        axios.get(`/api/count-average/?numbers=${numbers}&weights=${weights}`).then(res => {
            console.log(numbers,weights);
            if (res.data.error) {
                setWeighted_average('');
                setError(res.data.error);
            } else {
                setError('');
                setWeighted_average(res.data.result);
            }
        })
    };


    return (
        <div className="App">
            <header className="App-header">
                <form onSubmit={handleClick}>
                <TextField
                    id="filled-full-width"
                    label="Numbers"
                    style={{ margin: 8 }}
                    helperText="Please insert numbers as a string e.g. 2;4;3;5;8;8;4;8;3;"
                    value={numbers}
                    fullWidth
                    margin="normal"
                    variant="filled"
                    onInput={e => setNumbers(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    id="filled-full-width"
                    label="Weights"
                    style={{ margin: 8 }}
                    helperText="Please insert weights as a string e.g. 2;4;3;5;8;8;4;8;3; and of course remember to match weight to number - first weight match first number etc."
                    value={weights}
                    fullWidth
                    margin="normal"
                    variant="filled"
                    onInput={e => setWeights(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <Button size="small" variant="contained" type="submit">
                    Count the weighted average
                </Button>
                </form>
                <form>
                    {error ? <h4>{error}</h4> : <h4>{weighted_average ?  `Weighted average is ${weighted_average}`  : ''}</h4>}

                </form>

            </header>
        </div>
    );
}

export default App;