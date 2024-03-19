import './App.css'
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import ProjectItem from './components/ProjectItem'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiConstantStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class App extends Component {
  state = {
    projectsList: [],
    apiStatus: apiConstantStatus.initial,
    activeCategoryId: categoriesList[0].id,
  }

  componentDidMount = () => {
    this.getProjectListData()
  }

  onChangingOptions = event => {
    this.setState({activeCategoryId: event.target.value}, () =>
      this.getProjectListData(),
    )
  }

  getProjectListData = async () => {
    const {activeCategoryId} = this.state
    this.setState({apiStatus: apiConstantStatus.inProgress})
    const url = `https://apis.ccbp.in/ps/projects?category=${activeCategoryId}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const formattedData = data.projects.map(eachItem => ({
        id: eachItem.id,
        name: eachItem.name,
        imageUrl: eachItem.image_url,
      }))
      this.setState({
        projectsList: formattedData,
        apiStatus: apiConstantStatus.success,
      })
    } else {
      this.setState({apiStatus: apiConstantStatus.failure})
    }
  }

  renderProjectListView = () => {
    const {projectsList, activeCategoryId} = this.state
    return (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
          alt="website logo"
        />
        <select value={activeCategoryId} onChange={this.onChangingOptions}>
          {categoriesList.map(eachItem => (
            <option key={eachItem.id} value={eachItem.id}>
              {eachItem.displayText}
            </option>
          ))}
        </select>
        <ul>
          {projectsList.map(eachItem => (
            <ProjectItem key={eachItem.id} eachProject={eachItem} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="tailSpin" height={50} width={50} />
    </div>
  )

  onClickRetry = () => {
    this.getProjectListData()
  }

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.onClickRetry}>
        Retry
      </button>
    </div>
  )

  render() {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiConstantStatus.success:
        return this.renderProjectListView()
      case apiConstantStatus.failure:
        return this.renderFailureView()
      case apiConstantStatus.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default App
