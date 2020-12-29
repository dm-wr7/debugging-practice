import React from 'react';
import axios from 'axios';
import './Container.css';
import Treasure from '../Treasure';
import { render } from 'react-dom';

export default class Container extends Component {
  constructor() {
    super();
    this.state = {
      treasures: {},
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({ treasures: {} });
    }
  }

  getDragonTreasure() {
    
    // axios GET to /api/treasure/dragon here
    axios.get('/api/treasure/dragon')
      .then(res => {
        this.setState({
          treasures: {...this.state.treasures, dragon: res.data}
        })
      })
      .catch(err => console.log(err.response));
  }
  getAllTreasure() {
    // axios GET to /api/treasure/all here
    axios.get('/api/treasure/all')
      .then(res => {
        console.log(res.data)
        this.setState({
          treasures: {...this.state.treasures,
            all: res.data}
        })
      })
      .catch(err => alert(err.response.data.message));
  }

  getMyTreasure() {
    // axios GET to /api/treasure/user here
    axios.post('/api/treasure/user')
      .then(res => {
        this.setState({
          treasures: {...this.state.treasures, user: res.data}
        })
      })
      .catch(err => alert(err.response.data.message));
  }

  addMyTreasure(newMyTreasure) {
    this.setState({
      treasures: {
        ...this.state.treasures,
        user: newMyTreasure,
      },
    });
  }

  
  render() {
    const { username } = props.user;
    const { dragon, user, all } = this.state.treasures;

    return (
      <div className="Container">
        {dragon ? (
          <div className="treasureBox loggedIn">
            <h1>Dragon's treasure</h1>
            <Treasure treasure={dragon} />
          </div>
        ) : (
          <div className="treasureBox">
            <button className="title" onClick={() => this.getDragonTreasure()}>
              See Dragon's <br /> Treasure
            </button>
            <p>This treasure trove does not require a user to be logged in for access</p>
          </div>
        )}
        {user && username ? (
          <div className="treasureBox loggedIn">
            <h1>
              {this.props.user.usernamee}
              's treasure
            </h1>
            <Treasure treasure={user} addMyTreasure={this.addMyTreasure} />
          </div>
        ) : (
          <div className="treasureBox">
            <button className="title" onClick={() => this.getMyTreasure()} name="user">
              See My <br /> Treasure
            </button>
            <p>This treasure trove requires a user to be logged in for access</p>
          </div>
        )}
        {all && username ? (
          <div className="treasureBox loggedIn">
            <h1>All treasure</h1>
            <Treasure treasure={all} />
          </div>
        ) : (
          <div className="treasureBox">
            <button className="title" onClick={() => this.getAllTreasure()} name="all">
              See All <br /> Treasure
            </button>
            <p>This treasure trove requires a user to be a logged in as an admin user for access</p>
          </div>
        )}
      </div>
    );
  }

}
