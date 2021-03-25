import React, { Component} from 'react';
import Identicon from 'identicon.js'

class Navbar extends Component {

render() {
  return (
        <>
            <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                <a
                    className="navbar-brand col-sm-3 col-md-2 mr-0"
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                EthSwap
                </a>
                <ul className='navbar-nav px-3'>
                    <li className='nav-item text-nowrap d-none d-sm-none d-sm-block'>
                        <small className='text-light mr-15'>
                            <small id='account'>{this.props.account}</small>
                            
                        </small>
                        {
                            this.props.account ? 
                                <img 
                                    src={`data:iamge/png;base64,${new Identicon(this.props.account, 30).toString()}`}
                                    alt='profile-pic'
                                    className='ml-20'
                                    width='30'
                                    height='30'
                                />
                                : <span></span>
                        }
                    </li>
                </ul>
            </nav>
        </>
    );
  }
}

export default Navbar