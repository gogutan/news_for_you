import React from 'react'
import PropTypes from 'prop-types'
import GoogleLogo from 'images/greyscale-short.png'

const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + (i * step))
const scores = range(300, 990, 5)
const wpms = range(30, 300, 5)

class ArticleRow extends React.Component {
  render () {
    const article = this.props.article
    const wpm = this.props.wpm
    return (
      <tr>
        <td>{article.source}</td>
        <td><a href={article.url}>{article.title}</a></td>
        <td>{article.japanese_title}</td>
        <td>{article.words}</td>
        <td>{Math.round(article.words / wpm * 10) / 10} mins</td>
        <td>{article.toeic}</td>
      </tr>
    )
  }
}

class ArticleTable extends React.Component {
  constructor (props) {
    super(props)
    this.handleClickSortAsc = this.handleClickSortAsc.bind(this)
    this.handleClickSortDesc = this.handleClickSortDesc.bind(this)
    this.handleClickSortByYourToeic = this.handleClickSortByYourToeic.bind(this)
  }

  handleClickSortAsc (event) {
    this.props.onClickSortAsc(event)
  }

  handleClickSortDesc (event) {
    this.props.onClickSortDesc(event)
  }

  handleClickSortByYourToeic (event) {
    this.props.onClickSortByYourToeic(event)
  }

  render () {
    const articles = this.props.articles
    const wpm = this.props.wpm
    const rows = []
    articles.forEach((article) => {
      rows.push(
        <ArticleRow
          article={article}
          key={article.title}
          wpm={wpm}
        />
      )
    })

    return (
      <table>
        <thead>
          <tr>
            <th>Source</th>
            <th>Title</th>
            <th>Japanese Title <img src={GoogleLogo}></img></th>
            <th>Words</th>
            <th>
              Time
              <button name="words" onClick={this.handleClickSortAsc}>↑</button>
              <button name="words" onClick={this.handleClickSortDesc}>↓</button>
            </th>
            <th>
              TOEIC
              <button name="toeic" onClick={this.handleClickSortAsc}>↑</button>
              <button name="toeic" onClick={this.handleClickSortDesc}>↓</button>
              <button name="toeic" onClick={this.handleClickSortByYourToeic}>You</button>
            </th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    )
  }
}

class SearchBar extends React.Component {
  constructor (props) {
    super(props)
    this.handleFilterTextChange = this.handleFilterTextChange.bind(this)
    this.handleFilterSourcesChange = this.handleFilterSourcesChange.bind(this)
  }

  handleFilterTextChange (event) {
    this.props.onFilterTextChange(event)
  }

  handleFilterSourcesChange (event) {
    this.props.onFilterSourcesChange(event)
  }

  render () {
    const checkboxes = []
    for (const [key, value] of Object.entries(this.props.filterSources)) {
      checkboxes.push(
        <label key={key}>
          <input
            id={key}
            type="checkbox"
            checked={value}
            onChange={this.handleFilterSourcesChange}
          />
          {key}
        </label>
      )
    }
    return (
      <form>
        <input
          type="text"
          placeholder="Search..."
          value={this.props.filterText}
          onChange={this.handleFilterTextChange}
        />
        {checkboxes}
      </form>
    )
  }
}

class FilterableArticleTable extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      error: null,
      isLoaded: false,
      filterText: '',
      filterSources: {},
      userInfo: { toeic: 600, wpm: 100 },
      articles: []
    }
    this.handleFilterTextChange = this.handleFilterTextChange.bind(this)
    this.handleFilterSourcesChange = this.handleFilterSourcesChange.bind(this)
    this.handleUserInfoChange = this.handleUserInfoChange.bind(this)
    this.handleClickSortAsc = this.handleClickSortAsc.bind(this)
    this.handleClickSortDesc = this.handleClickSortDesc.bind(this)
    this.handleClickSortByYourToeic = this.handleClickSortByYourToeic.bind(this)
  }

  componentDidMount () {
    fetch('api/articles')
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            articles: result
          })
          const filterSources = {}
          result.forEach((article) => {
            filterSources[article.source] = true
            this.setState({ filterSources: filterSources })
          })
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          })
        }
      )
  }

  handleFilterTextChange (event) {
    this.setState({ filterText: event.target.value })
  }

  handleFilterSourcesChange (event) {
    const newFilterSources = Object.assign({}, this.state.filterSources)
    newFilterSources[event.target.id] = event.target.checked
    this.setState({ filterSources: newFilterSources })
  }

  handleUserInfoChange (event) {
    const newUserInfo = Object.assign({}, this.state.userInfo)
    newUserInfo[event.target.name] = Number(event.target.value)
    this.setState({ userInfo: newUserInfo })
  }

  handleClickSortAsc (event) {
    const newArticles = this.state.articles
    newArticles.sort((a, b) => a[event.target.name] - b[event.target.name])
    this.setState({ articles: newArticles })
  }

  handleClickSortDesc (event) {
    const newArticles = this.state.articles
    newArticles.sort((a, b) => b[event.target.name] - a[event.target.name])
    this.setState({ articles: newArticles })
  }

  handleClickSortByYourToeic () {
    const newArticles = this.state.articles
    newArticles.sort((a, b) => Math.abs(a.toeic - this.state.userInfo.toeic) - Math.abs(b.toeic - this.state.userInfo.toeic))
    this.setState({ articles: newArticles })
  }

  render () {
    const { error, isLoaded, filterText, filterSources, userInfo, articles } = this.state
    if (error) {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
      return <div>Loading...</div>
    } else {
      const filteredArticles = []
      articles.forEach((article) => {
        const reg = new RegExp(filterText, 'i')
        if (!article.title.match(reg)) {
          return
        }
        if (filterSources[article.source] === false) {
          return
        }
        filteredArticles.push(article)
      })
      return (
        <div>
          <SearchBar
            filterText={filterText}
            filterSources={filterSources}
            onFilterTextChange={this.handleFilterTextChange}
            onFilterSourcesChange={this.handleFilterSourcesChange}
          />
          <label>
            Your TOEIC:
            <select name="toeic" value={userInfo.toeic} onChange={this.handleUserInfoChange}>
              { scores.map(s => <option key={s.toString()} value={s.toString()}>{s}</option>) }
            </select>
          </label>
          <label>
            Your WPM:
            <select name="wpm" value={userInfo.wpm} onChange={this.handleUserInfoChange}>
            { wpms.map(w => <option key={w.toString()} value={w.toString()}>{w}</option>) }
            </select>
          </label>
          <ArticleTable
            articles={filteredArticles}
            wpm={userInfo.wpm}
            onClickSortAsc={this.handleClickSortAsc}
            onClickSortDesc={this.handleClickSortDesc}
            onClickSortByYourToeic={this.handleClickSortByYourToeic}
          />
        </div>
      )
    }
  }
}

ArticleRow.propTypes = {
  article: PropTypes.shape({
    source: PropTypes.string,
    url: PropTypes.string,
    title: PropTypes.string,
    japanese_title: PropTypes.string,
    words: PropTypes.number,
    toeic: PropTypes.number
  }),
  wpm: PropTypes.number
}

ArticleTable.propTypes = {
  articles: PropTypes.array,
  wpm: PropTypes.number,
  onClickSortAsc: PropTypes.func,
  onClickSortDesc: PropTypes.func,
  onClickSortByYourToeic: PropTypes.func
}

SearchBar.propTypes = {
  filterText: PropTypes.string,
  onFilterTextChange: PropTypes.func,
  filterSources: PropTypes.objectOf(PropTypes.bool),
  onFilterSourcesChange: PropTypes.func
}

export default FilterableArticleTable
