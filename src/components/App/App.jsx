import './App.css'
import { Input , Tabs } from 'antd'
import { Component } from 'react'
//import { Offline, Online } from 'react-detect-offline'
import { debounce } from 'lodash'

import Results from '../Results/Results'


export default class App extends Component {
  state={
    inputValue:'way',
  }

  onSentInput = (e) => {
    let value = e.target.value.replace(' ','%20')
    this.setState({
      inputValue:value
    })
  }

  render() {
    const {inputValue }=this.state
    const items = [
      {
        key: 1,
        label: 'Search',
        children: [
          <Input key='input' className='movies_searchbar' placeholder='Type to search...' 
            onChange={debounce(this.onSentInput.bind(this), 700)} onPressEnter={this.onSentInput}/>,
          <Results key='results' input={inputValue}/>],
      },
      {
        key: 2,
        label: 'Rated',
        children: [<div key='rated'>rated films</div>],
      },
    ]


    return (
      <div className="page">
        {/* <Online> */}
        <Tabs className='tabs' defaultActiveKey="1" items={items} centered />
        {/* </Online> */}
        {/* <Offline>Кажется, у вас нет интернета. Проверьте сетевое соединение</Offline> */}
      </div>
    )
  }
}