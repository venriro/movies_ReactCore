import './App.css'
import { Input , Tabs, Alert} from 'antd'
import { Component } from 'react'
import { Offline } from 'react-detect-offline'
import { debounce } from 'lodash'

import { MovieServiceProvider, MovieServiceConsumer } from '../../services/MovieService/MoviesServiceContextAPI'
import { GenresProvider } from '../../services/MovieService/GenresContextAPI'
import MovieService from '../../services/MovieService/MovieService'
import Results from '../Results/Results'
import RatePage from '../RatePage/RatePage'


export default class App extends Component {
  state={
    inputValue:'',
    error:false,
    genres:null,
  }

  MovieService=new MovieService()

  onSentInput = (e) => {
    let value = e.target.value.replace(' ','%20')
    this.setState({
      inputValue:value
    })
  }

  componentDidMount(){
    this.getGenres()
    this.MovieService.updateLocalStorage()
  }

  getGenres = () => {
    if(this.state.genres) return
    this.MovieService.getGenres()
      .then((info)=> {
        this.setState({
          genres:info.genres
        })
      })
      .catch(() => {
        this.setState({
          genres:false,
        })
      })
  }

  componentDidCatch(){
    this.setState({
      error:true
    })
  }

  render() {
    const {inputValue, error, genres}=this.state
    
    const results = inputValue? (<MovieServiceConsumer key='consumer'>
      {([{updateMovies, getTotalPages}, genres]) => {return(
        <GenresProvider value={genres}>
          <Results key='results' input={inputValue} updateMovies={updateMovies} getTotalPages={getTotalPages}/>
        </GenresProvider>
      )}}          
    </MovieServiceConsumer>):<Alert key='alert' type='info' showIcon message='напечатайте что-нибудь'/>

    const rated = (<GenresProvider value={genres} key='provider'>
      <RatePage  key='rated'/>       
    </GenresProvider>)


    const items = [
      {
        key: 1,
        label: 'Search',
        children: [
          <Input key='input' className='movies_searchbar' placeholder='Type to search...' autoFocus
            onChange={debounce(this.onSentInput.bind(this), 700)} onPressEnter={this.onSentInput}/>,
          [results]],
      },
      {
        key: 2,
        label: 'Rated',
        children: [rated],
      },
    ]

    if(error) return <Alert className='movies__alert' showIcon message='Что-то пошло совсем не так. Стоит проверить впн' type="error" />

    return (
      <MovieServiceProvider value={[this.MovieService, genres]}>
        <div className="page">
          <Offline>
            <Alert className='movies__alert' showIcon message='Кажется, у вас нет интернета. Проверьте сетевое соединение' type="error" />
          </Offline>
          <Tabs className='tabs' defaultActiveKey="1" items={items} centered destroyInactiveTabPane />
        </div>
      </MovieServiceProvider>
    )
  }
}